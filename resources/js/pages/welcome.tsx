import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Plus } from 'lucide-react';
import Navbar from '@/component/Navbar';

interface Product {
    id: number;
    name: string;
    price: string | number;
    prints: number | string;
    image: string;
    color: string;
}

interface WelcomeProps {
    products: Product[];
    [key: string]: unknown;
}

export default function Welcome({ products }: WelcomeProps) {
    const { auth } = usePage().props; // Access auth from the global page props

    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen overflow-hidden bg-[#FFF8EA] text-[#31513A]">
                {/* NAVBAR */}
                <Navbar auth={auth} />

                {/* HERO */}
                <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-20 md:grid-cols-2">
                    {/* Decorative elements */}

                    <div className="absolute bottom-10 left-1/2 text-3xl">
                        ♡
                    </div>

                    <div>
                        <div className="mb-5 inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black font-semibold shadow-[4px_4px_0_#31513A]">
                            ✨ YOUR MEMORIES, BUT CUTER ✨
                        </div>

                        <h1 className="text-6xl leading-[0.9] font-black tracking-[-0.06em] md:text-8xl">
                            PRINT
                            <br />
                            YOUR
                            <br />
                            <span className="text-[#F26B82]">MEMORIES</span>
                            <span className="text-[#9CCB83]">♡</span>
                        </h1>

                        <p className="mt-7 max-w-lg text-lg leading-relaxed font-semibold text-[#55725D]">
                            Turn your favourite digital moments into cute little
                            Polaroid prints you can actually hold, keep and
                            stick everywhere.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#shop"
                                className="rounded-full border-2 border-[#31513A] bg-[#F26B82] px-7 py-4 text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                Shop Prints 🍓
                            </a>

                            <a
                                href="#how"
                                className="rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-7 py-4 shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                How It Works{' '}
                                <ArrowRight className="ml-2 inline-block h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* POLAROID STACK */}
                    <div className="relative mx-auto h-[470px] w-full max-w-[420px]">
                        <div className="absolute top-12 left-10 h-[330px] w-[250px] rotate-[-10deg] border-4 border-[#31513A] bg-white p-4 shadow-[8px_8px_0_#31513A]">
                            <div className="flex h-[240px] items-center justify-center bg-[#CDE8B5] text-8xl">
                                🍵
                            </div>
                            <p className="mt-4 text-center font-black">
                                matcha mood ✦
                            </p>
                        </div>

                        <div className="absolute top-2 right-8 h-[350px] w-[265px] rotate-[8deg] border-4 border-[#31513A] bg-white p-4 shadow-[8px_8px_0_#31513A]">
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
                    <div className="text-center text-xl font-black tracking-widest whitespace-nowrap">
                        ♡ YOUR FAVOURITE MEMORIES • POLAROID PRINTS • MEMORY
                        ALBUMS • MADE WITH LOVE ♡
                    </div>
                </div>

                {/* PRODUCTS */}
                <section id="shop" className="mx-auto max-w-6xl px-6 py-10">
                    <div className="mb-12 text-center">
                        <p className="font-black text-[#F26B82]">
                            ♡ Pick your pack ♡
                        </p>

                        <h2 className="mt-2 text-5xl font-black tracking-tight md:text-6xl">
                            PRINT SOMETHING
                            <br />
                            <span className="text-[#8BB878]">CUTE.</span>
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                // 1. Added flex flex-col justify-between here
                                className={`rounded-[2rem] border-4 border-[#31513A] ${product.color} flex flex-col justify-between p-5 shadow-[7px_7px_0_#31513A]`}
                            >
                                <div>
                                    <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#31513A] bg-black p-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain shadow-sm"
                                        />
                                    </div>

                                    {/* 2. Added flex-1 to let text content fill space */}
                                    <div className="mt-5 flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black">
                                                {product.name}
                                            </h3>

                                            <p className="font-semibold text-[#55725D]">
                                                {product.prints}
                                            </p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xl font-black">
                                                RM {product.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Changed mt-5 to mt-auto so it always pins to the bottom */}
                                <div className="mt-auto w-full pt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(
                                                '/cart/items',
                                                { product_id: product.id },
                                                { preserveScroll: true },
                                            )
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-2 text-sm font-semibold text-white shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:text-base"
                                    >
                                        <Plus className="inline-block h-5 w-5" />{' '}
                                        Add to cart
                                    </button>
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

                            <h2 className="mt-5 text-5xl leading-tight font-black md:text-7xl">
                                FROM PHONE
                                <br />
                                <span className="inline-flex items-center gap-3">
                                    TO PAPER
                                    <img
                                        src="/images/icon/camera-svgrepo-com.svg"
                                        alt="camera icon"
                                        className="h-12 w-12 object-contain md:h-16 md:w-16"
                                    />
                                </span>
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                [
                                    '01',
                                    'UPLOAD',
                                    'Choose your favourite photos.',
                                ],
                                [
                                    '02',
                                    'CUSTOMISE',
                                    'Arrange your prints however you like.',
                                ],
                                [
                                    '03',
                                    'PRINT!',
                                    'We print and send them to you.',
                                ],
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
