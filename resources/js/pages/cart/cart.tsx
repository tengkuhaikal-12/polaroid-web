
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    ShoppingCart,
    TrashIcon,
    ImageIcon,
} from 'lucide-react';

type Product = {
    id: number;
    name: string;
    prints: number | string;
    image: string | null;
    color: string | null;
};

type StudioConfig = {
    quantity: number;
    style: 'regular' | 'borderless' | 'designed_border';
    album: boolean;
};

type StudioPhoto = {
    id: number;
    image_url?: string | null;
    image_path?: string | null;
    is_selected?: boolean;
    position?: number;
};

type StudioCollection = {
    id: number;
    printing_quantity: number;
    printing_style: 'regular' | 'borderless' | 'designed_border';
    album_option: boolean;
    photos?: StudioPhoto[];
    preview_url?: string | null;
};

type CartItem = {
    id: number;
    quantity: number;
    price: string | number;
    product: Product;
    options?: {
        type?: string;
        studio_collection_id?: number;
        config?: StudioConfig;
    } | null;
    studio_collection?: StudioCollection | null;
};

type CartProps = {
    cart: {
        id: number;
        items: CartItem[];
    };
};

const currency = (value: string | number) =>
    `RM${Number(value).toFixed(2)}`;

function getStyleName(
    style?: StudioConfig['style'] | StudioCollection['printing_style'],
) {
    switch (style) {
        case 'borderless':
            return 'Borderless';
        case 'designed_border':
            return 'Designed Border';
        default:
            return 'Regular';
    }
}

function isStudioCartItem(item: CartItem) {
    return item.options?.type === 'studio_polaroid_collection';
}

function getItemName(item: CartItem) {
    if (!isStudioCartItem(item)) {
        return item.product.name;
    }

    const quantity =
        item.studio_collection?.printing_quantity ??
        item.options?.config?.quantity ??
        9;

    return quantity === 0
        ? 'Studio Album Only'
        : `PolaroidKU ${quantity} pcs`;
}

function getItemDescription(item: CartItem) {
    if (!isStudioCartItem(item)) {
        return `${item.product.prints} prints`;
    }

    const collection = item.studio_collection;
    const config = item.options?.config;

    const style = getStyleName(
        collection?.printing_style ?? config?.style,
    );

    const hasAlbum =
        collection?.album_option ?? config?.album ?? false;

    return [
        style,
        hasAlbum ? 'Album included' : null,
    ]
        .filter(Boolean)
        .join(' · ');
}

function getItemImage(item: CartItem): string | null {
    if (!isStudioCartItem(item)) {
        return item.product.image;
    }

    const collection = item.studio_collection;

    // Prefer a rendered preview of the complete Studio design.
    if (collection?.preview_url) {
        return collection.preview_url;
    }

    // Fall back to the first photo's URL, if the backend provides one.
    const firstPhoto = [...(collection?.photos ?? [])]
        .sort(
            (a, b) =>
                (a.position ?? 0) - (b.position ?? 0),
        )
        .find((photo) => photo.is_selected !== false);

    if (firstPhoto?.image_url) {
        return firstPhoto.image_url;
    }

    // The backend may return a fully qualified image URL here.
    if (firstPhoto?.image_path?.startsWith('http')) {
        return firstPhoto.image_path;
    }

    // Never display the generic product image as though it were
    // the customer's custom Studio design.
    return null;
}

