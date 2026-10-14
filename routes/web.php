<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/cart', 'cart/cart')->name('cart');
Route::inertia('/checkout', 'checkout/checkout')->name('checkout');
