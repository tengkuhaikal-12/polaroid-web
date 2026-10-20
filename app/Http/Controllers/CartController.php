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
use App\Models\StudioCollection;
use Illuminate\Support\Facades\Storage;
use Throwable;

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

    /**
     * Add a nine-photo Studio collection to the cart.
     */

    /**
     * Add a nine-photo Studio collection to the cart.
     */
    public function addStudioItem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'polaroids' => ['required', 'array', 'size:9'],
            'polaroids.*.photo' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ]);

        // Your current database contains product ID 1, named "Haikal".
        // Confirm this is the intended product before charging its price.
        $product = Product::find(1);

        if (!$product) {
            return back()->withErrors([
                'polaroids' => 'The Polaroid printing product was not found.',
            ]);
        }

        $storedPaths = [];

        try {
            // Store image files outside the public directory.
            foreach ($validated['polaroids'] as $polaroid) {
                $path = $polaroid['photo']->store(
                    "studio/{$request->user()->id}",
                    'local'
                );

                if (!$path) {
                    throw new \RuntimeException(
                        'Failed to store a Studio photo.'
                    );
                }

                $storedPaths[] = $path;
            }

            DB::transaction(function () use ($request, $product, $storedPaths): void {
                $cart = $this->currentCart($request);

                // Create a persistent collection.
                $collection = StudioCollection::create([
                    'user_id' => $request->user()->id,
                    'status' => 'in_cart',
                ]);

                // Save the nine photos in their original order.
                foreach ($storedPaths as $index => $path) {
                    $collection->photos()->create([
                        'position' => $index + 1,
                        'image_path' => $path,
                    ]);
                }

                // Keep this collection as one separate cart item.
                $cartItem = $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => $product->price,
                    'options' => [
                        'type' => 'studio_polaroid_collection',
                        'studio_collection_id' => $collection->id,
                    ],
                ]);

                $collection->update([
                    'cart_item_id' => $cartItem->id,
                ]);
            });
        } catch (Throwable $exception) {
            // Uploaded files are not rolled back by a DB transaction.
            foreach ($storedPaths as $path) {
                Storage::disk('local')->delete($path);
            }

            report($exception);

            return back()->withErrors([
                'polaroids' =>
                    'Unable to save your Studio collection. Please try again.',
            ]);
        }

        return to_route('cart')->with(
            'success',
            'Your nine Polaroids have been added to your cart.'
        );
    }

}
