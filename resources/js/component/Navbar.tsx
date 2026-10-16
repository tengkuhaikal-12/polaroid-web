import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { LogIn, LogOut, X } from 'lucide-react';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Global Click Sound Effect 🎵
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if the clicked element is a button, link, or inside a clickable wrapper
            if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
                const clickAudio = new Audio('/audio/click.mp3');
                clickAudio.volume = 0.3; // Adjust volume (0.0 to 1.0)
                clickAudio.play().catch((err) => {
                    // Handles browser auto-play restrictions if user hasn't interacted yet
                    console.log("Audio play blocked:", err);
                });
            }
        };

        document.addEventListener('click', handleGlobalClick);

        // Cleanup listener when component unmounts
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    return (
        <>
            <nav className="mx-auto flex gap-7 max-w-6xl items-center justify-between px-6 py-6 relative">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A] transition hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                        polaroidKU!
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden gap-3 rounded-full border-2 border-[#31513A] bg-white/70 px-3 py-2 font-bold md:flex items-center shadow-[3px_3px_0_#31513A]">
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

                {/* Desktop Auth Button */}
                <div className="hidden md:flex items-center">
                    {!user ? (
                        <Link href="/login" className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-4 py-2 font-black shadow-[3px_3px_0_#31513A] flex items-center gap-2 text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
                            <LogIn className="w-4 h-4" /> Login
                        </Link>
                    ) : (
                        <Link href="/logout" method="post" as="button" className="rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[3px_3px_0_#31513A] flex items-center gap-2 text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
                            Log out <LogOut className='w-4 h-4' />
                        </Link>
                    )}
                </div>

                {/* Mobile Animated Hamburger Button */}
                {/* Mobile Hamburger Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="relative w-11 h-11 rounded-xl border-2 border-[#31513A] bg-white text-[#31513A] shadow-[3px_3px_0_#31513A] flex flex-col justify-center items-center gap-1.5 focus:outline-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        aria-label="Toggle Menu"
                    >
                        <span
                            className={`w-5 h-0.5 bg-[#31513A] rounded-full ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                        />
                        <span
                            className={`w-5 h-0.5 bg-[#31513A] rounded-full ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                        />
                        <span
                            className={`w-5 h-0.5 bg-[#31513A] rounded-full ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Backdrop & Right-to-Left Sliding Drawer */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`absolute right-0 top-0 w-3/4 max-w-xs h-full bg-[#FFF8EA] border-l-4 border-[#31513A] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top Header of Sidebar */}
                    <div>
                        <div className="flex items-center justify-between mb-6 pl-4">
                            <span className="font-black text-xl tracking-tight">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white w-11 h-11 p-2 flex items-center justify-center shadow-[2px_2px_0_#31513A] transition active:translate-x-0.5 active:translate-y-0.5"
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="w-10 h-10 text-[#31513A]" />
                            </button>
                        </div>

                        {/* Links List */}
                        <div className="flex flex-col gap-3 font-bold">
                            <a
                                href="#shop"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                Shop
                            </a>
                            <a
                                href="#how"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                How It Works
                            </a>
                            <a
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                Contact
                            </a>
                            <Link
                                href="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                Manage
                            </Link>
                            <Link
                                href="/selfie"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                Selfie
                            </Link>
                            <Link
                                href="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border-2 border-[#31513A] bg-white px-4 py-3 shadow-[3px_3px_0_#31513A] hover:bg-[#CDE8B5] transition text-center"
                            >
                                Cart
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Auth Button inside Sidebar */}
                    <div className="pt-6 border-t-2 border-[#31513A]/20">
                        {!user ? (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#CDE8B5] py-3 font-black shadow-[3px_3px_0_#31513A] flex items-center justify-center gap-2 text-sm transition"
                            >
                                <LogIn className="w-4 h-4" /> Login
                            </Link>
                        ) : (
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full rounded-full border-2 border-[#31513A] bg-[#FF9EAD] py-3 font-black shadow-[3px_3px_0_#31513A] flex items-center justify-center gap-2 text-sm transition"
                            >
                                Log out <LogOut className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}