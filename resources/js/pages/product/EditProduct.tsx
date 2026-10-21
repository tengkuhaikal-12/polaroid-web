
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: string | number;
    prints: number | string;
    image: string | null;
    color: string | null;
}

interface EditProps {
    product: Product;
}

export default function EditProduct({ product }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        price: string;
        prints: string;
        image: File | null;
        color: string;
        _method: 'PUT';
    }>({
        name: product.name ?? '',
        price: String(product.price ?? ''),
        prints: String(product.prints ?? ''),
        image: null,
        color: product.color ?? 'bg-[#FFF0A8]',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Edit ${product.name}`} />

            <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 py-10 text-[#31513A]">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A] md:p-12">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center justify-center rounded-full border-2 border-[#31513A] bg-[#CDE8B5] p-2 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>

                            <h1 className="text-3xl font-black md:text-4xl">
                                Edit Product 🍓
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block font-black">
                                    Pack Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-2 w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="price" className="block font-black">
                                        Price
                                    </label>
                                    <div className="mt-2 flex">
                                        <span className="flex items-center rounded-l-full border-2 border-r-0 border-[#31513A] bg-[#FFF8EA] px-4 font-semibold">
                                            RM
                                        </span>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            required
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full min-w-0 rounded-r-full border-2 border-[#31513A] bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="prints" className="block font-black">
                                        Prints count
                                    </label>
                                    <div className="mt-2 flex">
                                        <input
                                            id="prints"
                                            type="number"
                                            min="1"
                                            step="1"
                                            required
                                            value={data.prints}
                                            onChange={(e) => setData('prints', e.target.value)}
                                            className="w-full min-w-0 rounded-l-full border-2 border-r-0 border-[#31513A] bg-[#FFF8EA] px-4 py-3 text-right font-semibold focus:outline-none"
                                        />
                                        <span className="flex items-center rounded-r-full border-2 border-[#31513A] bg-[#FFF8EA] px-4 font-semibold">
                                            pcs
                                        </span>
                                    </div>
                                    {errors.prints && (
                                        <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                            {errors.prints}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="image" className="block font-black">
                                    Product Image
                                </label>

                                {product.image && (
                                    <div className="mt-3">
                                        <p className="mb-2 text-sm font-semibold">
                                            Current image
                                        </p>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-40 w-40 rounded-2xl border-2 border-[#31513A] object-contain"
                                        />
                                    </div>
                                )}

                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData('image', e.target.files?.[0] ?? null)
                                    }
                                    className="mt-3 w-full rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] font-semibold focus:outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#CDE8B5] file:px-4 file:py-3 file:font-black file:text-[#31513A] hover:file:bg-[#FF9EAD]"
                                />
                                <p className="mt-1 text-sm text-[#55725D]">
                                    Leave empty to keep the current image.
                                </p>
                                {errors.image && (
                                    <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] px-7 py-4 font-black text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Update Product'}
                                <Sparkles className="ml-2 inline-block h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
