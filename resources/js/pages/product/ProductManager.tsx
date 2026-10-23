
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

function ProductImage({
    product,
    compact = false,
}: {
    product: Product;
    compact?: boolean;
}) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [product.image]);

    return (
        <div
            className={`flex items-center justify-center overflow-hidden ${
    compact
        ? 'h-16 w-16 shrink-0 rounded-xl bg-white p-1'
        : 'h-52 w-full rounded-[1.5rem] bg-black p-3'
} `}
        >
            {product.image && !hasError ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div
                    className={`flex flex-col items-center justify-center gap-1 ${
    compact ? 'text-[#55725D]' : 'text-white'
} `}
                >
                    <ImageOff
                        className={compact ? 'h-5 w-5' : 'h-8 w-8'}
                    />
                    {!compact && (
                        <p className="text-sm">
                            {product.image
                                ? 'Image unavailable'
                                : 'No image'}
                        </p>
                    )}
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


                    <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#31513A] bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-[#31513A] bg-[#CDE8B5]">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-black tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-sm font-black ">
                                            Product Image
                                        </th>
                                        <th className="px-6 py-4 text-sm font-black tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-4 text-sm font-black  tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-sm font-black  tracking-wider">
                                            Prints
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-black  tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition odd:bg-gray-200 hover:bg-[#FFF8EA]"
                                        >
                                            <td className='whitespace-nowrap px-6 py-5'>
                                                <p className="text-[#55725D]">
                                                    #{product.id}
                                                </p>
                                            </td>
                                            {/* Product */}
                                            <td className="whitespace-nowrap px-6 py-5">

                                                <ProductImage product={product} compact/>

                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <p className="text-[#31513A]">
                                                    {product.name}
                                                </p>

                                            </td>

                                            {/* Price */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span className="text-[#31513A]">
                                                    RM {Number(product.price).toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Prints */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span className="inline-flex rounded-full border-1 border-[#31513A] bg-[#FFF0A8] px-3 py-1.5 text-sm font-bold text-[#31513A]">
                                                    {product.prints} prints
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        aria-label={`Edit ${product.name}`}
                                                        title="Edit product"
                                                        className="flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FFF0A8] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => confirmDelete(product.id)}
                                                        aria-label={`Delete ${product.name}`}
                                                        title="Delete product"
                                                        className="flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Empty state */}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <p className="text-lg font-black text-[#31513A]">
                                                    No products yet 🍓
                                                </p>
                                                <p className="mt-2 text-sm text-[#55725D]">
                                                    Add your first pack to get started!
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
