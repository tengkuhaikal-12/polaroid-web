<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function create(){
        return Inertia::render('product/CreateProduct');
    }

    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('product/ProductManager', [
            'products' => $products,
        ]);
    }

    public function store (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'prints' => 'required|integer|min:1',
            'image' => 'nullable|image|max:327680',
            'color' => 'nullable|string|max:255',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        Product::create($validated);

        return redirect()->route('product.index')->with('success', 'Product created successfully!');
    }

    public function destroy(Product $product)
    {
        // Optional: delete the image file from storage if it exists
        if ($product->image) {
            $imagePath = str_replace('/storage/', 'public/', $product->image);
            Storage::delete($imagePath);
        }

        $product->delete();

        return redirect()->route('product.index')->with('success', 'Product deleted successfully! 🗑️');
    }

    public function edit(Product $product)
    {
        return Inertia::render('product/EditProduct', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'prints' => 'required|integer|min:1',
            'image' => 'nullable|image|max:327680',
            'color' => 'nullable|string|max:255',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($product->image) {
                $oldImagePath = str_replace('/storage/', 'public/', $product->image);
                Storage::delete($oldImagePath);
            }

            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        } else {

        //use same image if no new image is uploaded
            unset($validated['image']); // Prevent overwriting the image field if no new image is uploaded
        }

        $product->update($validated);

        return redirect()->route('product.index')->with('success', 'Product updated successfully!');
    }
}
