
import type { PhotoboothTemplate } from '../types/photobooth';

function verticalTemplate(
    id: string,
    name: string,
    count: number,
): PhotoboothTemplate {
    const padding = 5;
    const gap = 2;

    const slotHeight =
        (100 - padding * 2 - gap * (count - 1)) / count;

    return {
        id,
        name,
        width: 600,
        height: 1800,
        backgroundColor: '#FFF4E8',
        frameColor: '#FFFFFF',
        slots: Array.from({ length: count }, (_, i) => ({
            id: `slot-${i + 1}`,
            x: padding,
            y: padding + i * (slotHeight + gap),
            width: 90,
            height: slotHeight,
        })),
    };
}

export const TEMPLATES: PhotoboothTemplate[] = [
    // Single-photo Polaroid with extra space underneath.
    {
        id: 'single-polaroid',
        name: 'Classic Polaroid',
        width: 1200,
        height: 1500,
        backgroundColor: '#FFFFFF',
        frameColor: '#FFFFFF',
        slots: [
            {
                id: 'slot-1',
                x: 6,
                y: 5,
                width: 88,
                height: 70,
            },
        ],
    },

    verticalTemplate('strip-2', '2 Shots', 2),
    verticalTemplate('strip-3', '3 Shots', 3),
    verticalTemplate('strip-4', '4 Shots', 4),
    verticalTemplate('strip-5', '5 Shots', 5),

    {
        id: 'grid-4',
        name: '2 × 2 Grid',
        width: 1200,
        height: 1200,
        backgroundColor: '#FBE7E9',
        frameColor: '#FFFFFF',
        slots: [
            { id: 'slot-1', x: 5, y: 5, width: 43, height: 43 },
            { id: 'slot-2', x: 52, y: 5, width: 43, height: 43 },
            { id: 'slot-3', x: 5, y: 52, width: 43, height: 43 },
            { id: 'slot-4', x: 52, y: 52, width: 43, height: 43 },
        ],
    },
];
