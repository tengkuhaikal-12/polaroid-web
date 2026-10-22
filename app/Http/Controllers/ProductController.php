<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\FirebaseStorageService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected FirebaseStorageService $firebaseStorage
    ) {
    }

    /**
     * Convert the stored image path to a URL for the frontend.
     */
    private function formatProduct(Product $product): array
    {
        $data = $product->toArray();

        $data['image'] = $this->firebaseStorage->getUrl(
            $product->image
        );

        return $data;
    }

    /**
     * Display all products in the admin manager.
     */
    public function index(): Response
    {
        $products = Product::latest()
            ->get()
            ->map(fn(Product $product) => $this->formatProduct($product))
            ->values()
            ->all();

        return Inertia::render('product/ProductManager', [
            'products' => $products,
        ]);
    }

    /**
     * Show the create product form.
     */
    public function create(): Response
    {
        return Inertia::render('product/CreateProduct');
    }

    /**
     * Store a new product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'prints' => 'required|integer|min:1',
            'image' => 'nullable|image|max:32768',
            'color' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->firebaseStorage->upload(
                $request->file('image'),
                'products'
            );
        }

        Product::create($validated);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Show the edit product form.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('product/EditProduct', [
            'product' => $this->formatProduct($product),
        ]);
    }

    /**
     * Update an existing product.
     */
    public function update(
        Request $request,
        Product $product
    ): RedirectResponse {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'prints' => 'required|integer|min:1',
            'image' => 'nullable|image|max:32768',
            'color' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $newImagePath = $this->firebaseStorage->upload(
                $request->file('image'),
                'products'
            );

            // Delete the old image only after the new upload succeeds.
            if ($product->image) {
                $this->firebaseStorage->delete($product->image);
            }

            $validated['image'] = $newImagePath;
        } else {
            // Keep the existing stored image path.
            unset($validated['image']);
        }

        $product->update($validated);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            $this->firebaseStorage->delete($product->image);
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }
}
