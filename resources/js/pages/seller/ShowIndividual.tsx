import React from 'react';

import { Head, Link, useForm } from '@inertiajs/react';

import type { FormEvent } from 'react';

import {

    ArrowLeft,

    CheckCircle2,

    Clock,

    Package,

    Printer,

    XCircle,

    Image as ImageIcon,

    UserRound,

    CalendarDays,

    LoaderCircle,

    AlertCircle,
    Download,

} from 'lucide-react';

interface Customer {

    id: number;

    name: string;

    email: string;

}


interface Photo {
    id: number;
    position?: number | null;
    image_path?: string | null;
    image_url?: string | null;
    url?: string | null;
    path?: string | null;
    file_path?: string | null;
    photo_path?: string | null;
    name?: string | null;
}


interface StudioCollection {

    id: number;

    status: string;

    photos: Photo[];

    seller_note?: string | null;

    approved_at?: string | null;

}

interface Payment {

    id: number;

    status: string;

    amount?: number | string | null;

}

interface Order {

    id: number;

    status: string;

    total_amount?: number | string | null;

    created_at: string;

    approved_at?: string | null;

    completed_at?: string | null;

    seller_note?: string | null;

    customer: Customer;

    studio_collections: StudioCollection[];

    payments?: Payment[];

}

interface Props {

    order: Order;

}

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

    status.replace(/\_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value?: string | null) => {

    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('en-MY', {

        day: 'numeric',

        month: 'short',

        year: 'numeric',

        hour: '2-digit',

        minute: '2-digit',

    });

};

const formatCurrency = (amount?: number | string | null) => {

    if (amount === undefined || amount === null || amount === '') {

        return 'Not available';

    }

    return new Intl.NumberFormat('en-MY', {

        style: 'currency',

        currency: 'MYR',

    }).format(Number(amount));

};

const getPhotoUrl = (photo: Photo): string | null => {

    const value =

        photo.image_url ??

        photo.url ??

        photo.photo_path ??

        photo.file_path ??

        photo.path;

    if (!value) return null;

    if (/^(https?:\/\/|data:image\/)/i.test(value)) {

        return value;

    }

    if (value.startsWith('/')) {

        return value;

    }

    return `/storage/${value}`;

};

