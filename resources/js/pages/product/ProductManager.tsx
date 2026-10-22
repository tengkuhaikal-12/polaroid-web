
import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Trash2, Edit3, ArrowLeft, ImageOff } from 'lucide-react';
import Modal from '@/component/Modal';

interface Product {
    id: number;
    name: string;
    price: string | number;
    prints: number | string;
    image: string | null;
    color: string | null;
}

interface IndexProps {
    products: Product[];
    [key: string]: unknown;
}

function ProductImage({ product }: { product: Product }) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [product.image]);

    return (
        <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#31513A] bg-black p-3">
            {product.image && !hasError ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="flex flex-col items-center gap-2 text-white">
                    <ImageOff className="h-8 w-8" />
                    <p className="text-sm">
                        {product.image ? 'Image unavailable' : 'No image'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ProductManager({ products }: IndexProps) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] =
        useState<number | null>(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setSuccessModalOpen(true);
        }
    }, [flash?.success]);

    const confirmDelete = (id: number) => {
        setSelectedProductId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedProductId === null) return;

        router.delete(`/admin/products/${selectedProductId}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedProductId(null);
            },
        });
    };

    return (
        <>
            <Head title="Manage Products" />

            <div className="min-h-screen bg-[#FFF8EA] px-6 py-10 text-[#31513A]">
                <div className="mx-auto flex max-w-6xl items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] p-2 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div className="rotate-[-3deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 shadow-[3px_3px_0_#31513A]">
                        tmhta's dashboard! ✨
                    </div>
                </div>

                <div className="mx-auto mt-5 max-w-6xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-[#F26B82]">
                                ♡ Inventory Manager ♡
                            </p>
                            <h1 className="mt-2 text-4xl tracking-tight md:text-6xl">
                                Manage products
                            </h1>
                        </div>

                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-4 py-2 font-bold text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Pack 🍓
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className={`rounded-[2rem] border-4 border-[#31513A] ${product.color || 'bg-white'} p-5 shadow-[7px_7px_0_#31513A]`}
                            >
                                <ProductImage product={product} />

                                <div className="mt-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-2xl font-black">
                                            {product.name}
                                        </h3>

                                        <span className="shrink-0 text-xl font-bold">
                                            RM {Number(product.price).toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="mt-2 font-semibold text-[#55725D]">
                                        {product.prints} prints
                                    </p>

                                    <div className="mt-5 flex justify-end gap-3">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            aria-label={`Edit ${product.name}`}
                                            className="flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FFF0A8] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => confirmDelete(product.id)}
                                            aria-label={`Delete ${product.name}`}
                                            className="flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <p className="col-span-full rounded-2xl border-2 border-dashed border-[#31513A] p-8 text-center font-semibold">
                                No products yet. Add your first pack! 🍓
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Awesome! ✨"
                message={flash?.success || ''}
                type="success"
            />

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Pack? 🥺"
                message="Are you sure you want to delete this memory pack from your database? This action cannot be undone!"
                type="confirm"
                confirmText="Yes, Delete!"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
}
