<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display the authenticated customer's order history.
     */
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('customer_id', $request->user()->id)
            ->with([
                'studioCollections.photos',
            ])
            ->latest()
            ->get();

        // Generate public image URLs for every uploaded Studio photo.
        $orders->each(function (Order $order): void {
            $order->studioCollections->each(function ($collection): void {
                $collection->photos->each(function ($photo): void {
                    $photo->setAttribute(
                        'image_url',
                        $photo->image_path
                        ? Storage::disk('public')->url(
                            $photo->image_path
                        )
                        : null
                    );
                });
            });
        });

        return Inertia::render('orders/OrderHistory', [
            'orders' => $orders,
        ]);
    }

    /**
     * Cancel an unpaid order.
     */
    public function cancel(
        Request $request,
        Order $order
    ) {
        abort_unless(
            (int) $order->customer_id === (int) $request->user()->id,
            404
        );

        abort_unless(
            $order->status === 'checkout',
            422
        );

        $order->update([
            'status' => 'canceled',
        ]);

        return back()->with(
            'success',
            'Order canceled.'
        );
    }
}
