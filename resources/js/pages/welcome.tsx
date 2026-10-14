import { Head, Link } from '@inertiajs/react';
import { products } from '@/data/products';
import { ArrowRight, ShoppingCart, Plus } from 'lucide-react';


export default function Welcome() {

    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen overflow-hidden bg-[#FFF8EA] text-[#31513A]">

                {/* NAVBAR */}
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2">
                        <div className="rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A]">
                            tmhta's!
                        </div>
                    </div>
                    <div className="hidden gap-3 rounded-full border-2 border-[#31513A] bg-white/70 px-3 py-2 font-bold md:flex">
                        <a href="#shop" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                            Shop                        </a>
                        <a href="#how" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                            How It Works
                        </a>
                        <a href="#contact" className="hover:text-[#F26B82] hover:bg-[#CDE8B5] px-3 py-1 rounded-full transition">
                            Contact
                        </a>
                    </div>

                    <Link href="/cart" className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />Cart
                    </Link>
                </nav>

                {/* HERO */}
                <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-2">

                    {/* Decorative elements */}

                    <div className="absolute bottom-10 left-1/2 text-3xl">♡</div>

                    <div>
                        <div className="mb-5 inline-block  rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black font-semibold shadow-[4px_4px_0_#31513A]">
                            ✨ YOUR MEMORIES, BUT CUTER ✨
                        </div>

                        <h1 className="text-6xl font-black leading-[0.9] tracking-[-0.06em] md:text-8xl">
                            PRINT
                            <br />
                            YOUR
                            <br />
                            <span className="text-[#F26B82]">MEMORIES</span>
                            <span className="text-[#9CCB83]">♡</span>
                        </h1>

                        <p className="mt-7 max-w-lg text-lg font-semibold leading-relaxed text-[#55725D]">
                            Turn your favourite digital moments into cute little
                            Polaroid prints you can actually hold, keep and
                            stick everywhere.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#shop"
                                className="rounded-full border-2 border-[#31513A] bg-[#F26B82] px-7 py-4 font-black text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                Shop Prints 🍓
                            </a>

                            <a
                                href="#how"
                                className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-7 py-4 font-black shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                How It Works <ArrowRight className="w-5 h-5 inline-block ml-2" />
                            </a>
                        </div>
                    </div>

                    {/* POLAROID STACK */}
                    <div className="relative mx-auto h-[470px] w-full max-w-[420px]">

                        <div className="absolute left-10 top-12 h-[330px] w-[250px] rotate-[-10deg] border-4 border-[#31513A] bg-white p-4 shadow-[8px_8px_0_#31513A]">
                            <div className="flex h-[240px] items-center justify-center bg-[#CDE8B5] text-8xl">
                                🍵
                            </div>
                            <p className="mt-4 text-center font-black">
                                matcha mood ✦
                            </p>
                        </div>

                        <div className="absolute right-8 top-2 h-[350px] w-[265px] rotate-[8deg] border-4 border-[#31513A] bg-white p-4 shadow-[8px_8px_0_#31513A]">
                            <div className="flex h-[255px] items-center justify-center bg-[#FFD6DE] text-8xl">
                                🍓
                            </div>
                            <p className="mt-4 text-center font-black">
                                berry cute ♡
                            </p>
                        </div>
                    </div>
                </section>

                {/* MARQUEE */}
                <div className="rotate-[-2deg] border-y-4 border-[#31513A] bg-[#9CCB83] py-4">
                    <div className="whitespace-nowrap text-center text-xl font-black tracking-widest">
                        ♡ YOUR FAVOURITE MEMORIES • POLAROID PRINTS • MEMORY ALBUMS • MADE WITH LOVE ♡
                    </div>
                </div>

                {/* PRODUCTS */}
                <section id="shop" className="mx-auto max-w-6xl px-6 py-24">

                    <div className="mb-12 text-center">
                        <p className="font-black text-[#F26B82]">♡ Pick your pack ♡</p>

                        <h2 className="mt-2 text-5xl font-black tracking-tight md:text-6xl">
                            PRINT SOMETHING
                            <br />
                            <span className="text-[#8BB878]">CUTE.</span>
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {products.map((product, index) => (
                            <div
                                key={product.name}
                                className={`rounded-[2rem] border-4 border-[#31513A] ${product.color} p-5 shadow-[7px_7px_0_#31513A] `}
                            >
                                <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#31513A] bg-black p-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain shadow-sm"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black">
                                            {product.name}
                                        </h3>
                                        <span className="text-xl font-black">
                                            {product.price}
                                        </span>

                                    </div>

                                    <p className="mt-2 font-semibold text-[#55725D]">
                                        {product.prints}
                                    </p>

                                    <div className="mt-5 w-full">
                                        <button className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-2 font-semibold text-white shadow-[3px_3px_0_#31513A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-sm md:text-base transition">
                                            <Plus className="w-5 h-5 inline-block" /> Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how" className="bg-[#CDE8B5] py-24">
                    <div className="mx-auto max-w-6xl px-6">

                        <div className="mb-14">
                            <span className="rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black">
                                01 — EASY PEASY
                            </span>

                            <h2 className="mt-5 text-5xl font-black md:text-7xl leading-tight">
                                FROM PHONE
                                <br />
                                <span className="inline-flex items-center gap-3">
                                    TO PAPER
                                    <img
                                        src="/images/icon/camera-svgrepo-com.svg"
                                        alt="camera icon"
                                        className="h-12 w-12 md:h-16 md:w-16 object-contain"
                                    />
                                </span>
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                ['01', 'UPLOAD', 'Choose your favourite photos.'],
                                ['02', 'CUSTOMISE', 'Arrange your prints however you like.'],
                                ['03', 'PRINT!', 'We print and send them to you.'],
                            ].map(([number, title, description]) => (
                                <div
                                    key={number}
                                    className="rounded-[2rem] border-4 border-[#31513A] bg-[#FFF8EA] p-7 shadow-[6px_6px_0_#31513A]"
                                >
                                    <span className="text-5xl font-black text-[#F26B82]">
                                        {number}
                                    </span>

                                    <h3 className="mt-8 text-3xl font-black">
                                        {title}
                                    </h3>

                                    <p className="mt-3 font-semibold text-[#55725D]">
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section id="contact" className="px-6 py-24">
                    <div className="mx-auto max-w-5xl rotate-[-1deg] rounded-[3rem] border-4 border-[#31513A] bg-[#F26B82] p-10 text-center shadow-[10px_10px_0_#31513A] md:p-16">

                        <div className="text-5xl">🍓 🍵 ✨</div>

                        <h2 className="mt-5 text-5xl font-black text-white md:text-7xl">
                            MAKE IT
                            <br />
                            A MEMORY.
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-lg font-bold text-white">
                            Your camera roll deserves better than being
                            forgotten in your phone.
                        </p>

                        <a
                            href="#shop"
                            className="mt-8 inline-block rounded-full border-4 border-[#31513A] bg-[#FFF0A8] px-8 py-4 font-black text-[#31513A] shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                            START PRINTING ♡
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
}