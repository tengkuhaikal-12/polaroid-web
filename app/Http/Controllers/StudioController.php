<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\StudioCollection;
use App\Services\StudioPricingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class StudioController extends Controller
{
    public function submitPrintRequest(
        Request $request,
        StudioPricingService $pricing
    ): RedirectResponse {
        $validated = $request->validate([
            'collection_id' => [
                'nullable',
                'integer',
                'exists:studio_collections,id',
            ],

            'quantity' => ['required', 'integer', 'min:0', 'max:144'],

            'style' => [
                'required',
                'in:regular,borderless,designed_border',
            ],

            'album' => ['required', 'boolean'],

            'design_json' => ['required', 'json', 'max:1000'],

            'photos' => ['required', 'array', 'max:144'],
            'photos.*.client_id' => ['required', 'string', 'max:100'],
            'photos.*.file' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
            'photos.*.is_selected' => ['required', 'boolean'],
            'photos.*.position' => ['required', 'integer', 'min:0'],
            'photos.*.placement' => ['nullable', 'json', 'max:10000'],

            'preview' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],

            'print_file' => [
                'nullable',
                'file',
                'mimes:pdf,png',
                'max:51200',
            ],
        ]);

        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        $quantity = (int) $validated['quantity'];
        $hasAlbum = (bool) $validated['album'];

        try {
            $pricing->validateQuantity($quantity);
        } catch (\InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'quantity' => $exception->getMessage(),
            ]);
        }

        $selectedPhotos = collect($validated['photos'])
            ->where('is_selected', true);

        if ($selectedPhotos->count() !== $quantity) {
            throw ValidationException::withMessages([
                'photos' => "Select exactly {$quantity} photos for printing.",
            ]);
        }

        if ($quantity === 0 && !$hasAlbum) {
            throw ValidationException::withMessages([
                'quantity' => 'Choose prints or an album before submitting.',
            ]);
        }

        $printingPrice = $pricing->calculatePrintingPrice(
            $quantity,
            $validated['style']
        );

        $albumPrice = $hasAlbum ? $pricing->getAlbumPrice() : 0.00;

        $total = round($printingPrice + $albumPrice, 2);

        $storedPaths = [];

        try {
            $order = DB::transaction(function () use ($request, $validated, $user, $quantity, $hasAlbum, $printingPrice, $albumPrice, $total, &$storedPaths) {
                $collectionId = $validated['collection_id'] ?? null;

                $collection = null;

                if ($collectionId) {
                    $collection = StudioCollection::query()
                        ->where('user_id', $user->id)
                        ->whereKey($collectionId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    if ($collection->order_id !== null) {
                        throw ValidationException::withMessages([
                            'collection_id' =>
                                'This collection already belongs to an order.',
                        ]);
                    }
                } else {
                    $collection = new StudioCollection();
                    $collection->user_id = $user->id;
                }

                $collection->status = 'submitted';
                $collection->design_json = json_decode(
                    $validated['design_json'],
                    true,
                    512,
                    JSON_THROW_ON_ERROR
                );
                $collection->printing_quantity = $quantity;
                $collection->printing_style = $validated['style'];
                $collection->album_option = $hasAlbum;
                $collection->printing_price = $printingPrice;
                $collection->album_price = $albumPrice;
                $collection->submitted_at = now();

                if ($request->hasFile('preview')) {
                    $path = $request->file('preview')->store(
                        "studio/{$user->id}/previews",
                        'local'
                    );

                    $storedPaths[] = $path;
                    $collection->preview_path = $path;
                }

                if ($request->hasFile('print_file')) {
                    $path = $request->file('print_file')->store(
                        "studio/{$user->id}/print-files",
                        'local'
                    );

                    $storedPaths[] = $path;
                    $collection->print_file_path = $path;
                }

                $collection->save();

                foreach ($validated['photos'] as $index => $photo) {
                    $path = $photo['file']->store(
                        "studio/{$user->id}/photos",
                        'local'
                    );

                    $storedPaths[] = $path;

                    $collection->photos()->create([
                        'position' => $photo['position'],
                        'image_path' => $path,
                        'placement' => isset($photo['placement'])
                            ? json_decode(
                                $photo['placement'],
                                true,
                                512,
                                JSON_THROW_ON_ERROR
                            )
                            : null,
                        'is_selected' => $photo['is_selected'],
                    ]);
                }

                $order = Order::create([
                    'customer_id' => $user->id,
                    'subtotal' => $total,
                    'total' => $total,
                    'status' => 'pending_review',
                    'submitted_at' => now(),
                ]);

                $collection->update([
                    'order_id' => $order->id,
                ]);

                return $order;
            });
        } catch (Throwable $exception) {
            foreach ($storedPaths as $path) {
                Storage::disk('local')->delete($path);
            }

            throw $exception;
        }

        return to_route('studio.orders.show', $order)
            ->with('success', 'Your print request has been submitted.');
    }
}
