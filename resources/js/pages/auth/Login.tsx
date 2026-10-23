import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Lock,
    Mail,
    ArrowLeft,
    Eye,
    EyeOff,
    ArrowRight,
    Check,
    Copy,
} from 'lucide-react';

export default function Login() {

    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const copyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(email);

            setTimeout(() => {
                setCopiedEmail(null);
            }, 2000);
        } catch {
            console.error('Failed to copy email.');
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: 'password',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login to tmhta's!" />

            <div className="flex min-h-screen flex-col bg-[#FFF8EA] text-[#31513A]">
                {/* Header */}
                <header className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-5 py-5 sm:px-8 sm:py-6">
                    <span className="rotate-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_#31513A] sm:px-4 sm:text-xs">
                        Welcome back!
                    </span>
                </header>

                {/* Main */}
                <main className="flex flex-1 items-center justify-center px-5 py-6 sm:px-6 sm:py-10">
                    <div className="w-full max-w-md">
                        {/* Decorative heading */}
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <span className="h-3 w-3 rotate-12 rounded-sm bg-[#F26B82]" />

                            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.3em]">
                                Your corner of the internet
                            </p>

                            <span className="h-3 w-3 -rotate-12 rounded-sm bg-[#CDE8B5]" />
                        </div>

                        
                        <aside className="rounded-[2rem] border-2 border-[#31513A] p-4 sm:p-5 mb-2">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#31513A] bg-[#CDE8B5]">
                                    <Mail size={20} className="text-[#31513A]" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-[#31513A]">
                                        Test Accounts
                                    </h3>
                                    <p className="text-xs font-medium text-[#718575]">
                                        Click to copy an email address
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    'haikaltengku1741@gmail.com',
                                    'arif@gmail.com',
                                ].map((email) => (
                                    <div
                                        key={email}
                                        className="flex min-w-0 items-center justify-between gap-3 rounded-xl border-2 border-[#31513A] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#CDE8B5]"
                                    >
                                        <p className="min-w-0 break-all text-xs font-bold text-[#31513A] sm:text-sm">
                                            {email}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => copyEmail(email)}
                                            title={`Copy ${email}`}
                                            aria-label={`Copy ${email}`}
                                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-[#31513A] px-3 py-2 text-xs font-black transition active:translate-y-0.5 ${copiedEmail === email
                                                    ? 'bg-[#CDE8B5] shadow-none'
                                                    : 'bg-[#FF9EAD] shadow-[2px_2px_0_#31513A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                                                }`}
                                        >
                                            {copiedEmail === email ? (
                                                <>
                                                    <Check size={14} />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-4 rounded-lg border border-dashed border-[#9FCB98] bg-[#F0F6E8] px-3 py-2 text-center text-[11px] font-semibold text-[#55725D]">
                                ✦ For development and testing purposes only
                            </p>
                        </aside>
                    
                        {/* Login card */}
                        <section className="rounded-[2rem] border-2 border-[#31513A] bg-white p-6 sm:p-9">
                            {/* Title */}
                            <div className="mb-8">
                                <div className="mb-5 flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 -rotate-6 items-center justify-center rounded-2xl border-2 border-[#31513A] bg-[#FF9EAD] shadow-[4px_4px_0_#31513A]">
                                        <Lock className="h-7 w-7" />
                                    </div>

                                    <div className="min-w-0">
                                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                                            Log{' '}
                                            <span className="text-[#F26B82]">
                                                in.
                                            </span>
                                        </h1>

                                        <p className="mt-1 text-sm font-medium text-[#55725D]">
                                            Pick up where you left off.
                                        </p>
                                    </div>
                                </div>

                                <div className="h-1.5 w-20 rounded-full bg-[#F26B82]" />
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#55725D]" />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            autoFocus
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="you@example.com"
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                            className={`w-full rounded-2xl border-2 ${errors.email ? 'border-[#F26B82]' : 'border-[#31513A]'
                                                } bg-[#FFF8EA] py-3.5 pl-12 pr-20 font-semibold text-[#31513A] placeholder:text-[#9BAA98] focus:outline-none focus:ring-2 focus:ring-[#F26B82]`}
                                        />

                                        <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    const text = await navigator.clipboard.readText();
                                                    setData('email', text.trim());
                                                } catch {
                                                    console.error('Unable to read clipboard.');
                                                }
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border-2 border-[#31513A] bg-[#CDE8B5] px-2.5 py-1.5 text-xs font-black text-[#31513A] transition hover:bg-[#FF9EAD] active:scale-95"
                                        >
                                            Paste
                                        </button>
                                    </div>

                                    {errors.email && (
                                        <p
                                            id="email-error"
                                            role="alert"
                                            className="ml-2 mt-2 text-sm font-bold text-[#D94C66]"
                                        >
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>


                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#55725D]" />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            autoComplete="current-password"
                                            required
                                            value={data.password}
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                            placeholder="Enter your password"
                                            aria-invalid={Boolean(errors.password)}
                                            aria-describedby={
                                                errors.password
                                                    ? 'password-error'
                                                    : undefined
                                            }
                                            className={`w-full rounded-2xl border-2 ${errors.password
                                                ? 'border-[#F26B82]'
                                                : 'border-[#31513A]'
                                                } bg-[#FFF8EA] py-3.5 pl-12 pr-12 font-semibold text-[#31513A] placeholder:text-[#9BAA98] focus:outline-none focus:ring-2 focus:ring-[#F26B82]`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((visible) => !visible)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                            aria-pressed={showPassword}
                                            className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-[#CDE8B5] focus:outline-none focus:ring-2 focus:ring-[#F26B82]"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-3">
                                        {/* Remember me */}
                                        <label className="flex cursor-pointer items-center gap-3 py-1 text-sm font-bold">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData('remember', e.target.checked)
                                                }
                                                className="h-5 w-5 cursor-pointer rounded border-2 border-[#31513A] accent-[#F26B82] rounded-full"
                                            />

                                            Remember me
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            className="shrink-0 text-xs font-bold text-[#55725D] underline decoration-2 underline-offset-4 transition hover:text-[#F26B82]"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {errors.password && (
                                        <p
                                            id="password-error"
                                            role="alert"
                                            className="ml-2 mt-2 text-sm font-bold text-[#D94C66]"
                                        >
                                            {errors.password}
                                        </p>
                                    )}
                                </div>


                                {/* Login button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group mt-2 flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-4 text-lg font-bold shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#F26B82] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Logging in...'
                                        : 'Let me in!'}

                                    {!processing && (
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    )}
                                </button>
                            </form>

                            {/* Register */}
                            <div className="mt-7 border-t-2 border-dashed border-[#D5E2D0] pt-6 text-center flex gap-2 justify-center items-center">
                                <p className="text-sm font-semibold text-[#55725D]">
                                    New around here?
                                </p>

                                <Link
                                    href="/register"
                                    className="m inline-flex items-center gap-2 font-semibold text-[#F26B82] underline decoration-2 underline-offset-4 transition hover:text-[#CDE8B5]"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </section>

                        <p className="mt-6 text-center text-xs font-bold text-[#55725D]">
                            Made with a little bit of love and a lot of ☁️
                        </p>
                    </div>
                </main>

                {/* Footer */}
                <footer className="px-5 py-5 text-center text-xs font-semibold text-[#55725D]">
                    © {new Date().getFullYear()} tmhta's. All rights reserved.
                </footer>
            </div>
        </>
    );
}