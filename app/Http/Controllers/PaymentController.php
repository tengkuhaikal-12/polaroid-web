<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Bayarcash\Bayarcash;

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
            'amount' => 'required|numeric|min:0.01',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'payment_channel' => 'required|string',
        ]);

        $bayarcash = $this->getBayarcashInstance();
        $orderNo = 'ORD-' . strtoupper(uniqid());

        $data = [
            'portal_key' => config('bayarcash.portal_key'),
            'order_number' => $orderNo,
            'amount' => $request->amount,
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

        $response = $bayarcash->createPaymentIntent($data);

        if ($response && isset($response->url)) {
            return Inertia::location($response->url);
        }

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

        if (!$isValid) {
            return Inertia::render('payment/Status', [
                'status' => 'failed',
                'message' => 'Invalid payment response signature.',
            ]);
        }

        $status = $request->input('status') == '3' ? 'success' : 'pending';

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
                // TODO: Update your local database order / cart status to 'paid'
            }

            return response()->json(['status' => 'received'], 200);
        }

        return response()->json(['status' => 'invalid signature'], 400);
    }
}