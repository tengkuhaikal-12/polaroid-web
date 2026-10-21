<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    /**
     * Display all products in the admin manager.
     */
    public function index(): Response
    {
        $products = Product::latest()->get();

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
            $path = $request->file('image')->store('products', 'public');

            $validated['image'] = '/storage/' . $path;
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
            'product' => $product,
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
            // Delete the previous image if it exists.
            if ($product->image) {
                $oldImagePath = str_replace(
                    '/storage/',
                    '',
                    $product->image
                );

                Storage::disk('public')->delete($oldImagePath);
            }

            // Save the replacement image.
            $path = $request->file('image')->store('products', 'public');

            $validated['image'] = '/storage/' . $path;
        } else {
            // Preserve the current image if no new image was uploaded.
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
        // Delete the image from public storage.
        if ($product->image) {
            $imagePath = str_replace(
                '/storage/',
                '',
                $product->image
            );

            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }
}
