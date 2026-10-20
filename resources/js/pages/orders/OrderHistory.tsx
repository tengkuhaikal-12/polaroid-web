
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
    | 'canceled'
    | 'failed'
    | 'expired';
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
    | 'canceled';

export default function OrderHistory({ orders }: OrdersProps) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState<OrderTab>('all');

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
                    order.status === 'expired'
                );

            default:
                return true;
        }
    });

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
            case 'failed':
            case 'expired':
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
            date: parsedDate.toLocaleDateString(),
            time: parsedDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    };

    return (
        <>
            <Head title="My Order History" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A]">
                <Navbar auth={auth} />

                <main className="mx-auto max-w-5xl px-6 py-12">
                    {/* Header */}
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

                    {/* Tabs */}
                    <div className="mb-8 flex flex-wrap gap-3 border-b-4 border-[#31513A] pb-6">
                        {(
                            [
                                'all',
                                'pending',
                                'dispatched',
                                'delivered',
                                'canceled',
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full border-2 border-[#31513A] px-5 py-2 text-sm font-black capitalize shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${activeTab === tab
                                        ? 'bg-[#F26B82] text-white'
                                        : 'bg-white text-[#31513A]'
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

                                return (
                                    <article
                                        key={order.id}
                                        className="rounded-[2rem] border-4 border-[#31513A] bg-white p-6 shadow-[7px_7px_0_#31513A] md:p-8"
                                    >
                                        {/* Order header */}
                                        <div className="flex flex-col justify-between gap-4 border-b-2 border-[#31513A] pb-5 md:flex-row md:items-center">
                                            <div>
                                                <span className="text-xs font-black text-[#55725D]">
                                                    ORDER ID: #{order.id}
                                                </span>

                                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                                    <h3 className="text-2xl font-black">
                                                        {order.id}
                                                    </h3>

                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-sm font-semibold text-[#55725D]">
                                                Placed on: {placedAt.date} at{' '}
                                                {placedAt.time}
                                            </div>
                                        </div>

                                        {/* Order details */}
                                        <div className="grid gap-6 py-5 md:grid-cols-3">
                                            <div>
                                                <p className="text-xs font-black text-[#55725D]">
                                                    PAYMENT TYPE
                                                </p>

                                                <p className="mt-1 font-bold uppercase">
                                                    {order.payment_type ?? '—'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-black text-[#55725D]">
                                                    PRICING BREAKDOWN
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    Subtotal: RM{' '}
                                                    {Number(
                                                        order.subtotal
                                                    ).toFixed(2)}
                                                </p>

                                                <p className="text-sm font-semibold">
                                                    Total: RM{' '}
                                                    {Number(
                                                        order.total
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-black text-[#55725D]">
                                                    ADDRESS REFERENCES
                                                </p>

                                                <p className="mt-1 text-xs font-semibold text-[#55725D]">
                                                    Billing ID: #
                                                    {order.billing_address_id ??
                                                        '—'}{' '}
                                                    | Shipping ID: #
                                                    {order.shipping_address_id ??
                                                        '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {order.status === 'paid' && (
                                        <a
                                            href={`/orders/${order.id}/receipt`}
                                            className="inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 text-sm font-black shadow-[3px_3px_0_#31513A]"
                                        >
                                            Download Receipt
                                        </a>
                                    )}

                                    {/* Pending Payment Timer & Actions */}
                                    {order.status === 'checkout' && (
                                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-[#F26B82]" />
                                                <span className="text-sm font-bold">
                                                    Complete payment within 30 minutes to secure your order.
                                                </span>
                                            </div>

                                            {hasPhotos ? (
                                                <div className="space-y-6">
                                                    {collections.map(
                                                        (collection) => {
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
                                                                >
                                                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                                        <p className="font-black">
                                                                            <Package className="mr-1 inline h-4 w-4" />
                                                                            Collection
                                                                            #
                                                                            {
                                                                                collection.id
                                                                            }
                                                                        </p>

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
                                                                                    className="overflow-hidden rounded-xl border-2 border-[#31513A] bg-[#FFF8EA] p-2 shadow-[3px_3px_0_#31513A]"
                                                                                >
                                                                                    {photo.image_url ? (
                                                                                        <a
                                                                                            href={
                                                                                                photo.image_url
                                                                                            }
                                                                                            target="_blank"
                                                                                            rel="noreferrer"
                                                                                            className="block"
                                                                                            title="Open full-size photo"
                                                                                        >
                                                                                            <img
                                                                                                src={
                                                                                                    photo.image_url
                                                                                                }
                                                                                                alt={`Uploaded photo ${photo.id}`}
                                                                                                loading="lazy"
                                                                                                className="aspect-square w-full rounded-lg object-cover transition hover:scale-[1.02]"
                                                                                            />
                                                                                        </a>
                                                                                    ) : (
                                                                                        <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-[#CDE8B5] p-3 text-center text-xs font-bold">
                                                                                            <ImageIcon className="h-8 w-8" />
                                                                                            Image unavailable
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
                                                <div className="rounded-2xl border-2 border-dashed border-[#31513A] bg-[#FFF8EA] p-6 text-center">
                                                    <ImageIcon className="mx-auto mb-2 h-8 w-8 text-[#55725D]" />

                                                    <p className="font-bold">
                                                        No uploaded photos
                                                        linked to this order.
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#55725D]">
                                                        Photos will appear here
                                                        when they are linked to
                                                        this order's Studio
                                                        collection.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pending payment actions */}
                                        {order.status === 'checkout' && (
                                            <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] p-4 sm:flex-row">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5 shrink-0 text-[#F26B82]" />

                                                    <span className="text-sm font-bold">
                                                        Complete payment to
                                                        secure your order.
                                                    </span>
                                                </div>

                                                <div className="flex w-full items-center gap-3 sm:w-auto">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.post(
                                                                `/orders/${order.id}/checkout`
                                                            )
                                                        }
                                                        className="flex-1 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 text-sm font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:flex-none"
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
                                                        className="flex-1 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-2 text-sm font-black text-white shadow-[3px_3px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:flex-none"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
