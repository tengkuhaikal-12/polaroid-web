<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /** Display the current signed-in or guest cart. */
    public function index(Request $request): Response
    {
        $cart = $this->currentCart($request);
        $cart->load('items.product');

        return Inertia::render('cart/cart', [
            'cart' => $cart,
        ]);
    }

    /** Add a product to the current cart, preserving its price at this time. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'options' => ['nullable', 'array'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $quantity = $validated['quantity'] ?? 1;

        if ($product->stock_quantity !== null && $quantity > $product->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'The requested quantity is not available.',
            ]);
        }

        DB::transaction(function () use ($request, $product, $quantity, $validated): void {
            $cart = $this->currentCart($request);
            $options = $validated['options'] ?? null;

            $item = $cart->items()
                ->where('product_id', $product->id)
                ->get()
                ->first(fn (CartItem $cartItem) => $cartItem->options === $options);

            $newQuantity = ($item?->quantity ?? 0) + $quantity;

            if ($product->stock_quantity !== null && $newQuantity > $product->stock_quantity) {
                abort(422, 'The requested quantity is not available.');
            }

            if ($item) {
                $item->update(['quantity' => $newQuantity]);

                return;
            }

            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'options' => $options,
            ]);
        });

        return to_route('cart')->with('success', 'Added to your cart.');
    }

    /** Change an item's quantity without changing its saved price. */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $this->ensureCurrentCartOwns($request, $cartItem);
        $cartItem->load('product');

        if ($cartItem->product->stock_quantity !== null
            && $validated['quantity'] > $cartItem->product->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'The requested quantity is not available.',
            ]);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return back();
    }

    /** Remove an item from the current cart. */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->ensureCurrentCartOwns($request, $cartItem);
        $cartItem->delete();

        return back();
    }

    private function currentCart(Request $request): Cart
    {
        if ($request->user()) {
            return Cart::firstOrCreate(['user_id' => $request->user()->id]);
        }

        $session = $request->session();
        $cartId = $session->get('cart_id');

        if ($cartId && ($cart = Cart::find($cartId))) {
            return $cart;
        }

        $cart = Cart::firstOrCreate(['session_id' => $session->getId()]);
        // Writing the cart ID also ensures the guest's Laravel session is persisted.
        $session->put('cart_id', $cart->id);

        return $cart;
    }

    private function ensureCurrentCartOwns(Request $request, CartItem $cartItem): void
    {
        abort_unless(
            $cartItem->cart_id === $this->currentCart($request)->id,
            404,
        );
    }
}
