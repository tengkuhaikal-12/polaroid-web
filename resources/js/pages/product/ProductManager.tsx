import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import Modal from '@/component/Modal';

interface Product {
    id: number;
    name: string;
    price: string | number;
    prints: number | string;
    image: string;
    color: string;
}

interface IndexProps {
    products: Product[];
    [key: string]: unknown;
}

export default function ProductManager({ products }: IndexProps) {

    const { props } = usePage();
    const flash = (props as any).flash;

    // Modal state for deletion confirmation
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Modal state for flash success messages
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    // Trigger success modal automatically if flash message exists
    useEffect(() => {
        if (flash?.success) {
            setSuccessModalOpen(true);
        }
    }, [flash]);

    const confirmDelete = (id: number) => {
        setSelectedProductId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedProductId) {
            router.delete(`/products/${selectedProductId}`);
        }
    };

    return (
        <>
            <Head title="Manage Products" />


            <div className="min-h-screen bg-[#FFF8EA] px-6 py-10 text-[#31513A]">
                {/* Top Nav Header */}
                <div className="mx-auto flex max-w-6xl items-center gap-2">
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

                {/* Main Heading & Add Button */}
                <div className="mt-5 mx-auto max-w-6xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-[#F26B82]">♡ Inventory Manager ♡</p>
                            <h1 className="mt-2 text-4xl tracking-tight md:text-6xl">
                                Manage products
                            </h1>
                        </div>

                        <Link
                            href="/products/create"
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-4 py-2 text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                            <Plus className="h-5 w-5" /> Add New Pack 🍓
                        </Link>
                    </div>

                    {/* Products Grid */}
                    <div className="mt-5 grid gap-8 md:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className={`rounded-[2rem] border-4 border-[#31513A] ${product.color || 'bg-white'} p-5 shadow-[7px_7px_0_#31513A]`}
                            >
                                <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#31513A] bg-black p-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl">{product.name}</h3>
                                        <span className="text-xl">RM {product.price}</span>
                                    </div>

                                    <p className="mt-2 font-semibold text-[#55725D]">{product.prints}</p>

                                    {/* Action Buttons */}
                                    <div className="mt-5 flex gap-3 justify-end">
                                        <Link
                                            href={`/products/${product.id}/edit`}
                                            className="flex items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Link>

                                        <button
                                            onClick={() => confirmDelete(product.id)}
                                            className="flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-3 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>


                                        {/* Success Popup Modal */}
                                        <Modal
                                            isOpen={successModalOpen}
                                            onClose={() => setSuccessModalOpen(false)}
                                            title="Awesome! ✨"
                                            message={flash?.success || ''}
                                            type="success"
                                        />

                                        {/* Deletion Confirmation Modal */}
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}