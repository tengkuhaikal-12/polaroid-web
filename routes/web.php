<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Models\Product;

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

    Route::post('/products/{product}', [ProductController::class, 'update'])->name('product.update'); 
    Route::match(['post', 'put'], '/products/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('product.destroy');


    Route::inertia('/cart', 'cart/cart')->name('cart');
    Route::inertia('/checkout', 'checkout/checkout')->name('checkout');
});