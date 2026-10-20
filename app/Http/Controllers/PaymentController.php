<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\StudioCollection;
use Bayarcash\Bayarcash;
use Bayarcash\Exceptions\ValidationException as BayarcashValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    private function getBayarcashInstance(): Bayarcash
    {
        $bayarcash = new Bayarcash(
            config('bayarcash.api_token')
        );

        if (config('bayarcash.sandbox')) {
            $bayarcash->useSandbox();
        }

        $bayarcash->setApiVersion('v3');

        return $bayarcash;
    }

    /**
     * Create an order and initiate payment using the account name and email.
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'cart_id' => [
                'required',
                'integer',
                'exists:carts,id',
            ],
            'payment_channel' => [
                'required',
                'string',
            ],
        ]);

        $user = $request->user();

        $name = $user->name;
        $email = $user->email;

        if (blank($name) || blank($email)) {
            return back()->withErrors([
                'account' => 'Please ensure your account has a name and email address.',
            ]);
        }

        $cart = Cart::with('items')->findOrFail(
            $validated['cart_id']
        );

        $this->ensureCartBelongsToRequester(
            $request,
            $cart
        );

        if ($cart->items->isEmpty()) {
            return back()->with(
                'error',
                'Your cart is empty.'
            );
        }

        $subtotal = $cart->items->sum(
            fn($item) =>
                (float) $item->quantity * (float) $item->price
        );

        $total = $subtotal + 5.00;

        $order = DB::transaction(function () use ($request, $cart, $subtotal, $total, $validated) {
            $order = Order::create([
                'customer_id' => $request->user()->id,
                'subtotal' => $subtotal,
                'total' => $total,
                'status' => 'checkout',
                'payment_type' => $validated['payment_channel'],
            ]);

            $cartItemIds = $cart->items
                ->pluck('id')
                ->all();

            $optionCollectionIds = $cart->items
                ->filter(function ($item) {
                    $options = $item->options ?? [];

                    return ($options['type'] ?? null)
                        === 'studio_polaroid_collection';
                })
                ->map(function ($item) {
                    $options = $item->options ?? [];

                    return $options['studio_collection_id'] ?? null;
                })
                ->filter()
                ->values()
                ->all();

            $collections = StudioCollection::query()
                ->where('user_id', $request->user()->id)
                ->whereNull('order_id')
                ->where(function ($query) use ($cartItemIds, $optionCollectionIds) {
                    if (!empty($cartItemIds)) {
                        $query->whereIn(
                            'cart_item_id',
                            $cartItemIds
                        );
                    }

                    if (!empty($optionCollectionIds)) {
                        if (!empty($cartItemIds)) {
                            $query->orWhereIn(
                                'id',
                                $optionCollectionIds
                            );
                        } else {
                            $query->whereIn(
                                'id',
                                $optionCollectionIds
                            );
                        }
                    }
                })
                ->lockForUpdate()
                ->get();

            foreach ($collections as $collection) {
                $collection->update([
                    'order_id' => $order->id,
                    'status' => 'pending_payment',
                ]);
            }

            return $order;
        });

        return $this->createPaymentAttempt(
            $order,
            $cart,
            $name,
            $email,
            $validated['payment_channel'],
        );
    }

    /**
     * Retry payment using the authenticated user's name and email.
     */
    public function retry(
        Order $order,
        Request $request
    ) {
        $user = $request->user();

        abort_unless(
            (int) $order->customer_id === (int) $user->id,
            404
        );

        abort_unless(
            $order->status === 'checkout',
            422
        );

        $cart = $order->payments()
            ->latest()
            ->first()
                ?->cart;

        abort_unless(
            $cart instanceof Cart,
            422,
            'This order cannot be resumed.'
        );

        $this->ensureCartBelongsToRequester(
            $request,
            $cart
        );

        return $this->createPaymentAttempt(
            $order,
            $cart,
            $user->name,
            $user->email,
            $order->payment_type ?? '1',
        );
    }

    /**
     * Create a Bayarcash payment attempt.
     */
    private function createPaymentAttempt(
        Order $order,
        Cart $cart,
        string $name,
        string $email,
        string $paymentChannel,
    ) {
        $amount = number_format(
            (float) $order->total,
            2,
            '.',
            ''
        );

        $bayarcash = $this->getBayarcashInstance();

        $orderNo = 'ORD-' . strtoupper(
            Str::random(20)
        );

        Payment::create([
            'cart_id' => $cart->id,
            'order_id' => $order->id,
            'order_number' => $orderNo,
            'amount' => $amount,
        ]);

        $data = [
            'portal_key' => config('bayarcash.portal_key'),
            'order_number' => $orderNo,
            'amount' => $amount,
            'payer_name' => $name,
            'payer_email' => $email,
            'callback_url' => route('payment.callback'),
            'return_url' => route('payment.return'),
            'payment_channel' => $paymentChannel,
        ];

        $checksum = $bayarcash->createPaymentIntentChecksumValue(
            config('bayarcash.secret_key'),
            $data
        );

        $data['checksum'] = $checksum;

        try {
            $response = $bayarcash->createPaymentIntent(
                $data,
                (string) Str::uuid()
            );
        } catch (BayarcashValidationException $exception) {
            Payment::where('order_number', $orderNo)
                ->update([
                    'status' => 'failed',
                ]);

            report($exception);

            return back()->with(
                'error',
                'Bayarcash rejected the payment details. Please check your payment configuration.'
            );
        }

        if ($response && isset($response->url)) {
            return Inertia::location(
                $response->url
            );
        }

        Payment::where('order_number', $orderNo)
            ->update([
                'status' => 'failed',
            ]);

        return back()->with(
            'error',
            'Unable to process payment request with Bayarcash.'
        );
    }

    /**
     * Handle the customer's return from Bayarcash.
     */
    public function returnUrl(Request $request)
    {
        $bayarcash = $this->getBayarcashInstance();
        $callbackData = $request->all();

        $isValid = $bayarcash->verifyReturnUrlCallbackData(
            $callbackData,
            config('bayarcash.secret_key')
        );

        if (!$isValid) {
            return Inertia::render('payment/Status', [
                'status' => 'failed',
                'message' => 'Invalid payment response signature.',
            ]);
        }

        $status = $request->input('status') == '3'
            ? 'success'
            : 'pending';

        if ($status === 'success') {
            $this->completePayment(
                $request->input('order_number'),
                $callbackData
            );
        }

        return Inertia::render('payment/Status', [
            'status' => $status,
            'order_number' => $request->input('order_number'),
            'transaction_id' => $request->input(
                'payment_intent_id'
            ),
        ]);
    }

    /**
     * Handle Bayarcash's server-to-server callback.
     */
    public function callback(Request $request)
    {
        $bayarcash = $this->getBayarcashInstance();
        $callbackData = $request->all();

        $isValid = $bayarcash->verifyTransactionCallbackData(
            $callbackData,
            config('bayarcash.secret_key')
        );

        if (!$isValid) {
            return response()->json([
                'status' => 'invalid signature',
            ], 400);
        }

        $orderNumber = $callbackData['order_number'] ?? null;
        $statusCode = $callbackData['status'] ?? null;

        if ($orderNumber && $statusCode == '3') {
            $this->completePayment(
                $orderNumber,
                $callbackData
            );
        }

        return response()->json([
            'status' => 'received',
        ], 200);
    }

    /**
     * Verify that the cart belongs to the requester.
     */
    private function ensureCartBelongsToRequester(
        Request $request,
        Cart $cart
    ): void {
        $user = $request->user();

        $isOwner = $user
            ? (int) $cart->user_id === (int) $user->id
            : $cart->id === $request->session()->get('cart_id');

        abort_unless($isOwner, 403);
    }

    /**
     * Mark payment, order and Studio collections as paid.
     */
    private function completePayment(
        ?string $orderNumber,
        array $callbackData
    ): void {
        if (!$orderNumber) {
            return;
        }

        DB::transaction(function () use ($orderNumber, $callbackData): void {
            $payment = Payment::query()
                ->where('order_number', $orderNumber)
                ->lockForUpdate()
                ->first();

            if (!$payment || $payment->status === 'paid') {
                return;
            }

            $payment->update([
                'status' => 'paid',
                'transaction_id' =>
                    $callbackData['payment_intent_id'] ?? null,
                'callback_payload' => $callbackData,
            ]);

            $payment->order?->update([
                'status' => 'paid',
            ]);

            if ($payment->order_id) {
                StudioCollection::query()
                    ->where('order_id', $payment->order_id)
                    ->update([
                        'status' => 'paid',
                    ]);
            }

            // Clear cart items after payment confirmation.
            $payment->cart?->items()->delete();
        });
    }
}
