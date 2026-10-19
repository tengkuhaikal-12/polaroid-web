<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Models\Product;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CartController;

/*
|--------------------------------------------------------------------------
| Public & General Pages
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'products' => Product::latest()->get(),
    ]);
})->name('home');

Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])->name('cart.items.update');
Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.items.destroy');
Route::inertia('/checkout', 'checkout/checkout')->name('checkout');
Route::inertia('/selfie', 'camera/CaptureSelfie')->name('selfie');

Route::inertia('/dashboard', 'dashboard/Dashboard')->name('dashboard')->middleware(['auth', 'verified']);


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::inertia('/login', 'auth/Login')->name('login');
Route::inertia('/register', 'auth/Register')->name('register');

// Handle Auth Actions
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');


/*
|--------------------------------------------------------------------------
| Product Management - Inertia Static Routes
|--------------------------------------------------------------------------
*/

Route::inertia('/products', 'product/ProductManager')->name('product.index');


/*
|--------------------------------------------------------------------------
| Product Management - Controller CRUD Routes (Protected for Admin)
|--------------------------------------------------------------------------
*/


Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
    Route::post('/products', [ProductController::class, 'store'])->name('product.store');

    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');

    Route::match(['post', 'put'], '/products/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('product.destroy');


    Route::inertia('/cart', 'cart/cart')->name('cart');
    Route::inertia('/checkout', 'checkout/checkout')->name('checkout');
});

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

Route::post('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
Route::get('/payment/return', [PaymentController::class, 'returnUrl'])->name('payment.return');
Route::post('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');