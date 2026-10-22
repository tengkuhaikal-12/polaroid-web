<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\FirebaseStorageService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected FirebaseStorageService $firebaseStorage
    ) {
    }

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

        // Generate Firebase URLs for all Studio photos.
        $orders->each(function (Order $order): void {
            $order->studioCollections->each(function ($collection): void {
                $collection->photos->each(function ($photo): void {
                    $imageUrl = null;

                    if ($photo->image_path) {
                        $imageUrl = $this->firebaseStorage->getUrl(
                            $photo->image_path
                        );
                    }

                    $photo->setAttribute('image_url', $imageUrl);
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
        // Customers may only cancel their own orders.
        abort_unless(
            (int) $order->customer_id === (int) $request->user()->id,
            404
        );

        // Only orders awaiting checkout can be canceled.
        abort_unless(
            $order->status === 'checkout',
            422
        );

        $order->update([
            'status' => 'canceled',
        ]);

        return back()->with('success', 'Order canceled.');
    }

    /**
     * Download the order receipt PDF.
     */
    public function receipt(
        Request $request,
        Order $order
    ) {
        // Customers may only download their own receipts.
        abort_unless(
            (int) $order->customer_id === (int) $request->user()->id,
            404
        );

        $order->load([
            'customer',
            'items',
        ]);

        return Pdf::loadView('pdf.receipt', [
            'order' => $order,
        ])
            ->setPaper('a4')
            ->download("receipt-{$order->id}.pdf");
    }
}
