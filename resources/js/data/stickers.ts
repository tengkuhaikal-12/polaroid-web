export interface StickerDefinition {
    id: string;
    label: string;
    src: string;
}

export const STICKERS: StickerDefinition[] = [
    {
        id: 'heart',
        label: 'Heart',
        src: '/stickers/heart.png',
    },
    {
        id: 'star',
        label: 'Star',
        src: '/stickers/star.png',
    },
    {
        id: 'sparkle',
        label: 'Sparkle',
        src: '/stickers/sparkle.png',
    },
    {
        id: 'best-friends',
        label: 'Best Friends',
        src: '/stickers/best-friends.png',
    },
    {
        id: 'birthday',
        label: 'Birthday',
        src: '/stickers/birthday.png',
    },
    {
        id: 'flower',
        label: 'Flower',
        src: '/stickers/flower.png',
    },
    {
        id: 'love-you',
        label: 'Love You',
        src: '/stickers/love-you.png',
    },
];