import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ShoppingCart, ShoppingBag, ArrowRight, TrashIcon } from 'lucide-react';

// Example initial cart items matching your products
const initialCartItems = [
    {
        id: 1,
        name: 'Mini Sweet',
        price: 15,
        prints: '10 prints',
        color: 'bg-[#FFD6DE]',
        emoji: '🍓',
        quantity: 2,
    },
    {
        id: 2,
        name: 'Matcha Party',
        price: 30,
        prints: '25 prints',
        color: 'bg-[#CDE8B5]',
        emoji: '🍵',
        quantity: 1,
    },
];

export default function Cart() {
    const [cartItems, setCartItems] = useState(initialCartItems);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as typeof initialCartItems
        );
    };

    const removeItem = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = cartItems.length > 0 ? 5 : 0;
    const total = subtotal + shipping;

    return (
        <>
            <Head title="Cart" />

            <div className="min-h-screen overflow-hidden bg-[#FFF8EA] text-[#31513A]">
                {/* NAVBAR */}
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none gap-2"
                        >
                            <ArrowLeft className="w-5 h-5"/> tmhta's!
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black font-semibold shadow-[3px_3px_0_#31513A]">
                        <ShoppingBag className="w-5 h-5"/> YOUR BAG ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                    </div>
                </nav>

                {/* MAIN CART CONTENT */}
                <main className="mx-auto max-w-6xl px-6 py-10">
                    <div className="mb-10">
                        <span className=" flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 font-black font-semibold">
                            <ShoppingCart className="w-5 h-5"/> Checkout Counter
                        </span>
                        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                            Review Your <span className="text-[#F26B82]">GOODIES</span> 🍓
                        </h1>
                    </div>

                    {cartItems.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="my-16 rounded-[2.5rem] border-4 border-[#31513A] bg-white p-12 text-center shadow-[8px_8px_0_#31513A]">
                            <div className="flex text-7xl justify-center"><ShoppingCart className='w-20 h-20'/></div>
                            <h2 className="mt-6 text-3xl font-black">Your cart is feeling a bit lonely!</h2>
                            <p className="mt-2 font-semibold text-[#55725D]">
                                Time to fill it up with some cute polaroid prints.
                            </p>
                            <Link
                                href="/"
                                className="mt-8 inline-block rounded-full border-3 border-[#31513A] bg-[#F26B82] px-8 py-4 font-black text-white shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center gap-2 font-semibold"
                            >
                                START SHOPPING <ArrowRight className="w-5 h-5 inline-block ml-2"/>
                            </Link>
                        </div>
                    ) : (
                        /* FILLED CART GRID */
                        <div className="grid gap-10 lg:grid-cols-3">
                            {/* ITEMS LIST */}
                            <div className="space-y-6 lg:col-span-2">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[2rem] border-4 border-[#31513A] ${item.color} p-6 shadow-[6px_6px_0_#31513A]`}
                                    >
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.25rem] border-2 border-[#31513A] bg-white text-5xl shadow-[3px_3px_0_#31513A]">
                                                {item.emoji}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black">{item.name}</h3>
                                                <p className="font-semibold text-[#55725D]">{item.prints}</p>
                                                <p className="mt-1 text-xl font-black">RM{item.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                            {/* QUANTITY CONTROLS */}
                                            <div className="flex items-center rounded-full border-2 border-[#31513A] bg-white px-3 py-1 font-black shadow-[3px_3px_0_#31513A]">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-2 hover:text-[#F26B82] transition"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-2 hover:text-[#F26B82] transition"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* DELETE BUTTON */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-full border-2 border-[#31513A] bg-[#FFF0A8] p-3 font-black shadow-[3px_3px_0_#31513A] transition hover:bg-[#F26B82] hover:text-white"
                                                title="Remove item"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ORDER SUMMARY CARD */}
                            <div className="rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A] h-fit">
                                <h3 className="text-3xl font-black">Summary</h3>

                                <div className="mt-6 space-y-4 font-semibold text-[#55725D]">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-black text-[#31513A]">RM{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping (Express Mail)</span>
                                        <span className="font-black text-[#31513A]">RM{shipping}</span>
                                    </div>
                                    <div className="border-t-2 border-dashed border-[#31513A]/30 pt-4 flex justify-between text-xl font-black text-[#31513A]">
                                        <span>Total</span>
                                        <span className="text-[#F26B82]">RM{total}</span>
                                    </div>
                                </div>


                                    <button
                                        onClick={() => {
                                            window.location.href =
                                                "https://tengkumohamadhaikalbintengkuabdullah.bcl.my/embed/form/polaroid";
                                        }}
                                        className="mt-8 w-full rounded-full border-3 border-[#31513A] bg-[#F26B82] py-4 text-center font-black text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                                    >
                                        Checkout
                                    </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}