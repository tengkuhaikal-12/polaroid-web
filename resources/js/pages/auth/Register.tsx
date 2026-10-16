import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Register() {

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Sign Up for tmhta's!" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A] flex flex-col justify-between">
                <main className="mx-auto max-w-md w-full px-6 py-8 flex-1 flex flex-col items-center justify-center">
                    <div className="w-full rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A]">

                        <div className="flex gap-4 items-center mb-6">
                            <Link href="/login" className="rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-2 shadow-[4px_4px_0_#31513A] transition hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>

                            <h1 className="text-4xl tracking-tight">
                                Sign <span className="text-[#F26B82]">up</span>
                            </h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">

                            {/* Name Field */}
                            <div>
                                <label className="block text-sm  mb-1">Name</label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                </div>
                                {errors.name && <p className="text-[#F26B82] text-xs font-bold mt-1 ml-4">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                </div>
                                {errors.email && <p className="text-[#F26B82] text-xs font-bold mt-1 ml-4">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm mb-1">Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-[#55725D] hover:text-[#31513A] transition"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[#F26B82] text-xs font-bold mt-1 ml-4">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm mb-1">Confirm Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-[#55725D] hover:text-[#31513A] transition"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#CDE8B5] py-3 shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-lg disabled:opacity-50 mt-2"
                            >
                                Sign Up
                            </button>

                            <div className="text-center pt-3 text-sm font-bold">
                                Already have an account?{' '}
                                <Link href="/login" className="text-[#F26B82] hover:underline">
                                    Log in
                                </Link>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}