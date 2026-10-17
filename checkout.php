<?php
// Include your configuration file
require 'config.php';

// Generate a unique order number (you can replace this with your database order ID)
$orderNo = 'ORD-' . time(); 
$orderAmount = '10.00';     // Amount in MYR (testing amount)

// Prepare the payment data
$data = [
    'portal_key'             => $portalKey,
    'order_number'           => $orderNo,
    'amount'                 => $orderAmount,
    'payer_name'             => 'Ali bin Abu',
    'payer_email'            => 'ali@example.com',
    'payer_telephone_number' => '0123456789',
    'callback_url'           => 'http://localhost:8000/cart', // Where Bayarcash sends server updates
    'return_url'             => 'http://localhost:8000/dashboard',   // Where the customer returns after paying
    'payment_channel'        => '1', // Channel code (e.g., FPX)
];

// 1. Generate a security checksum using your Secret Key
$checksum = $bayarcash->createPaymentIntentChecksumValue($apiSecretKey, $data);
$data['checksum'] = $checksum;

// 2. Send the payment intent request to Bayarcash
$response = $bayarcash->createPaymentIntent($data);

// 3. If successful, redirect the customer to the Bayarcash payment gateway
if ($response && isset($response->url)) {
    header("Location: " . $response->url);
    exit();
} else {
    echo "Error: Unable to process payment request.";
}