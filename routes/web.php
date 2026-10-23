<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Product;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PhotoEditorController;
use App\Http\Controllers\StudioController;
use App\Http\Controllers\Seller\StudioOrderController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


/*
|--------------------------------------------------------------------------
| 1. Public Pages
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $products = Product::latest()->get()->map(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'prints' => $product->prints,
            'image' => app(\App\Services\FirebaseStorageService::class)->getUrl($product->image),
            'color' => $product->color,
        ];
    });

    return Inertia::render('welcome', [
        'products' => $products,
    ]);
})->name('home');

Route::get('/selfie', function () {
    return Inertia::render('camera/CaptureSelfie');
})->name('selfie');

Route::get('/photo-studio', [
    PhotoEditorController::class,
    'index',
])->name('photo-studio');

Route::get('/studio', function () {
    return Inertia::render('studio/Studio');
})->name('studio');


/*
|--------------------------------------------------------------------------
| 2. Authentication Pages and Actions
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'auth/Login')
        ->name('login');

    Route::inertia('/register', 'auth/Register')
        ->name('register');

    Route::post('/login', [AuthController::class, 'login'])
        ->name('login.store');

    Route::post('/register', [AuthController::class, 'register'])
        ->name('register.store');
});

Route::post('/logout', [AuthController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');


/*
|--------------------------------------------------------------------------
| 3. Shopping Cart
|--------------------------------------------------------------------------
*/

Route::get('/cart', [CartController::class, 'index'])
    ->name('cart');

Route::post('/cart/add-studio', [
    CartController::class,
    'addStudioItem',
])->name('cart.studio.add');

Route::middleware('auth')->group(function () {
    Route::post('/cart/items', [CartController::class, 'store'])
        ->name('cart.items.store');

    Route::patch('/cart/items/{cartItem}', [
        CartController::class,
        'update',
    ])->name('cart.items.update');

    Route::delete('/cart/items/{cartItem}', [
        CartController::class,
        'destroy',
    ])->name('cart.items.destroy');

    Route::post('/cart/add-studio', [
        CartController::class,
        'addStudioItem',
    ])->name('cart.studio.add');
});


/*
|--------------------------------------------------------------------------
| 4. Checkout
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/orders/{order}/receipt', [OrderController::class, 'receipt'])->name('orders.receipt');
    Route::post('/orders/{order}/checkout', [PaymentController::class, 'retry'])->name('orders.retry-payment');
});


/*
|--------------------------------------------------------------------------
| 5. Payment Gateway
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth')->group(function () {
    Route::post('/checkout', [
        PaymentController::class,
        'checkout',
    ])->name('payment.checkout');
});

Route::get('/payment/return', [
    PaymentController::class,
    'returnUrl',
])->name('payment.return');

Route::post('/payment/callback', [
    PaymentController::class,
    'callback',
])->name('payment.callback');


/*
|--------------------------------------------------------------------------
| 6. Customer Orders
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/orders', [
        OrderController::class,
        'index',
    ])->name('orders.index');

    Route::patch('/orders/{order}/cancel', [
        OrderController::class,
        'cancel',
    ])->name('orders.cancel');

    Route::post('/orders/{order}/checkout', [
        PaymentController::class,
        'retry',
    ])->name('orders.retry-payment');
});


/*
|--------------------------------------------------------------------------
| 7. Studio Print Requests
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth')->group(function () {
    Route::post('/studio/print-requests', [
        StudioController::class,
        'submitPrintRequest',
    ])->name('studio.print-requests.store');
});


/*
|--------------------------------------------------------------------------
| 8. Customer Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('dashboard/Dashboard');
})->middleware(['auth', 'verified'])
    ->name('dashboard');


/*
|--------------------------------------------------------------------------
| 9. Product Management
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/products', [
        ProductController::class,
        'index',
    ])->name('products.index');

    Route::get('/products/create', [
        ProductController::class,
        'create',
    ])->name('products.create');

    Route::post('/products', [
        ProductController::class,
        'store',
    ])->name('products.store');

    Route::get('/products/{product}/edit', [
        ProductController::class,
        'edit',
    ])->name('products.edit');

    Route::match(['put', 'post'], '/products/{product}', [
        ProductController::class,
        'update',
    ])->name('products.update');

    Route::delete('/products/{product}', [
        ProductController::class,
        'destroy',
    ])->name('products.destroy');
});


/*
|--------------------------------------------------------------------------
| 10. Seller Studio Order Management
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'seller'])
    ->prefix('seller')
    ->name('seller.')
    ->group(function () {
        Route::get('/studio-orders', [
            StudioOrderController::class,
            'index',
        ])->name('studio-orders.index');

        Route::get('/studio-orders/{order}', [
            StudioOrderController::class,
            'show',
        ])->name('studio-orders.show');

        Route::post('/studio-orders/{order}/approve', [
            StudioOrderController::class,
            'approve',
        ])->name('studio-orders.approve');

        Route::post('/studio-orders/{order}/reject', [
            StudioOrderController::class,
            'reject',
        ])->name('studio-orders.reject');

        Route::patch('/studio-orders/{order}/production-status', [
            StudioOrderController::class,
            'updateProductionStatus',
        ])->name('seller.studio-orders.production-status');

        Route::get(
            '/studio-orders/{order}/print-pdf',
            [StudioOrderController::class, 'downloadPrintPdf']
        )->name('studio-orders.print-pdf');
    });


/*
|--------------------------------------------------------------------------
| 11. Email Verification Route
|--------------------------------------------------------------------------
*/

Route::get('/email/verify', function() {
    return Inertia::render('auth/VerifyEmail');
})->middleware('auth')->name('verification.notice');

Route::get(
    '/email/verify/{id}/{hash}',
    function (EmailVerificationRequest $request) {
        $request->fulfill();

        return redirect('/dashboard')->with('success','Email verified successfully');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('status', 'verification-link-sent');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
