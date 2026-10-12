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
        name: 'Designed Border',
        price: 'RM 5.00',
        numericPrice: 5,
        prints: '9 prints',
        color: 'bg-[#FFF0A8]',
        image: '/images/products/designed.png',
    },
];