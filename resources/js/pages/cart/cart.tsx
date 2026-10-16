import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    ShoppingCart,
    TrashIcon,
} from 'lucide-react';

type Product = {
    id: number;
    name: string;
    prints: number | string;
    image: string | null;
    color: string | null;
};
type CartItem = {
    id: number;
    quantity: number;
    price: string | number;
    product: Product;
};
type CartProps = { cart: { id: number; items: CartItem[] } };

const currency = (value: string | number) => `RM${Number(value).toFixed(2)}`;

export default function Cart({ cart }: CartProps) {
    const items = cart.items;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0,
    );
    const shipping = items.length > 0 ? 5 : 0;

    const updateQuantity = (item: CartItem, quantity: number) => {
        if (quantity < 1) {
            router.delete(`/cart/items/${item.id}`, { preserveScroll: true });
            return;
        }

        router.patch(
            `/cart/items/${item.id}`,
            { quantity },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Cart" />
            <div className="min-h-screen overflow-hidden bg-[#FFF8EA] text-[#31513A]">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                        <ArrowLeft className="h-5 w-5" /> tmhta&apos;s!
                    </Link>
                    <div className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black shadow-[3px_3px_0_#31513A]">
                        <ShoppingBag className="h-5 w-5" /> YOUR BAG (
                        {itemCount})
                    </div>
                </nav>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    <div className="mb-10">
                        <span className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 font-black">
                            <ShoppingCart className="h-5 w-5" /> Checkout
                            Counter
                        </span>
                        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                            Review Your{' '}
                            <span className="text-[#F26B82]">GOODIES</span> 🍓
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="my-16 rounded-[2.5rem] border-4 border-[#31513A] bg-white p-12 text-center shadow-[8px_8px_0_#31513A]">
                            <ShoppingCart className="mx-auto h-20 w-20" />
                            <h2 className="mt-6 text-3xl font-black">
                                Your cart is feeling a bit lonely!
                            </h2>
                            <p className="mt-2 font-semibold text-[#55725D]">
                                Time to fill it up with some cute polaroid
                                prints.
                            </p>
                            <Link
                                href="/"
                                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-8 py-4 font-black text-white shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                START SHOPPING{' '}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-10 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col items-center justify-between gap-6 rounded-[2rem] border-4 border-[#31513A] ${item.product.color ?? 'bg-white'} p-6 shadow-[6px_6px_0_#31513A] sm:flex-row`}
                                    >
                                        <div className="flex w-full items-center gap-5 sm:w-auto">
                                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border-2 border-[#31513A] bg-white shadow-[3px_3px_0_#31513A]">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <ShoppingCart className="h-10 w-10" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black">
                                                    {item.product.name}
                                                </h3>
                                                <p className="font-semibold text-[#55725D]">
                                                    {item.product.prints} prints
                                                </p>
                                                <p className="mt-1 text-xl font-black">
                                                    {currency(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                                            <div className="flex items-center rounded-full border-2 border-[#31513A] bg-white px-3 py-1 font-black shadow-[3px_3px_0_#31513A]">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="px-2 transition hover:text-[#F26B82]"
                                                    aria-label={`Remove one ${item.product.name}`}
                                                >
                                                    −
                                                </button>
                                                <span className="px-3">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="px-2 transition hover:text-[#F26B82]"
                                                    aria-label={`Add one ${item.product.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    router.delete(
                                                        `/cart/items/${item.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className="rounded-full border-2 border-[#31513A] bg-[#FFF0A8] p-3 font-black shadow-[3px_3px_0_#31513A] transition hover:bg-[#F26B82] hover:text-white"
                                                title="Remove item"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-fit rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A]">
                                <h3 className="text-3xl font-black">Summary</h3>
                                <div className="mt-6 space-y-4 font-semibold text-[#55725D]">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-black text-[#31513A]">
                                            {currency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping (Express Mail)</span>
                                        <span className="font-black text-[#31513A]">
                                            {currency(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t-2 border-dashed border-[#31513A]/30 pt-4 text-xl font-black text-[#31513A]">
                                        <span>Total</span>
                                        <span className="text-[#F26B82]">
                                            {currency(subtotal + shipping)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        window.location.href =
                                            'https://tengkumohamadhaikalbintengkuabdullah.bcl.my/embed/form/polaroid';
                                    }}
                                    className="mt-8 w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] py-4 text-center font-black text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
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