export default function ShowIndividual({ order }: Props) {

    const approveForm = useForm({

        seller_note: order.seller_note ?? '',

    });

    const rejectForm = useForm({

        seller_note: '',

    });

    const productionForm = useForm<{

        status: 'preparing' | 'ready' | 'completed';

    }>({

        status: 'preparing',

    });

    const collections = order.studio_collections ?? [];

    const photos = collections.flatMap((collection) =>

        (collection.photos ?? []).map((photo) => ({

            ...photo,

            collectionId: collection.id,

        }))

    );

    const paid = order.payments?.some(

        (payment) => payment.status === 'paid'

    );

    const canApprove = order.status === 'pending_review';

    const canProduce = ['paid', 'preparing', 'ready'].includes(order.status);

    const nextProductionStatus: Record<

        string,

        'preparing' | 'ready' | 'completed' | undefined

    > = {

        paid: 'preparing',

        preparing: 'ready',

        ready: 'completed',

    };

    const nextStatus = nextProductionStatus[order.status];

    const submitApproval = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        approveForm.post(`/seller/studio-orders/${order.id}/approve`, {

            preserveScroll: true,

        });

    };

    const submitRejection = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        rejectForm.post(`/seller/studio-orders/${order.id}/reject`, {

            preserveScroll: true,

        });

    };

    const submitProductionStatus = () => {

        if (!nextStatus) return;

        productionForm.setData('status', nextStatus);

        productionForm.patch(

            `/seller/studio-orders/${order.id}/production-status`,

            {

                preserveScroll: true,

            }

        );

    };

    const productionSteps = [

        { label: 'Request submitted', completed: true },

        {

            label: 'Seller approved',

            completed: ['awaiting_payment', 'paid', 'preparing', 'ready', 'completed'].includes(

                order.status

            ),

        },

        {

            label: 'Payment received',

            completed: paid === true ||

                ['paid', 'preparing', 'ready', 'completed'].includes(order.status),

        },

        {

            label: 'Preparing prints',

            completed: ['preparing', 'ready', 'completed'].includes(order.status),

        },

        {

            label: 'Ready for collection',

            completed: ['ready', 'completed'].includes(order.status),

        },

        {

            label: 'Completed',

            completed: order.status === 'completed',

        },

    ];

    return (

        <>

            <Head title={`Order #${order.id} | Seller Studio`} />

            <div className="min-h-screen bg-[#F7F8F5] text-[#263B2A]">

                <header className="border-b border-[#E5E9E1] bg-white">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

                        <Link

                            href="/seller/studio-orders"

                            className="flex items-center gap-3"

                        >

                            <div className="rounded-xl bg-[#315C3B] p-2.5 text-white">

                                <Printer size={22} />

                            </div>

                            <div>

                                <h1 className="font-black">Studio Seller</h1>

                                <p className="text-xs text-gray-500">

                                    Print request management

                                </p>

                            </div>

                        </Link>

                        <Link

                            href="/seller/studio-orders"

                            className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50 sm:flex"

                        >

                            <ArrowLeft size={16} />

                            All Orders

                        </Link>

                    </div>

                </header>

                <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">

                    <Link

                        href="/seller/studio-orders"

                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#315C3B] sm:hidden"

                    >

                        <ArrowLeft size={16} />

                        Back to orders

                    </Link>

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-widest text-[#72916E]">

                                Order Management

                            </p>

                            <h2 className="mt-2 text-3xl font-black tracking-tight">

                                Order #{order.id}

                            </h2>

                            <p className="mt-2 text-sm text-gray-500">

                                Review the customer's print request and manage

                                its progress.

                            </p>

                            <a
                                href={`/seller/studio-orders/${order.id}/print-pdf`}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#315C3B] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#26482E]"
                            >
                                <Download size={18} />
                                Download Print-Ready PDF
                            </a>

                        </div>

                        <span

                            className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-bold ${statusStyles[order.status] ??

                                'bg-gray-100 text-gray-700'

                                }`}

                        >

                            {formatStatus(order.status)}

                        </span>

                    </div>

                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                        <div className="space-y-6 lg:col-span-2">

                            {/* Customer details */}

                            <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center gap-3">

                                    <div className="rounded-xl bg-[#EAF2E7] p-3 text-[#315C3B]">

                                        <UserRound size={20} />

                                    </div>

                                    <div>

                                        <h3 className="font-bold">

                                            Customer Information

                                        </h3>

                                        <p className="text-sm text-gray-500">

                                            Customer account details

                                        </p>

                                    </div>

                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                                            Customer name

                                        </p>

                                        <p className="mt-1 font-semibold">

                                            {order.customer?.name ?? 'Unknown customer'}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                                            Email address

                                        </p>

                                        <p className="mt-1 break-all font-medium">

                                            {order.customer?.email ?? '—'}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                                            Order date

                                        </p>

                                        <p className="mt-1 flex items-center gap-2 font-medium">

                                            <CalendarDays

                                                size={16}

                                                className="text-gray-400"

                                            />

                                            {formatDate(order.created_at)}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                                            Total amount

                                        </p>

                                        <p className="mt-1 text-lg font-black">

                                            {formatCurrency(order.total_amount)}

                                        </p>

                                    </div>

                                </div>

                            </section>

                            {/* Photo collection */}

                            <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center justify-between gap-3">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-xl bg-[#EAF2E7] p-3 text-[#315C3B]">

                                            <ImageIcon size={20} />

                                        </div>

                                        <div>

                                            <h3 className="font-bold">

                                                Print Collection

                                            </h3>

                                            <p className="text-sm text-gray-500">

                                                Submitted photos

                                            </p>

                                        </div>

                                    </div>

                                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold">

                                        {photos.length} photos

                                    </span>

                                </div>

                                {collections.length === 0 ? (

                                    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">

                                        <Package

                                            size={32}

                                            className="mx-auto text-gray-300"

                                        />

                                        <p className="mt-3 text-sm text-gray-500">

                                            No print collections found.

                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-6">

                                        {collections.map((collection, index) => (

                                            <div

                                                key={collection.id}

                                                className="rounded-xl border border-gray-100 p-4"

                                            >

                                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                                    <div>

                                                        <h4 className="font-bold">

                                                            Collection {index + 1}

                                                        </h4>

                                                        <p className="mt-1 text-xs text-gray-500">

                                                            ID: {collection.id}

                                                        </p>

                                                    </div>

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">

                                                        {formatStatus(collection.status)}

                                                    </span>

                                                </div>

                                                {collection.photos?.length ? (

                                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                                                        {collection.photos.map((photo) => {

                                                            const src = getPhotoUrl(photo);

                                                            return (

                                                                <div

                                                                    key={photo.id}

                                                                    className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50"

                                                                >

                                                                    <div className="aspect-square">

                                                                        {src ? (

                                                                            <a

                                                                                href={src}

                                                                                target="\_blank"

                                                                                rel="noreferrer"

                                                                                className="block h-full w-full"

                                                                                aria-label={`View photo ${photo.id}`}

                                                                            >


                                                                                <img
                                                                                    src={photo.image_url}
                                                                                    alt={`Customer photo ${photo.position ?? ''}`}
                                                                                    className="h-32 w-24 rounded object-cover"
                                                                                    onError={(event) => {
                                                                                        console.error(
                                                                                            'Failed to load photo:',
                                                                                            photo.image_url
                                                                                        );
                                                                                    }}
                                                                                />


                                                                            </a>

                                                                        ) : (

                                                                            <div className="flex h-full flex-col items-center justify-center text-gray-400">

                                                                                <ImageIcon size={26} />

                                                                                <span className="mt-2 text-xs">

                                                                                    Photo #{photo.id}

                                                                                </span>

                                                                            </div>

                                                                        )}

                                                                    </div>

                                                                    <p className="truncate px-2 py-2 text-xs text-gray-500">

                                                                        {photo.name ?? `Photo #${photo.id}`}

                                                                    </p>

                                                                </div>

                                                            );

                                                        })}

                                                    </div>

                                                ) : (

                                                    <p className="py-6 text-center text-sm text-gray-400">

                                                        No photos in this collection.

                                                    </p>

                                                )}

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </section>

                            {/* Existing seller note */}

                            {order.seller_note && (

                                <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                    <h3 className="font-bold">Previous Seller Note</h3>

                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">

                                        {order.seller_note}

                                    </p>

                                </section>

                            )}

                        </div>

                        {/* Right sidebar */}

                        <aside className="space-y-6">

                            {/* Actions */}

                            <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                <h3 className="text-lg font-black">

                                    Order Actions

                                </h3>

                                <p className="mt-1 text-sm text-gray-500">

                                    Available actions for this order

                                </p>

                                {canApprove && (

                                    <div className="mt-6 space-y-6">

                                        <form onSubmit={submitApproval}>

                                            <label

                                                htmlFor="approval-note"

                                                className="mb-2 block text-sm font-semibold"

                                            >

                                                Approval note

                                                <span className="font-normal text-gray-400">

                                                    {' '}(optional)

                                                </span>

                                            </label>

                                            <textarea

                                                id="approval-note"

                                                value={approveForm.data.seller_note}

                                                onChange={(event) =>

                                                    approveForm.setData(

                                                        'seller_note',

                                                        event.target.value

                                                    )

                                                }

                                                rows={3}

                                                maxLength={2000}

                                                placeholder="Add instructions for the customer..."

                                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#315C3B] focus:ring-2 focus:ring-[#315C3B]/10"

                                            />

                                            {approveForm.errors.seller_note && (

                                                <p className="mt-1 text-xs text-red-600">

                                                    {approveForm.errors.seller_note}

                                                </p>

                                            )}

                                            <button

                                                type="submit"

                                                disabled={approveForm.processing}

                                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#315C3B] px-4 py-3 font-bold text-white transition hover:bg-[#26482E] disabled:cursor-not-allowed disabled:opacity-60"

                                            >

                                                {approveForm.processing ? (

                                                    <LoaderCircle size={18} className="animate-spin" />

                                                ) : (

                                                    <CheckCircle2 size={18} />

                                                )}

                                                Approve Request

                                            </button>

                                        </form>

                                        <div className="border-t border-gray-100 pt-5">

                                            <form onSubmit={submitRejection}>

                                                <label

                                                    htmlFor="rejection-note"

                                                    className="mb-2 block text-sm font-semibold"

                                                >

                                                    Rejection reason

                                                    <span className="text-red-500"> \*</span>

                                                </label>

                                                <textarea

                                                    id="rejection-note"

                                                    value={rejectForm.data.seller_note}

                                                    onChange={(event) =>

                                                        rejectForm.setData(

                                                            'seller_note',

                                                            event.target.value

                                                        )

                                                    }

                                                    rows={3}

                                                    maxLength={2000}

                                                    required

                                                    placeholder="Explain why this request cannot be accepted..."

                                                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"

                                                />

                                                {rejectForm.errors.seller_note && (

                                                    <p className="mt-1 text-xs text-red-600">

                                                        {rejectForm.errors.seller_note}

                                                    </p>

                                                )}

                                                {(rejectForm.errors as Record<string, string>).order && (

                                                    <p className="mt-1 text-xs text-red-600">

                                                        {(rejectForm.errors as Record<string, string>).order}

                                                    </p>

                                                )}

                                                <button

                                                    type="submit"

                                                    disabled={rejectForm.processing}

                                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"

                                                >

                                                    {rejectForm.processing ? (

                                                        <LoaderCircle size={18} className="animate-spin" />

                                                    ) : (

                                                        <XCircle size={18} />

                                                    )}

                                                    Reject Request

                                                </button>

                                            </form>

                                        </div>

                                    </div>

                                )}

                                {order.status === 'awaiting_payment' && (

                                    <div className="mt-6 rounded-xl bg-blue-50 p-4">

                                        <Clock

                                            size={22}

                                            className="text-blue-700"

                                        />

                                        <p className="mt-3 font-bold text-blue-900">

                                            Awaiting customer payment

                                        </p>

                                        <p className="mt-1 text-sm leading-5 text-blue-800">

                                            The request is approved. Production

                                            can begin after payment is confirmed.

                                        </p>

                                    </div>

                                )}

                                {canProduce && (

                                    <div className="mt-6">

                                        <div className="rounded-xl bg-green-50 p-4">

                                            <CheckCircle2

                                                size={22}

                                                className="text-green-700"

                                            />

                                            <p className="mt-3 font-bold text-green-900">

                                                Payment received

                                            </p>

                                            <p className="mt-1 text-sm text-green-800">

                                                {order.status === 'paid'

                                                    ? 'You can begin preparing the prints.'

                                                    : 'Continue updating the production progress.'}

                                            </p>

                                        </div>

                                        <div className="mt-5">

                                            <p className="text-sm font-semibold">

                                                Next production step

                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">

                                                {nextStatus

                                                    ? formatStatus(nextStatus)

                                                    : 'Production completed'}

                                            </p>

                                            {nextStatus && (

                                                <button

                                                    type="button"

                                                    onClick={submitProductionStatus}

                                                    disabled={productionForm.processing}

                                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#315C3B] px-4 py-3 font-bold text-white transition hover:bg-[#26482E] disabled:cursor-not-allowed disabled:opacity-60"

                                                >

                                                    {productionForm.processing ? (

                                                        <LoaderCircle size={18} className="animate-spin" />

                                                    ) : (

                                                        <Printer size={18} />

                                                    )}

                                                    {order.status === 'paid'

                                                        ? 'Start Production'

                                                        : order.status === 'preparing'

                                                            ? 'Mark as Ready'

                                                            : 'Mark as Completed'}

                                                </button>

                                            )}

                                            {productionForm.errors.status && (

                                                <p className="mt-2 text-sm text-red-600">

                                                    {productionForm.errors.status}

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}

                                {order.status === 'completed' && (

                                    <div className="mt-6 rounded-xl bg-emerald-50 p-4">

                                        <CheckCircle2

                                            size={24}

                                            className="text-emerald-700"

                                        />

                                        <p className="mt-3 font-bold text-emerald-900">

                                            Order completed

                                        </p>

                                        <p className="mt-1 text-sm text-emerald-800">

                                            This print order has been completed.

                                        </p>

                                    </div>

                                )}

                                {order.status === 'cancelled' && (

                                    <div className="mt-6 rounded-xl bg-red-50 p-4">

                                        <AlertCircle

                                            size={24}

                                            className="text-red-700"

                                        />

                                        <p className="mt-3 font-bold text-red-900">

                                            Request rejected or cancelled

                                        </p>

                                        <p className="mt-1 text-sm text-red-800">

                                            No further actions are available.

                                        </p>

                                    </div>

                                )}

                            </section>

                            {/* Progress */}

                            <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                <h3 className="font-black">Order Progress</h3>

                                <p className="mt-1 text-sm text-gray-500">

                                    Status history overview

                                </p>

                                <div className="mt-6 space-y-0">

                                    {productionSteps.map((step, index) => (

                                        <div

                                            key={step.label}

                                            className="flex gap-3"

                                        >

                                            <div className="flex flex-col items-center">

                                                <div

                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${step.completed

                                                        ? 'bg-[#315C3B] text-white'

                                                        : 'border border-gray-200 bg-white text-gray-300'

                                                        }`}

                                                >

                                                    {step.completed ? (

                                                        <CheckCircle2 size={16} />

                                                    ) : (

                                                        <span className="text-xs font-bold">

                                                            {index + 1}

                                                        </span>

                                                    )}

                                                </div>

                                                {index < productionSteps.length - 1 && (

                                                    <div

                                                        className={`my-1 min-h-7 w-0.5 ${step.completed

                                                            ? 'bg-[#A7C5A0]'

                                                            : 'bg-gray-100'

                                                            }`}

                                                    />

                                                )}

                                            </div>

                                            <div className="pb-5">

                                                <p

                                                    className={`text-sm font-semibold ${step.completed

                                                        ? 'text-[#315C3B]'

                                                        : 'text-gray-400'

                                                        }`}

                                                >

                                                    {step.label}

                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </section>

                            {/* Dates */}

                            <section className="rounded-2xl border border-[#E6EAE2] bg-white p-6 shadow-sm">

                                <h3 className="font-bold">Important Dates</h3>

                                <div className="mt-5 space-y-4">

                                    <div>

                                        <p className="text-xs text-gray-400">

                                            Submitted

                                        </p>

                                        <p className="mt-1 text-sm font-semibold">

                                            {formatDate(order.created_at)}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-400">

                                            Approved

                                        </p>

                                        <p className="mt-1 text-sm font-semibold">

                                            {formatDate(order.approved_at)}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-400">

                                            Completed

                                        </p>

                                        <p className="mt-1 text-sm font-semibold">

                                            {formatDate(order.completed_at)}

                                        </p>

                                    </div>

                                </div>

                            </section>

                        </aside>

                    </div>

                </main>

            </div>

        </>

    );

}
