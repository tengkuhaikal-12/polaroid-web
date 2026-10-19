<?php

namespace App\Http\Controllers;

use App\Models\Order;
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
}
