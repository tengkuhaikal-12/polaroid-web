<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\StudioCollection;
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

    /**
     * Create an order and initiate payment.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'cart_id' => ['required', 'integer', 'exists:carts,id'],
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string'],
            'payment_channel' => ['required', 'string'],
        ]);

        $cart = Cart::with('items')->findOrFail(
            $request->integer('cart_id')
        );

        $this->ensureCartBelongsToRequester($request, $cart);

        if ($cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        $subtotal = $cart->items->sum(
            fn ($item) => $item->quantity * $item->price
        );

        $total = $subtotal + 5;

        /*
         * Create the order and associate Studio collections
         * in one database transaction.
         */
        $order = DB::transaction(function () use (
            $request,
            $cart,
            $subtotal,
            $total
        ) {
            $order = Order::create([
                'customer_id' => $request->user()->id,
                'subtotal' => $subtotal,
                'total' => $total,
                'status' => 'checkout',
                'payment_type' => $request->input('payment_channel'),
            ]);

            $cartItemIds = $cart->items->pluck('id')->all();

            /*
             * First match collections through cart_item_id.
             * Also support collections identified in item options.
             */
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
                ->where(function ($query) use (
                    $cartItemIds,
                    $optionCollectionIds
                ) {
                    if (! empty($cartItemIds)) {
                        $query->whereIn('cart_item_id', $cartItemIds);
                    }

                    if (! empty($optionCollectionIds)) {
                        if (! empty($cartItemIds)) {
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

        /*
         * Preserve the Studio collections in the database.
         * Only remove the cart items after associating them.
         */
        $cart->items()->delete();

        return $this->createPaymentAttempt(
            $order,
            $cart,
            $request->name,
            $request->email,
            $request->phone,
            $request->input('payment_channel'),
        );
    }

    /**
     * Retry payment for an existing order.
     */
    public function retry(Order $order, Request $request)
    {
        abort_unless(
            $order->customer_id === $request->user()->id,
            404
        );

        abort_unless($order->status === 'checkout', 422);

        $cart = $order->payments()->latest()->first()?->cart;

        abort_unless(
            $cart instanceof Cart,
            422,
            'This order cannot be resumed.'
        );

        return $this->createPaymentAttempt(
            $order,
            $cart,
            $request->user()->name,
            $request->user()->email,
            $request->user()->phone ?? '0123456789',
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
        string $phone,
        string $paymentChannel,
    ) {
        $amount = number_format(
            (float) $order->total,
            2,
            '.',
            ''
        );

        $bayarcash = $this->getBayarcashInstance();

        $orderNo = 'ORD-' . strtoupper(Str::random(20));

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
            'payer_telephone_number' => $phone,
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
        } catch (ValidationException $exception) {
            Payment::where('order_number', $orderNo)
                ->update(['status' => 'failed']);

            report($exception);

            return back()->with(
                'error',
                'Bayarcash rejected the payment details. Please check your payment configuration.'
            );
        }

        if ($response && isset($response->url)) {
            return Inertia::location($response->url);
        }

        Payment::where('order_number', $orderNo)
            ->update(['status' => 'failed']);

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

        if (! $isValid) {
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
            'transaction_id' => $request->input('payment_intent_id'),
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

        if (! $isValid) {
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
        $isOwner = $request->user()
            ? $cart->user_id === $request->user()->id
            : $cart->id === $request->session()->get('cart_id');

        abort_unless($isOwner, 403);
    }

    /**
     * Mark the payment, order and Studio collections as paid.
     *
     * PDF generation will be handled separately after confirmation.
     */
    private function completePayment(
        ?string $orderNumber,
        array $callbackData
    ): void {
        if (! $orderNumber) {
            return;
        }

        DB::transaction(function () use (
            $orderNumber,
            $callbackData
        ): void {
            $payment = Payment::query()
                ->where('order_number', $orderNumber)
                ->lockForUpdate()
                ->first();

            if (! $payment) {
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

            $payment->cart?->items()->delete();
        });
    }
}