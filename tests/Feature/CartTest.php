<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

function cartProduct(array $attributes = []): Product
{
    return Product::create([
        'name' => 'Classic Print Pack',
        'price' => 12.50,
        'prints' => 10,
        'stock_quantity' => 5,
        ...$attributes,
    ]);
}

test('a guest can add a product to a persistent cart', function () {
    $product = cartProduct();

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ])->assertRedirect(route('cart'));

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => 12.50,
    ]);

    $this->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('cart/cart')
            ->has('cart.items', 1)
            ->where('cart.items.0.product.id', $product->id));
});

test('adding an existing product increases its quantity and retains its original price', function () {
    $product = cartProduct();

    $this->post(route('cart.items.store'), ['product_id' => $product->id]);
    $product->update(['price' => 15.00]);
    $this->post(route('cart.items.store'), ['product_id' => $product->id]);

    expect(Cart::count())->toBe(1)
        ->and(CartItem::query()->sole())->quantity->toBe(2)
        ->and(CartItem::query()->sole())->price->toBe('12.50');
});

test('a cart item cannot exceed the available stock', function () {
    $product = cartProduct(['stock_quantity' => 2]);

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 3,
    ])->assertSessionHasErrors('quantity');

    $this->assertDatabaseCount('cart_items', 0);
});
