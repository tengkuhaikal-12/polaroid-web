<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\StudioCollection;
use App\Models\StudioPhoto;
use App\Services\FirebaseStorageService;
use App\Services\StudioPricingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CartController extends Controller
{
    public function __construct(
        protected FirebaseStorageService $firebaseStorage
    ) {
    }

    /**
     * Display the current signed-in or guest cart.
     */
    public function index(Request $request): Response
    {
        $cart = $this->currentCart($request);

        $cart->load([
            'items.product',
            'items.studioCollection.photos',
        ]);

        $cart->items->each(function (CartItem $item): void {
            // 1. Resolve normal product image URL
            if ($item->product && $item->product->image) {
                $item->product->setAttribute(
                    'image',
                    $this->firebaseStorage->getUrl($item->product->image)
                );
            }

            $collection = $item->studioCollection;

            if (!$collection) {
                return;
            }

            // 2. Resolve Studio collection preview URL
            if ($collection->preview_path) {
                $collection->setAttribute(
                    'preview_url',
                    $this->firebaseStorage->getUrl($collection->preview_path)
                );
            }

            // 3. Resolve Studio photos URLs
            $collection->photos->each(
                function (StudioPhoto $photo): void {
                    if ($photo->image_path) {
                        $photo->setAttribute(
                            'image_url',
                            $this->firebaseStorage->getUrl($photo->image_path)
                        );
                    }
                }
            );
        });

        return Inertia::render('cart/cart', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a normal product to the cart.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'options' => ['nullable', 'array'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $quantity = $validated['quantity'] ?? 1;

        if (
            $product->stock_quantity !== null &&
            $quantity > $product->stock_quantity
        ) {
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
                ->first(
                    fn(CartItem $cartItem) =>
                        $cartItem->options === $options
                );

            $newQuantity = ($item?->quantity ?? 0) + $quantity;

            if (
                $product->stock_quantity !== null &&
                $newQuantity > $product->stock_quantity
            ) {
                abort(422, 'The requested quantity is not available.');
            }

            if ($item) {
                $item->quantity = $newQuantity;
                $item->save();

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

    /**
     * Update a normal cart item's quantity.
     */
    public function update(
        Request $request,
        CartItem $cartItem
    ): RedirectResponse {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $this->ensureCurrentCartOwns($request, $cartItem);

        if (
            data_get($cartItem->options, 'type') ===
            'studio_polaroid_collection'
        ) {
            return back()->withErrors([
                'quantity' => 'Change the print quantity in Studio instead.',
            ]);
        }

        $cartItem->load('product');

        if (
            $cartItem->product->stock_quantity !== null &&
            $validated['quantity'] > $cartItem->product->stock_quantity
        ) {
            return back()->withErrors([
                'quantity' => 'The requested quantity is not available.',
            ]);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return back();
    }

    /**
     * Remove a cart item and its associated Studio collection.
     */
    public function destroy(
        Request $request,
        CartItem $cartItem
    ): RedirectResponse {
        $this->ensureCurrentCartOwns($request, $cartItem);

        $collection = StudioCollection::query()
            ->where('cart_item_id', $cartItem->id)
            ->first();

        $imagePaths = [];

        if ($collection) {
            $imagePaths = $collection->photos()
                ->pluck('image_path')
                ->filter()
                ->values()
                ->all();
        }

        DB::transaction(function () use ($cartItem, $collection): void {
            if ($collection) {
                $collection->photos()->delete();
                $collection->delete();
            }

            $cartItem->delete();
        });

        foreach ($imagePaths as $path) {
            $this->firebaseStorage->delete($path);
        }

        return back();
    }

    /**
     * Add a Studio collection and its uploaded photos to the cart.
     */
    public function addStudioItem(Request $request): RedirectResponse
    {
        // DEBUG: Test if the request hits the controller
        // return response()->json(['message' => 'Controller reached!']);

        $user = $request->user();

        abort_unless($user, 401);

        $validated = $request->validate([
            'collection_id' => ['nullable', 'integer', 'exists:studio_collections,id'],
            'photos' => ['required', 'array', 'min:1', 'max:144'],
            'photos.*.id' => ['nullable', 'integer'],
            'photos.*.image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:15360',
            ],
            'photos.*.is_selected' => ['required', 'boolean'],
            'photos.*.position' => ['required', 'integer', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0', 'max:144'],
            'style' => ['required', 'string', 'in:regular,borderless,designed_border'],
            'album' => ['required', 'boolean'],
        ]);

        $pricing = app(StudioPricingService::class);

        try {
            $pricing->validateQuantity($validated['quantity']);
        } catch (\InvalidArgumentException $exception) {
            return back()->withErrors([
                'quantity' => $exception->getMessage(),
            ]);
        }

        $printingPrice = $pricing->calculatePrintingPrice(
            $validated['quantity'],
            $validated['style']
        );

        $albumPrice = $validated['album']
            ? $pricing->getAlbumPrice()
            : 0.00;

        $totalPrice = $printingPrice + $albumPrice;

        $collection = null;

        if (!empty($validated['collection_id'])) {
            $collection = StudioCollection::query()
                ->whereKey($validated['collection_id'])
                ->where('user_id', $user->id)
                ->firstOrFail();

            abort_if(
                $collection->cart_item_id !== null ||
                $collection->order_id !== null,
                409,
                'This Studio collection is already attached to an order.'
            );
        }

        // Assumes product ID 1 is the generic Studio product.
        $product = Product::findOrFail(5);

        $newFiles = [];
        $oldFiles = [];

        try {
            DB::transaction(function () use ($request, $user, $validated, $printingPrice, $albumPrice, $totalPrice, $collection, $product, &$newFiles, &$oldFiles): void {
                $cart = $this->currentCart($request);

                $studioCollection = $collection ?? new StudioCollection();

                $studioCollection->fill([
                    'user_id' => $user->id,
                    'status' => 'in_cart',
                    'printing_quantity' => $validated['quantity'],
                    'printing_style' => $validated['style'],
                    'album_option' => $validated['album'],
                    'printing_price' => $printingPrice,
                    'album_price' => $albumPrice,
                ]);

                $studioCollection->save();

                foreach ($validated['photos'] as $photoData) {
                    /** @var UploadedFile $image */
                    $image = $photoData['image'];

                    $photo = null;

                    if (!empty($photoData['id'])) {
                        $photo = $studioCollection->photos()
                            ->whereKey($photoData['id'])
                            ->first();
                    }

                    $imagePath = $this->firebaseStorage->upload(
                        $image,
                        'studio-photos',
                        'studio_photo_' . $user->name . '_' . time()
                    );

                    $newFiles[] = $imagePath;

                    $attributes = [
                        'position' => $photoData['position'],
                        'image_path' => $imagePath,
                        'is_selected' => $photoData['is_selected'],
                    ];

                    if ($photo) {
                        if ($photo->image_path) {
                            $oldFiles[] = $photo->image_path;
                        }

                        // Update explicitly rather than calling update().
                        $photo->fill($attributes);
                        $photo->save();
                    } else {
                        $studioCollection->photos()->create($attributes);
                    }
                }

                $cartItem = $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => $totalPrice,
                    'options' => [
                        'type' => 'studio_polaroid_collection',
                        'studio_collection_id' => $studioCollection->id,
                        'config' => [
                            'quantity' => $validated['quantity'],
                            'style' => $validated['style'],
                            'album' => $validated['album'],
                        ],
                    ],
                ]);

                $studioCollection->cart_item_id = $cartItem->id;
                $studioCollection->save();
            });
        } catch (Throwable $exception) {
            foreach (array_unique($newFiles) as $path) {
                $this->firebaseStorage->delete($path);
            }

            report($exception);

            throw $exception;
        }

        foreach (array_unique($oldFiles) as $path) {
            if (!in_array($path, $newFiles, true)) {
                $this->firebaseStorage->delete($path);
            }
        }

        return to_route('cart')->with(
            'success',
            'Your Studio collection has been added to your cart.'
        );
    }

    /**
     * Get the current user's cart or guest session cart.
     */
    private function currentCart(Request $request): Cart
    {
        if ($request->user()) {
            return Cart::firstOrCreate([
                'user_id' => $request->user()->id,
            ]);
        }

        $session = $request->session();
        $cartId = $session->get('cart_id');

        if ($cartId) {
            $cart = Cart::query()
                ->whereKey($cartId)
                ->whereNull('user_id')
                ->where('session_id', $session->getId())
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        $cart = Cart::firstOrCreate([
            'session_id' => $session->getId(),
        ]);

        $session->put('cart_id', $cart->id);

        return $cart;
    }

    /**
     * Ensure the cart item belongs to the current cart.
     */
    private function ensureCurrentCartOwns(
        Request $request,
        CartItem $cartItem
    ): void {
        abort_unless(
            (int) $cartItem->cart_id ===
            (int) $this->currentCart($request)->id,
            404
        );
    }
}
