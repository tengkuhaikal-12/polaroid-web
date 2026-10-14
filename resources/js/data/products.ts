// resources/js/data/products.ts

export interface Product {
    id: number;
    name: string;
    price: string;
    numericPrice: number; // useful for cart calculations!
    prints: string;
    color: string;
    image: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Regular',
        price: 'RM 3.50',
        numericPrice: 3.5,
        prints: '9 prints',
        color: 'bg-[#FFD6DE]',
        image: '/images/products/regular.png',
    },
    {
        id: 2,
        name: 'Borderless',
        price: 'RM 4.50',
        numericPrice: 4.5,
        prints: '9 prints',
        color: 'bg-[#CDE8B5]',
        image: '/images/products/borderless.png',
    },
    {
        id: 3,
        name: 'Designed',
        price: 'RM 4.50',
        numericPrice: 4.5,
        prints: '9 prints',
        color: 'bg-[#FFF0A8]',
        image: '/images/products/designed.png',
    },
    {
        id: 4,
        name: 'Photo Strip (x3)',
        price: 'RM 4.50',
        numericPrice: 4.5,
        prints: '1 strip (3 pictures)',
        color: 'bg-[#FDE8F0]',
        image: '/images/products/photo-strip-4.png',
    },
    {
        id: 5,
        name: 'Photo Strip (x4)',
        price: 'RM 4.50',
        numericPrice: 4.5,
        prints: '1 strip (4 pictures)',
        color: 'bg-[#EAE8F0]',
        image: '/images/products/photo-strip-4.png',
    },
];