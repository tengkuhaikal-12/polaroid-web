import React from "react";
import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from "@/component/Navbar"; // Adjusted path to match your casing convention
import { Camera, Upload, ShoppingCart, Package, Sparkles, User } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;

    // The 6 dashboard menu items pointing to their proper routes
    const dashboardItems = [
        { title: "Selfie Camera", href: "/selfie", icon: Camera, color: "bg-[#FF9EAD]" },
        { title: "Upload Image", href: "/selfie", icon: Upload, color: "bg-[#FFF0A8]" },
        { title: "Cart", href: "/cart", icon: ShoppingCart, color: "bg-[#CDE8B5]" },
        { title: "Orders", href: "/orders", icon: Package, color: "bg-[#B5D8EB]" },
        { title: "Polaroid Studio", href: "/studio", icon: Sparkles, color: "bg-[#EBD8C3]" },
        { title: "Profile", href: "/profile", icon: User, color: "bg-[#FFC8DD]" },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A] flex flex-col justify-between">

                {/* Navbar */}
                <Navbar auth={auth} />

                {/* Main Content Centered */}
                <main className="mx-auto max-w-4xl w-full px-6 py-12 flex-1 flex flex-col items-center justify-center">

                    {/* Header Title */}
                    <div className="text-center mb-10">
                        <div className="inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-4 py-1 font-black text-xs shadow-[3px_3px_0_#31513A] mb-3">
                            WELCOME BACK, {auth?.user?.name?.toUpperCase() || 'USER'}
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">
                            YOUR <span className="text-[#F26B82]">DASHBOARD</span>
                        </h1>
                    </div>

                    {/* 6 Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
                        {dashboardItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`group relative rounded-3xl border-4 border-[#31513A] ${item.color} p-6 shadow-[6px_6px_0_#31513A] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex flex-col items-center justify-center gap-3 text-center min-h-[130px]`}
                                >
                                    <div className="rounded-full border-2 border-[#31513A] bg-white p-3 shadow-[2px_2px_0_#31513A] group-hover:scale-110 transition-transform">
                                        <IconComponent className="w-6 h-6 text-[#31513A]" />
                                    </div>
                                    <span className="font-black text-base text-[#31513A] tracking-wide">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                </main>

            </div>
        </>
    );
}
