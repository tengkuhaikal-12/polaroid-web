import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Truck, PackageCheck, AlertCircle, ShoppingCart } from 'lucide-react';
import Navbar from '@/component/Navbar';

interface Order {
    id: number;
    customer_id: number;
    subtotal: string | number;
    total: string | number;
    billing_address_id: number | null;
    shipping_address_id: number | null;
    status: 'checkout' | 'paid' | 'dispatched' | 'delivered' | 'canceled' | 'failed' | 'expired';
    payment_type: string | null;
    created_at: string;
    updated_at: string;
}

interface OrdersProps {
    orders: Order[];
    [key: string]: unknown;
}

export default function OrderHistory({ orders }: OrdersProps) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'dispatched' | 'delivered' | 'canceled'>('all');

    // Helper to filter orders based on tabs
    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return order.status === 'checkout' || order.status === 'failed';
        if (activeTab === 'dispatched') return order.status === 'dispatched' || order.status === 'paid'; // Adjust based on your workflow
        if (activeTab === 'delivered') return order.status === 'delivered';
        if (activeTab === 'canceled') return order.status === 'canceled' || order.status === 'expired';
        return true;
    });

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-1 text-xs font-black text-[#31513A]">
                        <CheckCircle2 className="h-4 w-4" /> {status.toUpperCase()}
                    </span>
                );
            case 'dispatched':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-3 py-1 text-xs font-black text-[#31513A]">
                        <Truck className="h-4 w-4" /> DISPATCHED
                    </span>
                );
            case 'checkout':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#FFD6DE] px-3 py-1 text-xs font-black text-[#31513A]">
                        <Clock className="h-4 w-4" /> PAYMENT PENDING
                    </span>
                );
            case 'canceled':
            case 'failed':
            case 'expired':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-3 py-1 text-xs font-black text-white">
                        <XCircle className="h-4 w-4" /> {status.toUpperCase()}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="My Order History" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A]">
                {/* NAVBAR */}
                <Navbar auth={auth} />

                <main className="mx-auto max-w-5xl px-6 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-3 inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-4 py-1 text-sm font-black shadow-[3px_3px_0_#31513A] lowercase">
                            📦 YOUR PURCHASES
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-6xl lowercase">
                            ORDER <span className="text-[#F26B82]">HISTORY</span> ♡
                        </h1>

                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8 border-b-4 border-[#31513A] pb-6">
                        {(['all', 'pending', 'dispatched', 'delivered', 'canceled'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full border-2 border-[#31513A] px-5 py-2 text-sm transition capitalize shadow-[3px_3px_0_#31513A] hover:translate-x-0.5 font-black hover:translate-y-0.5 hover:shadow-none ${activeTab === tab ? 'bg-[#F26B82] text-white' : 'bg-white text-[#31513A]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-[2rem] border-4 border-[#31513A] bg-white p-12 text-center shadow-[7px_7px_0_#31513A]">
                            <div className="text-6xl mb-4 justify-center flex"><ShoppingCart className='w-15 h-15'/></div>
                            <h3 className="text-2xl font-black">No orders found here!</h3>
                            <p className="mt-2 font-semibold text-[#55725D]">
                                Time to turn some camera roll memories into physical prints.
                            </p>
                            <Link
                                href="/#shop"
                                className="mt-6 inline-block rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-6 py-3 first-letter:capitalize shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                shop prints 🍓
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-[2rem] border-4 border-[#31513A] bg-white p-6 shadow-[7px_7px_0_#31513A] md:p-8"
                                >
                                    <div className="flex flex-col justify-between gap-4 border-b-2 border-[#31513A] pb-5 md:flex-row md:items-center">
                                        <div>
                                            <span className="text-xs font-black text-[#55725D]">ORDER ID: #{order.id}</span>
                                            <div className="mt-1 flex items-center gap-3">
                                                <h3 className="text-2xl font-black">
                                                    RM {Number(order.total).toFixed(2)}
                                                </h3>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        <div className="text-sm font-semibold text-[#55725D]">
                                            Placed on: {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Order Details Grid */}
                                    <div className="grid gap-6 py-5 md:grid-cols-3">
                                        <div>
                                            <p className="text-xs font-black text-[#55725D]">PAYMENT TYPE</p>
                                            <p className="mt-1 font-bold uppercase">{order.payment_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#55725D]">PRICING BREAKDOWN</p>
                                            <p className="mt-1 font-semibold text-sm">Subtotal: RM {Number(order.subtotal).toFixed(2)}</p>
                                            <p className="font-semibold text-sm">Total: RM {Number(order.total).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#55725D]">ADDRESS REFERENCES</p>
                                            <p className="mt-1 text-xs font-semibold text-[#55725D]">
                                                Billing ID: #{order.billing_address_id ?? '—'} | Shipping ID: #{order.shipping_address_id ?? '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pending Payment Timer & Actions */}
                                    {order.status === 'checkout' && (
                                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-[#F26B82]" />
                                                <span className="text-sm font-bold">
                                                    Complete payment within 30 minutes to secure your order.
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.post(
                                                            `/orders/${order.id}/checkout`,
                                                        )
                                                    }
                                                    className="flex-1 sm:flex-none text-center rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 text-sm font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                                >
                                                    Pay Now 🍓
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to cancel this order?')) {
                                                            router.patch(`/orders/${order.id}/cancel`, {}, { preserveScroll: true });
                                                        }
                                                    }}
                                                    className="flex-1 sm:flex-none rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-2 text-sm font-black text-white shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
