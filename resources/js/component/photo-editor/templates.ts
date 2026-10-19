
import type {
    PhotoSlot,
    PhotoTemplate,
} from './types';

interface SlotOptions {
    prefix?: string;
    borderColor?: string;
    borderWidth?: number;
    borderPadding?: number;
    cornerRadius?: number;
    backgroundColor?: string;
}

function createSlot(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options: SlotOptions = {},
): PhotoSlot {
    return {
        id,
        x,
        y,
        width,
        height,
        borderColor: options.borderColor ?? '#FFFFFF',
        borderWidth: options.borderWidth ?? 4,
        borderPadding: options.borderPadding ?? 0,
        cornerRadius: options.cornerRadius ?? 0,
        backgroundColor: options.backgroundColor ?? '#FFFFFF',
    };
}

export function verticalSlots(
    count: number,
    canvasWidth: number,
    startY: number,
    slotWidth: number,
    slotHeight: number,
    gap: number,
    options: SlotOptions = {},
): PhotoSlot[] {
    const startX = (canvasWidth - slotWidth) / 2;
    const prefix = options.prefix ?? 'vertical';

    return Array.from({ length: count }, (_, index) =>
        createSlot(
            `${prefix}-${index + 1}`,
            startX,
            startY + index * (slotHeight + gap),
            slotWidth,
            slotHeight,
            options,
        ),
    );
}

export function gridSlots(
    columns: number,
    rows: number,
    startX: number,
    startY: number,
    slotWidth: number,
    slotHeight: number,
    gapX: number,
    gapY: number,
    options: SlotOptions = {},
): PhotoSlot[] {
    const prefix = options.prefix ?? 'grid';

    return Array.from(
        { length: columns * rows },
        (_, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);

            return createSlot(
                `${prefix}-${index + 1}`,
                startX + column * (slotWidth + gapX),
                startY + row * (slotHeight + gapY),
                slotWidth,
                slotHeight,
                options,
            );
        },
    );
}

export function horizontalSlots(
    count: number,
    canvasHeight: number,
    startX: number,
    slotWidth: number,
    slotHeight: number,
    gap: number,
    options: SlotOptions = {},
): PhotoSlot[] {
    const prefix = options.prefix ?? 'horizontal';

    return Array.from({ length: count }, (_, index) =>
        createSlot(
            `${prefix}-${index + 1}`,
            startX + index * (slotWidth + gap),
            (canvasHeight - slotHeight) / 2,
            slotWidth,
            slotHeight,
            options,
        ),
    );
}

