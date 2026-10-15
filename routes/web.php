<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

use App\Models\Product; // Make sure this is imported

Route::get('/', function () {
    return Inertia::render('welcome', [
        'products' => Product::latest()->get(),
    ]);
})->name('home');

Route::inertia('/cart', 'cart/cart')->name('cart');
Route::inertia('/checkout', 'checkout/checkout')->name('checkout');
Route::inertia('/selfie', 'camera/CaptureSelfie')->name('selfie');

// Product Management CRUD Routes (Inertia)
Route::inertia('/products', 'product/ProductManager')->name('product.index');
Route::inertia('/products/create', 'product/CreateProduct')->name('product.create');
Route::inertia('/products/edit', 'product/EditProduct')->name('product.edit');

Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
Route::post('/products', [ProductController::class, 'store'])->name('product.store');
Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('product.destroy');

// Note: We use POST for update when uploading files, with a _method: 'put' override in Inertia.
Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
Route::post('/products/{product}', [ProductController::class, 'update'])->name('product.update'); 

Route::match(['post', 'put'], '/products/{product}', [ProductController::class, 'update'])->name('product.update');