import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login to tmhta's!" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A] flex flex-col justify-between">

                {/* Main Content */}
                <main className="mx-auto max-w-md w-full px-6 py-8 flex-1 flex flex-col items-center justify-center">

                    <div className="w-full rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A]">

                        <div className='flex gap-4 align-items-center mb-6'>

                            <Link href="/" className="rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-2 shadow-[4px_4px_0_#31513A] transition hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                <ArrowLeft />
                            </Link>

                            <h1 className="text-4xl font-black tracking-tight">
                                Log <span className="text-[#F26B82]">in</span>
                            </h1>
                        </div>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[#F26B82] text-xs font-bold mt-1 ml-4">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm mb-2">Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 w-5 h-5 text-[#55725D]" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#FFF8EA] py-3 pl-12 pr-4 font-semibold text-[#31513A] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-[#F26B82] text-xs font-bold mt-1 ml-4">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm font-bold pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-2 border-[#31513A] text-[#F26B82] focus:ring-0"
                                    />
                                    <span>Remember me</span>
                                </label>

                                <Link href="/forgot-password" className="text-[#55725D] hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#CDE8B5] py-4 shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-lg disabled:opacity-50 mt-4"
                            >
                                Log in
                            </button>
                        </form>
                        
                        <div className="text-center pt-3 text-sm font-bold">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[#F26B82] hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}