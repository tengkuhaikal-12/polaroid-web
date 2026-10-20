<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudioOrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->whereHas('studioCollections')
            ->with([
                'customer:id,name,email',
                'studioCollections.photos',
            ])
            ->latest()
            ->paginate(20);

        return Inertia::render('seller/studio-orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        abort_unless(
            $order->studioCollections()->exists(),
            404
        );

        $order->load([
            'customer:id,name,email',
            'studioCollections.photos',
        ]);

        return Inertia::render('seller/studio-orders/show', [
            'order' => $order,
        ]);
    }

    public function approve(
        Order $order,
        Request $request
    ): RedirectResponse {
        DB::transaction(function () use ($order, $request) {
            $order = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status !== 'pending_review') {
                throw ValidationException::withMessages([
                    'order' => 'Only orders pending review can be approved.',
                ]);
            }

            $order->update([
                'status' => 'awaiting_payment',
                'approved_at' => now(),
                'seller_note' => $request->input('seller_note'),
            ]);

            $order->studioCollections()->update([
                'status' => 'approved',
                'approved_at' => now(),
                'seller_note' => $request->input('seller_note'),
            ]);
        });

        return back()->with(
            'success',
            'Order approved. The customer can now proceed to payment.'
        );
    }

    public function reject(
        Order $order,
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'seller_note' => ['required', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($order, $validated) {
            $order = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status !== 'pending_review') {
                throw ValidationException::withMessages([
                    'order' => 'Only orders pending review can be rejected.',
                ]);
            }

            $order->update([
                'status' => 'cancelled',
                'seller_note' => $validated['seller_note'],
            ]);

            $order->studioCollections()->update([
                'status' => 'rejected',
                'seller_note' => $validated['seller_note'],
            ]);
        });

        return back()->with('success', 'Print request rejected.');
    }

    public function updateProductionStatus(
        Order $order,
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:preparing,ready,completed',
            ],
        ]);

        $order->load('payments');

        if (!$order->payments()->where('status', 'paid')->exists()) {
            throw ValidationException::withMessages([
                'status' => 'The order must be paid before production.',
            ]);
        }

        $allowedTransitions = [
            'paid' => ['preparing'],
            'preparing' => ['ready'],
            'ready' => ['completed'],
        ];

        $current = $order->status;
        $next = $validated['status'];

        if (!in_array($next, $allowedTransitions[$current] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => 'Invalid production status transition.',
            ]);
        }

        DB::transaction(function () use ($order, $next) {
            $order = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            $order->update([
                'status' => $next,
                'completed_at' => $next === 'completed'
                    ? now()
                    : null,
            ]);

            if ($next === 'completed') {
                $order->studioCollections()->update([
                    'status' => 'completed',
                ]);
            }
        });

        return back()->with('success', 'Order status updated.');
    }
}
