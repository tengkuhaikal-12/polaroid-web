import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Sparkles, ChevronDown, Check } from 'lucide-react';


export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        price: string;
        prints: string;
        image: File | null;
        color: string;
    }>({
        name: '',
        price: '',
        prints: '',
        image: null,
        color: 'bg-[#FFF0A8]',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/products', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Add New Pack" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A] flex items-center justify-center">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A] md:p-12">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/products"
                                className=" inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] p-2 shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>

                            <h1 className="text-4xl font-black">
                                Add new product pack 🍓
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label className="block font-black">
                                    Pack Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
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
                                    <label className="block font-black">
                                        Price
                                    </label>
                                    <div className="flex items-center">
                                        <div className='mt-2 rounded-l-full border-2 border-[#31513A] border-r-0 bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none'>RM</div>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData('price', e.target.value)
                                            }
                                            className="mt-2 w-full rounded-r-full border-2 border-[#31513A] bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-black">
                                        Prints count
                                    </label>
                                    <div className="flex items-center">

                                        <input
                                            type="number"
                                            value={data.prints}
                                            onChange={(e) =>
                                                setData('prints', e.target.value)
                                            }
                                            className="mt-2 w-full rounded-l-full border-2 border-[#31513A] border-r-0 bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none text-right"
                                        />
                                        {errors.prints && (
                                            <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                                {errors.prints}
                                            </p>
                                        )}

                                        <div className='mt-2 rounded-r-full border-2 border-[#31513A] bg-[#FFF8EA] px-4 py-3 font-semibold focus:outline-none text-right'>pcs</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-black">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData('image', e.target.files ? e.target.files[0] : null)
                                    }
                                    className="mt-2 w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] font-semibold focus:outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#CDE8B5] file:px-4 file:py-3 file:font-black file:text-[#31513A] hover:file:bg-[#FF9EAD]"
                                />
                                {errors.image && (
                                    <p className="mt-1 text-sm font-bold text-[#F26B82]">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] px-7 py-4 text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Save Product
                                <Sparkles className="ml-2 inline-block h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
