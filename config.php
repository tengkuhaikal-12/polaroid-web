<?php
// This loads Composer's autoloader so your project knows about the Bayarcash SDK
require __DIR__ . '/vendor/autoload.php';

// REPLACE THESE WITH YOUR ACTUAL DETAILS FROM BAYARCASH
$apiToken = 'YOUR_API_TOKEN';
$apiSecretKey = 'YOUR_API_SECRET_KEY';
$portalKey = 'YOUR_PORTAL_KEY';

// Initialize the Bayarcash object
$bayarcash = new Webimpian\BayarcashSdk\Bayarcash($apiToken);

// Switch to sandbox (testing) mode so we don't use real money yet
$bayarcash->useSandbox();

// Set the API version to v3
$bayarcash->setApiVersion('v3');