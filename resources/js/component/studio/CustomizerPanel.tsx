import { useState } from 'react';
import {
    LayoutGrid,
    Palette,
    Sticker as StickerIcon,
    SlidersHorizontal,
} from 'lucide-react';

import { TEMPLATES } from '../../data/templates';
import { STICKERS } from '../../data/stickers';
import { usePhotoboothStore } from '../../stores/usePhotoboothStore';

import type {
    PatternType,
    PhotoFilter,
} from '../../types/photobooth';

const COLORS = [
    '#FBE7E9',
    '#FFF4E8',
    '#DDEBDD',
    '#DDE9F8',
    '#E8DDF4',
    '#FFF0A8',
    '#FFFFFF',
    '#292929',
];

const PATTERNS: {
    id: PatternType;
    label: string;
}[] = [
        { id: 'solid', label: 'Solid' },
        { id: 'plaid', label: 'Plaid' },
        { id: 'sunburst', label: 'Sunburst' },
        { id: 'checkerboard', label: 'Checkerboard' },
    ];

const FILTERS: {
    id: PhotoFilter;
    label: string;
}[] = [
        { id: 'normal', label: 'Original' },
        { id: 'grayscale', label: 'B&W' },
        { id: 'sepia', label: 'Sepia' },
        { id: 'vintage', label: 'Vintage' },
    ];

type Tab = 'layouts' | 'background' | 'stickers' | 'filters';

export default function CustomizerPanel() {
    const [activeTab, setActiveTab] = useState<Tab>('layouts');

    const template = usePhotoboothStore(
        (state) => state.selectedTemplate,
    );
    const backgroundColor = usePhotoboothStore(
        (state) => state.backgroundColor,
    );
    const pattern = usePhotoboothStore(
        (state) => state.selectedPattern,
    );
    const filter = usePhotoboothStore(
        (state) => state.selectedFilter,
    );

    const setTemplate = usePhotoboothStore(
        (state) => state.setTemplate,
    );
    const setBackgroundColor = usePhotoboothStore(
        (state) => state.setBackgroundColor,
    );
    const setPattern = usePhotoboothStore(
        (state) => state.setPattern,
    );
    const setFilter = usePhotoboothStore(
        (state) => state.setFilter,
    );
    const addSticker = usePhotoboothStore(
        (state) => state.addSticker,
    );

    const tabs = [
        { id: 'layouts' as const, label: 'Layouts', Icon: LayoutGrid },
        { id: 'background' as const, label: 'Background', Icon: Palette },
        { id: 'stickers' as const, label: 'Stickers', Icon: StickerIcon },
        { id: 'filters' as const, label: 'Filters', Icon: SlidersHorizontal },
    ];

    function handleAddSticker(src: string) {
        addSticker({
            id: crypto.randomUUID(),
            src,
            x: 35,
            y: 35,
            width: 18,
            height: 18,
            rotation: 0,
        });
    }

    return (
        <aside className="flex min-h-0 w-full flex-col rounded-2xl
            border border-[#E8DFD8] bg-white text-[#31513A]
            lg:w-[320px] lg:shrink-0">

            <div className="grid grid-cols-4 border-b border-[#E8DFD8]">
                {tabs.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-col items-center gap-1
                            px-1 py-3 text-xs transition
                            ${activeTab === id
                                ? 'border-b-2 border-[#31513A] bg-[#F2F7EF] font-bold'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="min-h-[260px] flex-1 space-y-5 overflow-y-auto p-4">

                {activeTab === 'layouts' && (
                    <section>
                        <h3 className="mb-3 font-bold">Choose your layout</h3>

                        <div className="grid grid-cols-2 gap-3">
                            {TEMPLATES.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setTemplate(item)}
                                    className={`rounded-xl border-2 p-3 text-sm
                                        transition hover:bg-[#F2F7EF]
                                        ${template.id === item.id
                                            ? 'border-[#31513A] bg-[#F2F7EF]'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <div
                                        className="mx-auto mb-2 flex w-10 flex-col
                                            gap-0.5 rounded-sm border-2 border-[#31513A]
                                            bg-[#FFF4E8] p-1"
                                        style={{
                                            aspectRatio:
                                                `${item.width}/${item.height}`,
                                        }}
                                    >
                                        {item.slots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="min-h-0 flex-1 bg-[#D6B9A5]"
                                            />
                                        ))}
                                    </div>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'background' && (
                    <section className="space-y-5">
                        <div>
                            <h3 className="mb-3 font-bold">
                                Background color
                            </h3>

                            <div className="grid grid-cols-4 gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        aria-label={`Set background ${color}`}
                                        aria-pressed={backgroundColor === color}
                                        onClick={() => setBackgroundColor(color)}
                                        className={`aspect-square rounded-full border-2
                                            ${backgroundColor === color
                                                ? 'border-[#31513A] ring-2 ring-[#9FCB98]'
                                                : 'border-gray-200'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>

                            <label className="mt-4 flex items-center gap-3 text-sm">
                                Custom color
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(event) =>
                                        setBackgroundColor(event.target.value)
                                    }
                                    className="h-9 w-12 cursor-pointer"
                                />
                            </label>
                        </div>

                        <div>
                            <h3 className="mb-3 font-bold">Pattern</h3>

                            <div className="grid grid-cols-2 gap-2">
                                {PATTERNS.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={pattern === item.id}
                                        onClick={() => setPattern(item.id)}
                                        className={`rounded-lg border p-3 text-sm
                                            ${pattern === item.id
                                                ? 'border-[#31513A] bg-[#F2F7EF]'
                                                : 'border-gray-200'
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'stickers' && (
                    <section>
                        <h3 className="mb-3 font-bold">Sticker library</h3>

                        <div className="grid grid-cols-3 gap-3">
                            {STICKERS.map((sticker) => (
                                <button
                                    key={sticker.id}
                                    type="button"
                                    onClick={() => handleAddSticker(sticker.src)}
                                    className="flex flex-col items-center gap-2
                                        rounded-xl border border-gray-200 p-3
                                        transition hover:border-[#31513A]
                                        hover:bg-[#F2F7EF]"
                                >
                                    <img
                                        src={sticker.src}
                                        alt=""
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span className="text-center text-xs">
                                        {sticker.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'filters' && (
                    <section>
                        <h3 className="mb-3 font-bold">Photo filters</h3>

                        <div className="grid grid-cols-2 gap-3">
                            {FILTERS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={filter === item.id}
                                    onClick={() => setFilter(item.id)}
                                    className={`rounded-xl border-2 p-3 text-sm
                                        ${filter === item.id
                                            ? 'border-[#31513A] bg-[#F2F7EF]'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <div
                                        className="mb-2 aspect-square rounded-lg
                                            bg-gradient-to-br from-pink-200
                                            via-orange-100 to-amber-300"
                                        style={{
                                            filter: item.id === 'grayscale'
                                                ? 'grayscale(1)'
                                                : item.id === 'sepia'
                                                    ? 'sepia(1)'
                                                    : item.id === 'vintage'
                                                        ? 'sepia(.35) contrast(.9) saturate(.75)'
                                                        : 'none',
                                        }}
                                    />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </aside>
    );
}