export const PHOTO_TEMPLATES: PhotoTemplate[] = [
    {
        id: 'bff-pink-strip',
        name: 'Best Friends Forever',
        category: 'bff',
        description: 'A pink friendship strip with hearts and stars.',
        width: 600,
        height: 1800,
        backgroundColor: '#FFF0F4',
        background: {
            color: '#FFF0F4',
            pattern: {
                type: 'dots',
                color: '#F5A6BB',
                spacing: 34,
                size: 3,
                opacity: 0.5,
            },
        },
        slots: verticalSlots(
            4, 600, 230, 420, 290, 30,
            {
                prefix: 'bff-photo',
                borderColor: '#FFFFFF',
                borderWidth: 8,
                cornerRadius: 12,
            },
        ),
        stickers: [
            {
                id: 'bff-heart',
                text: '💗',
                x: 35,
                y: 330,
                width: 80,
                height: 80,
                rotation: -15,
            },
            {
                id: 'bff-star',
                text: '⭐',
                x: 475,
                y: 650,
                width: 65,
                height: 65,
                rotation: 12,
            },
            {
                id: 'bff-bottom-heart',
                text: '💕',
                x: 250,
                y: 1530,
                width: 90,
                height: 80,
            },
        ],
        typography: [
            {
                id: 'bff-title',
                text: 'BEST FRIENDS',
                x: 30,
                y: 55,
                width: 540,
                height: 70,
                fontFamily: 'Arial',
                fontSize: 46,
                fontStyle: 'bold',
                color: '#A93D66',
                align: 'center',
            },
            {
                id: 'bff-subtitle',
                text: 'FOREVER & ALWAYS',
                x: 30,
                y: 135,
                width: 540,
                height: 45,
                fontSize: 22,
                fontStyle: 'bold',
                color: '#D96B91',
                align: 'center',
            },
            {
                id: 'bff-footer',
                text: 'MADE WITH LOVE ♥',
                x: 30,
                y: 1660,
                width: 540,
                height: 55,
                fontSize: 24,
                fontStyle: 'bold',
                color: '#A93D66',
                align: 'center',
            },
        ],
    },

    {
        id: 'wedding-ivory-strip',
        name: 'Wedding Memories',
        category: 'wedding',
        description: 'An elegant ivory wedding photo strip.',
        width: 600,
        height: 1800,
        backgroundColor: '#FFF9F0',
        background: {
            color: '#FFF9F0',
            pattern: {
                type: 'grid',
                color: '#D9C7AE',
                spacing: 42,
                size: 1,
                opacity: 0.28,
            },
        },
        slots: verticalSlots(
            3, 600, 300, 440, 340, 42,
            {
                prefix: 'wedding-photo',
                borderColor: '#C8A96B',
                borderWidth: 5,
                borderPadding: 8,
                cornerRadius: 2,
            },
        ),
        stickers: [
            {
                id: 'wedding-flower',
                text: '🌸',
                x: 35,
                y: 420,
                width: 75,
                height: 75,
                rotation: -12,
            },
            {
                id: 'wedding-rings',
                text: '💍',
                x: 455,
                y: 1120,
                width: 85,
                height: 85,
                rotation: 10,
            },
            {
                id: 'wedding-heart',
                text: '🤍',
                x: 260,
                y: 1550,
                width: 80,
                height: 80,
            },
        ],
        typography: [
            {
                id: 'wedding-title',
                text: 'JUST MARRIED',
                x: 30,
                y: 75,
                width: 540,
                height: 75,
                fontFamily: 'Georgia',
                fontSize: 43,
                color: '#8B7355',
                align: 'center',
            },
            {
                id: 'wedding-names',
                text: 'Alex & Jamie',
                x: 30,
                y: 165,
                width: 540,
                height: 65,
                fontFamily: 'Georgia',
                fontSize: 34,
                fontStyle: 'italic',
                color: '#967B5B',
                align: 'center',
            },
            {
                id: 'wedding-footer',
                text: 'OUR WEDDING DAY',
                x: 30,
                y: 1620,
                width: 540,
                height: 55,
                fontSize: 23,
                fontStyle: 'bold',
                color: '#8B7355',
                align: 'center',
            },
        ],
    },

    {
        id: 'y2k-purple-strip',
        name: 'Y2K Dream',
        category: 'y2k',
        description: 'A playful retro strip with sparkles and pastel colors.',
        width: 600,
        height: 1800,
        backgroundColor: '#EDE5FF',
        background: {
            color: '#EDE5FF',
            pattern: {
                type: 'stripes',
                color: '#C7B0FF',
                spacing: 38,
                size: 3,
                opacity: 0.45,
                angle: 35,
            },
        },
        slots: verticalSlots(
            4, 600, 230, 420, 290, 30,
            {
                prefix: 'y2k-photo',
                borderColor: '#FFFFFF',
                borderWidth: 8,
                cornerRadius: 16,
            },
        ),
        stickers: [
            {
                id: 'y2k-sparkle',
                text: '✨',
                x: 35,
                y: 390,
                width: 90,
                height: 90,
                rotation: -10,
            },
            {
                id: 'y2k-disc',
                text: '💿',
                x: 455,
                y: 890,
                width: 90,
                height: 90,
                rotation: 15,
            },
            {
                id: 'y2k-heart',
                text: '💖',
                x: 250,
                y: 1530,
                width: 90,
                height: 80,
            },
        ],
        typography: [
            {
                id: 'y2k-title',
                text: 'GOOD TIMES!',
                x: 30,
                y: 55,
                width: 540,
                height: 80,
                fontFamily: 'Arial',
                fontSize: 48,
                fontStyle: 'bold',
                color: '#7545C7',
                align: 'center',
            },
            {
                id: 'y2k-footer',
                text: '2000s BABY ★',
                x: 30,
                y: 1660,
                width: 540,
                height: 60,
                fontSize: 30,
                fontStyle: 'bold',
                color: '#7545C7',
                align: 'center',
            },
        ],
    },
];
