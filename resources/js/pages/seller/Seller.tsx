import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Eye,
    Printer,
    Ban,
    CheckCircle2,
    Package,
} from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Photo {
    id: number;
}

interface StudioCollection {
    id: number;
    status: string;
    photos: Photo[];
}

interface Order {
    id: number;
    status: string;
    total_amount?: number | string;
    created_at: string;
    customer: Customer;
    studio_collections: StudioCollection[];
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    orders: PaginatedOrders;
}

type OrderFilter =
    | 'all'
    | 'cancelled'
    | 'in_production'
    | 'completed';

const statusStyles: Record<string, string> = {
    pending_review: 'bg-amber-100 text-amber-800',
    awaiting_payment: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-teal-100 text-teal-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export default function StudioOrdersIndex({ orders }: Props) {
    const allOrders = orders.data;

    const [activeFilter, setActiveFilter] =
        useState<OrderFilter>('all');

    const stats = [
        {
            label: 'Total Orders',
            value: orders.total,
            status: 'all' as const,
            icon: Package,
            color: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'In Production',
            value: allOrders.filter(
                (order) =>
                    ['preparing', 'ready'].includes(order.status),
            ).length,
            status: 'in_production' as const,
            icon: Printer,
            color: 'bg-purple-50 text-purple-700',
        },
        {
            label: 'Completed',
            value: allOrders.filter(
                (order) => order.status === 'completed',
            ).length,
            status: 'completed' as const,
            icon: CheckCircle2,
            color: 'bg-green-50 text-green-700',
        },
        {
            label: 'Cancelled',
            value: allOrders.filter(
                (order) => order.status === 'cancelled',
            ).length,
            status: 'cancelled' as const,
            icon: Ban,
            color: 'bg-red-50 text-amber-700',
        },
    ];

    const filteredOrders = allOrders.filter((order) => {
        switch (activeFilter) {
            case 'cancelled':
                return order.status === 'cancelled';

            case 'in_production':
                return ['preparing', 'ready'].includes(order.status);

            case 'completed':
                return order.status === 'completed';

            case 'all':
            default:
                return true;
        }
    });

    const activeLabel =
        stats.find((stat) => stat.status === activeFilter)?.label ??
        'Total Orders';

    return (
        <>
            <Head title="Studio Orders | Seller" />

            <div className="min-h-screen bg-[#F7F8F5] text-[#263B2A]">
                {/* Header */}
                <header className="border-b border-[#E5E9E1] bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="rounded-xl bg-[#315C3B] p-2.5 text-white">
                                <Printer size={22} />
                            </div>

                            <div>
                                <h1 className="text-lg font-black">
                                    Studio Seller
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Print request management
                                </p>
                            </div>
                        </Link>

                        <span className="rounded-full bg-[#EAF2E7] px-4 py-2 text-sm font-semibold text-[#315C3B]">
                            Seller Dashboard
                        </span>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-10">
                    {/* Page heading */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#72916E]">
                            Order Management
                        </p>

                        <h2 className="mt-2 text-3xl font-black tracking-tight">
                            Studio Orders
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Review print requests and manage each order
                            from approval to completion.
                        </p>
                    </div>

                    {/* Statistics and clickable filters */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            const isActive =
                                activeFilter === stat.status;

                            return (
                                <button
                                    key={stat.label}
                                    type="button"
                                    onClick={() =>
                                        setActiveFilter(stat.status)
                                    }
                                    aria-pressed={isActive}
                                    className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y- 0.5 hover:shadow-md ${isActive
                                            ? 'border-[#315C3B] ring-2 ring-[#315C3B]/20'
                                            : 'border-[#E6EAE2]'
                                        } `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {stat.label}
                                        </span>

                                        <div
                                            className={`rounded - xl p - 2.5 ${stat.color} `}
                                        >
                                            <Icon size={20} />
                                        </div>
                                    </div>

                                    <p className="mt-2 text-3xl font-black">
                                        {stat.value}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Orders table */}
                    <section className="overflow-hidden rounded-2xl border border-[#E6EAE2] bg-white shadow-sm">
                        <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-bold">
                                    {activeLabel}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Showing {filteredOrders.length} orders
                                    on this page · {orders.total} orders in
                                    total
                                </p>
                            </div>

                            {activeFilter !== 'all' && (
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter('all')}
                                    className="text-sm font-semibold text-[#315C3B] hover:underline"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="px-6 py-20 text-center">
                                <Package
                                    size={40}
                                    className="mx-auto text-gray-300"
                                />

                                <h4 className="mt-4 font-bold">
                                    {allOrders.length === 0
                                        ? 'No orders yet'
                                        : 'No matching orders'}
                                </h4>

                                <p className="mt-2 text-sm text-gray-500">
                                    {allOrders.length === 0
                                        ? 'New studio print requests will appear here.'
                                        : 'There are no orders with this status on the current page.'}
                                </p>

                                {activeFilter !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveFilter('all')
                                        }
                                        className="mt-4 rounded-lg bg-[#315C3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#26492E]"
                                    >
                                        View all orders
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#FAFBF9] text-xs uppercase tracking-wider text-gray-500">
                                            <tr>
                                                <th className="px-6 py-4">
                                                    Order
                                                </th>
                                                <th className="px-6 py-4">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4">
                                                    Prints
                                                </th>
                                                <th className="px-6 py-4">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {filteredOrders.map((order) => {
                                                const printCount =
                                                    order.studio_collections?.reduce(
                                                        (total, collection) =>
                                                            total +
                                                            (collection.photos?.length ??
                                                                0),
                                                        0,
                                                    ) ?? 0;

                                                return (
                                                    <tr
                                                        key={order.id}
                                                        className="transition hover:bg-[#FAFBF9]"
                                                    >
                                                        <td className="whitespace-nowrap px-6 py-5 font-bold">
                                                            #{order.id}
                                                        </td>

                                                        <td className="px-6 py-5">
                                                            <p className="font-semibold">
                                                                {order.customer
                                                                    ?.name ??
                                                                    'Customer'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {order.customer
                                                                    ?.email ??
                                                                    '—'}
                                                            </p>
                                                        </td>

                                                        <td className="whitespace-nowrap px-6 py-5">
                                                            {printCount} photos
                                                        </td>

                                                        <td className="whitespace-nowrap px-6 py-5 text-gray-500">
                                                            {formatDate(
                                                                order.created_at,
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-6 py-5">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[
                                                                    order
                                                                        .status
                                                                    ] ??
                                                                    'bg-gray-100 text-gray-700'
                                                                    } `}
                                                            >
                                                                {formatStatus(
                                                                    order.status,
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-6 py-5">
                                                            <Link
                                                                href={`/seller/studio-orders/${order.id}`}
                                                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#DCE5D8] px-3 py-2 font-semibold text-[#315C3B] transition hover:bg-[#EAF2E7]"
                                                            >
                                                                <Eye size={16} />
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
                                    <p className="text-sm text-gray-500">
                                        Page {orders.current_page} of{' '}
                                        {orders.last_page}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={`${index}-${link.label} `}
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                aria-disabled={!link.url}
                                                className={`rounded-lg border px-3 py-2 text-sm ${link.active
                                                        ? 'border-[#315C3B] bg-[#315C3B] text-white'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                    } ${!link.url
                                                        ? 'pointer-events-none opacity-40'
                                                        : ''
                                                    } `}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
