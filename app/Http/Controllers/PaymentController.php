<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Payment;
use Bayarcash\Bayarcash;
use Bayarcash\Exceptions\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    private function getBayarcashInstance(): Bayarcash
    {

        $bayarcash = new Bayarcash(config('bayarcash.api_token'));

        if (config('bayarcash.sandbox')) {
            $bayarcash->useSandbox();
        }

        $bayarcash->setApiVersion('v3');

        return $bayarcash;
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'cart_id' => ['required', 'integer', 'exists:carts,id'],
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'payment_channel' => 'required|string',
        ]);

        $cart = Cart::with('items')->findOrFail($request->integer('cart_id'));
        $this->ensureCartBelongsToRequester($request, $cart);

        if ($cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        // The total always comes from the server-side cart, never the browser.
        $amount = number_format(
            $cart->items->sum(fn ($item) => $item->quantity * $item->price) + 5,
            2,
            '.',
            '',
        );
        $bayarcash = $this->getBayarcashInstance();
        // Bayarcash permits a maximum of 30 characters for an order number.
        $orderNo = 'ORD-'.strtoupper(Str::random(20));

        Payment::create([
            'cart_id' => $cart->id,
            'order_number' => $orderNo,
            'amount' => $amount,
        ]);

        $data = [
            'portal_key' => config('bayarcash.portal_key'),
            'order_number' => $orderNo,
            'amount' => $amount,
            'payer_name' => $request->name,
            'payer_email' => $request->email,
            'payer_telephone_number' => $request->phone,
            'callback_url' => route('payment.callback'),
            'return_url' => route('payment.return'),
            'payment_channel' => $request->input('payment_channel'),
        ];

        // Generate checksum for enhanced security
        $checksum = $bayarcash->createPaymentIntentChecksumValue(config('bayarcash.secret_key'), $data);
        $data['checksum'] = $checksum;

        try {
            $response = $bayarcash->createPaymentIntent($data, (string) Str::uuid());
        } catch (ValidationException $exception) {
            Payment::where('order_number', $orderNo)->update(['status' => 'failed']);
            report($exception);

            return back()->with(
                'error',
                'Bayarcash rejected the payment details. Please check your payment configuration.',
            );
        }

        if ($response && isset($response->url)) {
            return Inertia::location($response->url);
        }

        Payment::where('order_number', $orderNo)->update(['status' => 'failed']);

        return back()->with(
            'error',
            'Unable to process payment request with Bayarcash.'
        );
    }

    public function returnUrl(Request $request)
    {
        $bayarcash = $this->getBayarcashInstance();
        $callbackData = $request->all();

        // Verify Return URL callback data authenticity
        $isValid = $bayarcash->verifyReturnUrlCallbackData($callbackData, config('bayarcash.secret_key'));

        if (! $isValid) {
            return Inertia::render('payment/Status', [
                'status' => 'failed',
                'message' => 'Invalid payment response signature.',
            ]);
        }

        $status = $request->input('status') == '3' ? 'success' : 'pending';

        if ($status === 'success') {
            $this->completePayment($request->input('order_number'), $callbackData);
        }

        return Inertia::render('payment/Status', [
            'status' => $status,
            'order_number' => $request->input('order_number'),
            'transaction_id' => $request->input('payment_intent_id'),
        ]);
    }

    public function callback(Request $request)
    {
        $bayarcash = $this->getBayarcashInstance();
        $callbackData = $request->all();

        // Verify Server-to-Server Transaction Callback
        $isValid = $bayarcash->verifyTransactionCallbackData($callbackData, config('bayarcash.secret_key'));

        if ($isValid) {
            $orderNumber = $callbackData['order_number'] ?? null;
            $statusCode = $callbackData['status'] ?? null; // '3' indicates success

            if ($orderNumber && $statusCode == '3') {
                $this->completePayment($orderNumber, $callbackData);
            }

            return response()->json(['status' => 'received'], 200);
        }

        return response()->json(['status' => 'invalid signature'], 400);
    }

    private function ensureCartBelongsToRequester(Request $request, Cart $cart): void
    {
        $isOwner = $request->user()
            ? $cart->user_id === $request->user()->id
            : $cart->id === $request->session()->get('cart_id');

        abort_unless($isOwner, 403);
    }

    /** Mark the payment paid and empty its cart. Safe for return and callback retries. */
    private function completePayment(?string $orderNumber, array $callbackData): void
    {
        if (! $orderNumber) {
            return;
        }

        DB::transaction(function () use ($orderNumber, $callbackData): void {
            $payment = Payment::query()
                ->where('order_number', $orderNumber)
                ->lockForUpdate()
                ->first();

            if (! $payment) {
                return;
            }

            $payment->update([
                'status' => 'paid',
                'transaction_id' => $callbackData['payment_intent_id'] ?? null,
                'callback_payload' => $callbackData,
            ]);

            $payment->cart->items()->delete();
        });
    }
}
