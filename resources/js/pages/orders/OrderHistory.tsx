import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    AlertCircle,
    ShoppingCart,
    Image as ImageIcon,
    Package,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import Navbar from '@/component/Navbar';

interface StudioPhoto {
    id: number;
    image_path: string | null;
    image_url: string | null;
    position?: number;
}

interface StudioCollection {
    id: number;
    printing_quantity: number;
    printing_style: string | null;
    album_option: boolean;
    photos: StudioPhoto[];
}

interface Order {
    id: number;
    product_name: string;
    customer_id: number;
    subtotal: string | number;
    total: string | number;
    billing_address_id: number | null;
    shipping_address_id: number | null;
    status:
        | 'checkout'
        | 'paid'
        | 'dispatched'
        | 'delivered'
        | 'cancelled'
        | 'canceled'
        | 'failed'
        | 'expired'
        | 'rejected';
    payment_type: string | null;
    created_at: string;
    updated_at: string;
    studio_collections: StudioCollection[];
}

interface OrdersProps {
    orders: Order[];
    [key: string]: unknown;
}

type OrderTab =
    | 'all'
    | 'pending'
    | 'dispatched'
    | 'delivered'
    | 'canceled'
    | 'rejected';

export default function OrderHistory({ orders }: OrdersProps) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState<OrderTab>('all');

    // Each order has its own expanded/collapsed state.
    // All orders start collapsed.
    const [expandedOrders, setExpandedOrders] = useState<
        Record<number, boolean>
    >({});

    const toggleOrder = (orderId: number) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const filteredOrders = orders.filter((order) => {
        switch (activeTab) {
            case 'all':
                return true;

            case 'pending':
                return (
                    order.status === 'checkout' ||
                    order.status === 'failed'
                );

            case 'dispatched':
                return (
                    order.status === 'dispatched' ||
                    order.status === 'paid'
                );

            case 'delivered':
                return order.status === 'delivered';

            case 'canceled':
                return (
                    order.status === 'canceled' ||
                    order.status === 'cancelled' ||
                    order.status === 'expired' ||
                    order.status === 'rejected'
                );

            default:
                return true;
        }
    });

    const getPaymentTypeLabel = (type: string | null) => {
        switch (type) {
            case '1':
                return 'FPX';
            case '5':
                return 'QR DuitNow';
            default:
                return type ?? '—';
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-1 text-xs font-black text-[#31513A]">
                        <CheckCircle2 className="h-4 w-4" />
                        {status.toUpperCase()}
                    </span>
                );

            case 'dispatched':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-3 py-1 text-xs font-black text-[#31513A]">
                        <Truck className="h-4 w-4" />
                        DISPATCHED
                    </span>
                );

            case 'checkout':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#FFD6DE] px-3 py-1 text-xs font-black text-[#31513A]">
                        <Clock className="h-4 w-4" />
                        PAYMENT PENDING
                    </span>
                );

            case 'canceled':
            case 'cancelled':
            case 'failed':
            case 'expired':
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-3 py-1 text-xs font-black text-white">
                        <XCircle className="h-4 w-4" />
                        {status.toUpperCase()}
                    </span>
                );

            default:
                return null;
        }
    };

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);

        return {
            date: parsedDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            time: parsedDate.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
            }),
        };
    };

    return (
        <>
            <Head title="My Order History" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A]">
                <Navbar auth={auth} />

                <main className="mx-auto max-w-5xl px-6 py-12">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="mb-3 inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-4 py-1 text-sm font-black shadow-[3px_3px_0_#31513A]">
                            📦 YOUR PURCHASES
                        </div>

                        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                            ORDER{' '}
                            <span className="text-[#F26B82]">
                                HISTORY
                            </span>{' '}
                            ♡
                        </h1>

                        <p className="mt-3 font-semibold text-[#55725D]">
                            Your printed memories, all in one place.
                        </p>
                    </div>

                    {/* Order Tabs */}
                    
                    <div className="mb-8 flex flex-wrap gap-3 border-b-4 border-[#31513A] pb-6">
                        {(
                            [
                                'all',
                                'pending',
                                'dispatched',
                                'delivered',
                                'canceled',
                                'rejected',
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                aria-pressed={activeTab === tab}
                                className={`rounded-full border-2 border-[#31513A] px-5 py-2 text-sm font-bold capitalize shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${activeTab === tab
                                        ? 'bg-[#F26B82] text-white'
                                        : 'bg-white text-[#31513A] hover:bg-[#F2EDC2]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                

                    {/* Orders */}
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-[2rem] border-4 border-[#31513A] bg-white p-12 text-center shadow-[7px_7px_0_#31513A]">
                            <div className="mb-4 flex justify-center">
                                <ShoppingCart className="h-14 w-14" />
                            </div>

                            <h3 className="text-2xl font-black">
                                No orders found here!
                            </h3>

                            <p className="mt-2 font-semibold text-[#55725D]">
                                Time to turn some camera roll memories into
                                physical prints.
                            </p>

                            <Link
                                href="/#shop"
                                className="mt-6 inline-block rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-6 py-3 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                Shop prints 🍓
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => {
                                const placedAt = formatDate(
                                    order.created_at
                                );

                                const collections =
                                    order.studio_collections ?? [];

                                const hasPhotos = collections.some(
                                    (collection) =>
                                        (collection.photos ?? []).length > 0
                                );

                                const isExpanded =
                                    !!expandedOrders[order.id];

                                return (
                                    <article
                                        key={order.id}
                                        className="overflow-hidden rounded-[2rem] border-2 border-[#31513A] bg-white"
                                    >
                                        {/* Main Item: Always Visible */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleOrder(order.id)
                                            }
                                            aria-expanded={isExpanded}
                                            aria-controls={`order - details - ${ order.id } `}
                                            className="flex w-full flex-col gap-4 bg-[#F2EDC2] p-5 text-left transition-colors hover:bg-[#EAE5B8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#55725D] md:flex-row md:items-center md:justify-between md:p-7"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full border-2 border-[#31513A] bg-white px-3 py-1 text-xs font-black">
                                                        ORDER #{order.id}
                                                    </span>

                                                    <span className="text-xs font-bold text-[#55725D]">
                                                        {placedAt.date} ·{' '}
                                                        {placedAt.time}
                                                    </span>
                                                </div>

                                                <h3 className="mt-3 break-words text-2xl font-black text-[#31513A] md:text-3xl">
                                                    {order.product_name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 md:justify-end">
                                                {getStatusBadge(order.status)}

                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#31513A] bg-white text-[#31513A]">
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </span>
                                            </div>
                                        </button>

                                        {/* Expandable Content */}
                                        {isExpanded && (
                                            <div
                                                id={`order - details - ${ order.id } `}
                                                className="border-t-2 border-[#31513A]"
                                            >
                                                {/* Order Information */}
                                                <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-7 lg:grid-cols-3">
                                                    {/* Payment Type */}
                                                    <div className="rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4">
                                                        <p className="text-xs font-black tracking-wider text-[#55725D]">
                                                            PAYMENT TYPE
                                                        </p>

                                                        <p className="mt-2 break-words font-black uppercase text-[#31513A]">
                                                            {getPaymentTypeLabel(
                                                                order.payment_type
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Pricing */}
                                                    <div className="rounded-2xl border-2 border-[#31513A] bg-[#CDE8B5] p-4">
                                                        <p className="text-xs font-black tracking-wider text-[#55725D]">
                                                            PRICING BREAKDOWN
                                                        </p>

                                                        <div className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold">
                                                            <span>
                                                                Subtotal
                                                            </span>
                                                            <span>
                                                                RM{' '}
                                                                {Number(
                                                                    order.subtotal
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>

                                                        <div className="my-2 border-t border-dashed border-[#31513A]/50" />

                                                        <div className="flex items-center justify-between gap-2 font-black text-[#31513A]">
                                                            <span>Total</span>
                                                            <span>
                                                                RM{' '}
                                                                {Number(
                                                                    order.total
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Address References */}
                                                    <div className="rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4 sm:col-span-2 lg:col-span-1">
                                                        <p className="text-xs font-black tracking-wider text-[#55725D]">
                                                            ADDRESS REFERENCES
                                                        </p>

                                                        <div className="mt-3 space-y-2 text-sm font-bold text-[#31513A]">
                                                            <p className="flex items-center justify-between gap-3">
                                                                <span>
                                                                    Billing ID
                                                                </span>
                                                                <span>
                                                                    #
                                                                    {order.billing_address_id ??
                                                                        '—'}
                                                                </span>
                                                            </p>

                                                            <p className="flex items-center justify-between gap-3">
                                                                <span>
                                                                    Shipping ID
                                                                </span>
                                                                <span>
                                                                    #
                                                                    {order.shipping_address_id ??
                                                                        '—'}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Uploaded Photos */}
                                                <div className="px-5 pb-5 md:px-7 md:pb-7">
                                                    <div className="mb-4 flex items-center justify-between gap-3">
                                                        <div>
                                                            <h4 className="text-lg font-black text-[#31513A]">
                                                                Your Photos
                                                            </h4>

                                                            <p className="mt-1 text-sm text-[#55725D]">
                                                                Photos linked to
                                                                your studio
                                                                collection.
                                                            </p>
                                                        </div>

                                                        <ImageIcon className="h-6 w-6 shrink-0 text-[#55725D]" />
                                                    </div>

                                                    {hasPhotos ? (
                                                        <div className="space-y-5">
                                                            {collections.map(
                                                                (
                                                                    collection
                                                                ) => {
                                                                    const photos =
                                                                        collection.photos ??
                                                                        [];

                                                                    if (
                                                                        photos.length ===
                                                                        0
                                                                    ) {
                                                                        return null;
                                                                    }

                                                                    return (
                                                                        <section
                                                                            key={
                                                                                collection.id
                                                                            }
                                                                            className="rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4"
                                                                        >
                                                                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                                <h5 className="font-black text-[#31513A]">
                                                                                    <Package className="mr-2 inline h-4 w-4" />
                                                                                    Collection
                                                                                    #
                                                                                    {
                                                                                        collection.id
                                                                                    }
                                                                                </h5>

                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {collection.printing_quantity !=
                                                                                        null && (
                                                                                        <span className="rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-3 py-1 text-xs font-black">
                                                                                            {
                                                                                                collection.printing_quantity
                                                                                            }{' '}
                                                                                            PRINTS
                                                                                        </span>
                                                                                    )}

                                                                                    {collection.album_option && (
                                                                                        <span className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-1 text-xs font-black">
                                                                                            ALBUM
                                                                                            INCLUDED
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                                                                {photos.map(
                                                                                    (
                                                                                        photo
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                photo.id
                                                                                            }
                                                                                            className="min-w-0 rounded-xl border-2 border-[#31513A] bg-white p-2 shadow-[3px_3px_0_#31513A]"
                                                                                        >
                                                                                            {photo.image_url ? (
                                                                                                <a
                                                                                                    href={
                                                                                                        photo.image_url
                                                                                                    }
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                    title="Open full-size photo"
                                                                                                    className="block overflow-hidden rounded-lg"
                                                                                                >
                                                                                                    <img
                                                                                                        src={
                                                                                                            photo.image_url
                                                                                                        }
                                                                                                        alt={`Uploaded photo ${ photo.id } `}
                                                                                                        loading="lazy"
                                                                                                        className="aspect-square w-full object-cover transition-transform duration-200 hover:scale-105"
                                                                                                    />
                                                                                                </a>
                                                                                            ) : (
                                                                                                <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-[#CDE8B5] p-3 text-center text-xs font-bold">
                                                                                                    <ImageIcon className="h-8 w-8" />
                                                                                                    Image
                                                                                                    unavailable
                                                                                                </div>
                                                                                            )}

                                                                                            <p className="mt-2 truncate text-center text-xs font-bold">
                                                                                                Photo
                                                                                                #
                                                                                                {
                                                                                                    photo.id
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </section>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-2xl border-2 border-dashed border-[#31513A] bg-[#FFF8EA] px-4 py-8 text-center">
                                                            <ImageIcon className="mx-auto mb-3 h-9 w-9 text-[#55725D]" />

                                                            <p className="font-black text-[#31513A]">
                                                                No uploaded
                                                                photos yet
                                                            </p>

                                                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#55725D]">
                                                                Photos will
                                                                appear here once
                                                                they are linked
                                                                to this order&apos;s
                                                                studio collection.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Paid Order: Receipt */}
                                                {order.status === 'paid' && (
                                                    <div className="border-t-2 border-[#31513A] bg-[#F2EDC2] p-5 md:px-7">
                                                        <a
                                                            href={`/ orders / ${ order.id }/receipt`}
className = "inline-flex w-full items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-3 text-sm font-black text-[#31513A] shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:w-auto"
    >
    Download Receipt ↓
                                                        </a >
                                                    </div >
                                                )}

{/* Pending Payment Actions */ }
{
    order.status ===
    'checkout' && (
        <div className="border-t-2 border-[#31513A] bg-[#FFF8EA] p-5 md:p-7">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F26B82]" />

                <div>
                    <p className="font-black text-[#31513A]">
                        Payment
                        pending
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-[#55725D]">
                        Complete
                        your payment
                        to secure
                        your order.
                        Please check
                        the payment
                        deadline
                        before
                        proceeding.
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() =>
                        router.post(
                            `/orders/${order.id}/checkout`
                        )
                    }
                    className="w-full rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-3 text-sm font-black text-[#31513A] shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:w-auto"
                >
                    Pay Now 🍓
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (
                            confirm(
                                'Are you sure you want to cancel this order?'
                            )
                        ) {
                            router.patch(
                                `/orders/${order.id}/cancel`,
                                {},
                                {
                                    preserveScroll:
                                        true,
                                }
                            );
                        }
                    }}
                    className="w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:w-auto"
                >
                    Cancel Order
                </button>
            </div>
        </div>
    )
}
                                            </div >
                                        )}
                                    </article >
                                );
                            })}
                        </div >
                    )}
                </main >
            </div >
        </>
    );
}