export default function Cart({ cart }: CartProps) {
    const [paymentChannel, setPaymentChannel] = useState('1');
    const [processingCheckout, setProcessingCheckout] = useState(false);

    const items = cart.items ?? [];

    const itemCount = items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const subtotal = items.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0,
    );

    const shipping = items.length > 0 ? 5 : 0;
    const total = subtotal + shipping;

    const updateQuantity = (
        item: CartItem,
        quantity: number,
    ) => {
        // A Studio cart item represents one configured collection.
        // Do not let the generic quantity selector duplicate it.
        if (isStudioCartItem(item)) {
            return;
        }

        if (quantity < 1) {
            router.delete(`/cart/items/${item.id}`, {
                preserveScroll: true,
            });
            return;
        }

        router.patch(
            `/cart/items/${item.id}`,
            { quantity },
            { preserveScroll: true },
        );
    };

    const handleBayarcashCheckout = () => {
        if (processingCheckout || items.length === 0) {
            return;
        }

        setProcessingCheckout(true);

        router.post(
            '/checkout',
            {
                cart_id: cart.id,
                payment_channel: paymentChannel,
            },
            {
                onError: (errors) => {
                    console.error('Checkout failed:', errors);
                },
                onFinish: () => {
                    setProcessingCheckout(false);
                },
            },
        );
    };

    return (
        <>
            <Head title="Cart" />

            <div className="min-h-screen overflow-hidden bg-[#FFF8EA] text-[#31513A]">
                {/* Navigation */}
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FF9EAD] px-4 py-2 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        tmhta&apos;s!
                    </Link>

                    <div className="flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-2 font-black shadow-[3px_3px_0_#31513A]">
                        <ShoppingBag className="h-5 w-5" />
                        YOUR BAG ({itemCount})
                    </div>
                </nav>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    {/* Page heading */}
                    <div className="mb-10">
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-5 py-2 font-black">
                            <ShoppingCart className="h-5 w-5" />
                            Checkout Counter
                        </span>

                        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                            Review Your{' '}
                            <span className="text-[#F26B82]">
                                GOODIES
                            </span>{' '}
                            🍓
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="my-16 rounded-[2.5rem] border-4 border-[#31513A] bg-white p-12 text-center shadow-[8px_8px_0_#31513A]">
                            <ShoppingCart className="mx-auto h-20 w-20" />

                            <h2 className="mt-6 text-3xl font-black">
                                Your cart is feeling a bit lonely!
                            </h2>

                            <p className="mt-2 font-semibold text-[#55725D]">
                                Time to fill it up with some cute
                                polaroid prints.
                            </p>

                            <Link
                                href="/"
                                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-8 py-4 font-black text-white shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                            >
                                START SHOPPING
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-10 lg:grid-cols-3">
                            {/* Cart items */}
                            <div className="space-y-6 lg:col-span-2">
                                {items.map((item) => {
                                    const studioItem =
                                        isStudioCartItem(item);

                                    const itemName =
                                        getItemName(item);

                                    const itemDescription =
                                        getItemDescription(item);

                                    const itemImage =
                                        getItemImage(item);

                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex flex-col items-center justify-between gap-6 rounded-[2rem] border-4 border-[#31513A] ${item.product.color ??
                                                'bg-white'
                                                } p-6 shadow-[6px_6px_0_#31513A] sm:flex-row`}
                                        >
                                            {/* Image and product details */}
                                            <div className="flex w-full min-w-0 items-center gap-5 sm:w-auto">
                                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border-2 border-[#31513A] bg-white shadow-[3px_3px_0_#31513A]">
                                                    {itemImage ? (
                                                        <img
                                                            src={itemImage}
                                                            alt={itemName}
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1 text-[#31513A]/70">
                                                            <ImageIcon className="h-9 w-9" />
                                                            <span className="text-[10px] font-bold">
                                                                {studioItem
                                                                    ? 'Studio'
                                                                    : 'Preview'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="break-words text-2xl font-black">
                                                        {itemName}
                                                    </h3>

                                                    <p className="font-semibold text-[#55725D]">
                                                        {itemDescription}
                                                    </p>

                                                    {studioItem && (
                                                        <p className="mt-1 text-xs font-semibold text-[#55725D]">
                                                            Custom Studio
                                                            collection
                                                        </p>
                                                    )}

                                                    <p className="mt-1 text-xl font-black">
                                                        {currency(item.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity and remove controls */}
                                            <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                                                <div className="flex items-center rounded-full border-2 border-[#31513A] bg-white px-3 py-1 font-black shadow-[3px_3px_0_#31513A]">
                                                    <button
                                                        type="button"
                                                        disabled={studioItem}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="px-2 transition hover:text-[#F26B82] disabled:cursor-not-allowed disabled:opacity-40"
                                                        aria-label={`Remove one ${itemName}`}
                                                    >
                                                        −
                                                    </button>

                                                    <span className="px-3">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={studioItem}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="px-2 transition hover:text-[#F26B82] disabled:cursor-not-allowed disabled:opacity-40"
                                                        aria-label={`Add one ${itemName}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
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
                                                    aria-label={`Remove ${itemName} from cart`}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order summary */}
                            <div className="h-fit rounded-[2.5rem] border-4 border-[#31513A] bg-white p-8 shadow-[8px_8px_0_#31513A]">
                                <h3 className="text-3xl font-black">
                                    Summary
                                </h3>

                                <div className="mt-6 space-y-4 font-semibold text-[#55725D]">
                                    <div className="flex justify-between gap-4">
                                        <span>Subtotal</span>
                                        <span className="font-black text-[#31513A]">
                                            {currency(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span>
                                            Shipping (Express Mail)
                                        </span>
                                        <span className="font-black text-[#31513A]">
                                            {currency(shipping)}
                                        </span>
                                    </div>

                                    {/* Payment channel */}
                                    <div className="pt-2">
                                        <label
                                            htmlFor="payment-channel"
                                            className="mb-2 block text-sm font-black text-[#31513A]"
                                        >
                                            Select Payment Channel
                                        </label>

                                        <select
                                            id="payment-channel"
                                            value={paymentChannel}
                                            onChange={(event) =>
                                                setPaymentChannel(
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border-2 border-[#31513A] bg-[#FFF8EA] px-4 py-3 font-bold text-[#31513A] shadow-[3px_3px_0_#31513A] focus:outline-none"
                                        >
                                            <option value="1">
                                                FPX (Online Banking)
                                            </option>
                                            <option value="5">
                                                DuitNow Online Banking/Wallets
                                            </option>
                                        </select>
                                    </div>

                                    <div className="flex justify-between gap-4 border-t-2 border-dashed border-[#31513A]/30 pt-4 text-xl font-black text-[#31513A]">
                                        <span>Total</span>
                                        <span className="text-[#F26B82]">
                                            {currency(total)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={processingCheckout}
                                    onClick={handleBayarcashCheckout}
                                    className="mt-8 w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] py-4 text-center font-black text-white shadow-[5px_5px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processingCheckout
                                        ? 'Processing...'
                                        : 'Proceed to Payment'}
                                </button>

                                <p className="mt-4 text-center text-xs font-semibold text-[#55725D]">
                                    Your goodies are waiting for you! 🍓
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
