<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('orders/OrderHistory', [
            'orders' => Order::query()
                ->where('customer_id', $request->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 404);
        abort_unless($order->status === 'checkout', 422);

        $order->update(['status' => 'canceled']);

        return back()->with('success', 'Order canceled.');
    }

    public function receipt(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 404);

        $order->load('customer', 'items');

        return Pdf::loadView('pdf.receipt', ['order' => $order])
            ->setPaper('a4')
            ->download("receipt-{$order->id}.pdf");
    }
}
