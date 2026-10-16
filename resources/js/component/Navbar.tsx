import React from 'react';
import { Link } from '@inertiajs/react';
import { LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
}

export default function Navbar({ auth }: NavbarProps) {
    const user = auth?.user;

    return (
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2">
                <Link href="/" className="rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A] transition hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    tmhta's!
                </Link>
            </div>

            <div className="hidden gap-3 rounded-full border-2 border-[#31513A] bg-white/70 px-3 py-2 font-bold md:flex items-center">
                <a href="#shop" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                    Shop
                </a>
                <a href="#how" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                    How It Works
                </a>
                <a href="#contact" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                    Contact
                </a>

                <Link
                    href="/products"
                    className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition"
                >
                    Manage
                </Link>

                <Link
                    href="/selfie"
                    className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition"
                >
                    Selfie
                </Link>

                <Link href="/cart" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                    Cart
                </Link>
            </div>

            {/* Mobile / Fallback Login button if user is logged out */}
            {!user ? (
                    <Link href="/login" className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-4 py-2 font-black shadow-[3px_3px_0_#31513A] flex items-center gap-2 text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
                        <LogIn className="w-4 h-4" /> Login
                    </Link>
            ) : (
                    <Link href="/logout" method="post" as="button" className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-4 py-2 font-black shadow-[3px_3px_0_#31513A] flex items-center gap-2 text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
                        Log out<LogOut className='w-4 h-4'/>
                    </Link>
            )}
        </nav>
    );
}