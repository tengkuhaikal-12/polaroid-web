import { create } from 'zustand';

import type {
    PhotoboothState,
    PhotoboothTemplate,
    PhotoAsset,
    PhotoFilter,
    PatternType,
    Sticker,
} from '../types/photobooth';

import { TEMPLATES } from '../data/templates';

interface PhotoboothActions {
    setTemplate: (template: PhotoboothTemplate) => void;
    setBackgroundColor: (color: string) => void;
    setPattern: (pattern: PatternType) => void;
    setFilter: (filter: PhotoFilter) => void;

    setPhoto: (slotId: string, photo: PhotoAsset | null) => void;

    addSticker: (sticker: Sticker) => void;
    removeSticker: (id: string) => void;
    updateSticker: (
        id: string,
        changes: Partial<Sticker>,
    ) => void;
    selectSticker: (id: string | null) => void;

    clearStickers: () => void;
}

export const usePhotoboothStore = create<
    PhotoboothState & PhotoboothActions
>((set) => ({
    selectedTemplate: TEMPLATES[2],
    backgroundColor: '#FBE7E9',
    selectedPattern: 'solid',
    selectedFilter: 'normal',

    photos: {},
    stickers: [],
    selectedStickerId: null,

    setTemplate: (template) =>
        set({ selectedTemplate: template }),

    setBackgroundColor: (color) =>
        set({ backgroundColor: color }),

    setPattern: (pattern) =>
        set({ selectedPattern: pattern }),

    setFilter: (filter) =>
        set({ selectedFilter: filter }),

    setPhoto: (slotId, photo) =>
        set((state) => ({
            photos: {
                ...state.photos,
                [slotId]: photo,
            },
        })),

    addSticker: (sticker) =>
        set((state) => ({
            stickers: [...state.stickers, sticker],
            selectedStickerId: sticker.id,
        })),

    removeSticker: (id) =>
        set((state) => ({
            stickers: state.stickers.filter(
                (sticker) => sticker.id !== id,
            ),
            selectedStickerId:
                state.selectedStickerId === id
                    ? null
                    : state.selectedStickerId,
        })),

    updateSticker: (id, changes) =>
        set((state) => ({
            stickers: state.stickers.map((sticker) =>
                sticker.id === id
                    ? { ...sticker, ...changes }
                    : sticker,
            ),
        })),

    selectSticker: (id) =>
        set({ selectedStickerId: id }),

    clearStickers: () =>
        set({
            stickers: [],
            selectedStickerId: null,
        }),
}));