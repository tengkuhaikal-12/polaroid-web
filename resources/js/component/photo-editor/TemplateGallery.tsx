
import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';

import type {
    PhotoTemplate,
    TemplateCategory,
} from './types';

interface Props {
    templates: PhotoTemplate[];
    selectedTemplateId: string;
    onSelect: (template: PhotoTemplate) => void;
}

type GalleryCategory = 'all' | TemplateCategory;

const categories: {
    label: string;
    value: GalleryCategory;
}[] = [
        { label: 'All', value: 'all' },
        { label: 'Best Friends', value: 'bff' },
        { label: 'Wedding', value: 'wedding' },
        { label: 'Y2K', value: 'y2k' },
        { label: 'Classic', value: 'classic' },
        { label: 'Polaroid', value: 'polaroid' },
        { label: 'Collage', value: 'collage' },
    ];

function TemplatePreview({
    template,
}: {
    template: PhotoTemplate;
}) {
    const scale = Math.min(
        76 / template.width,
        120 / template.height,
    );

    return (
        <div
            className="relative mx-auto overflow-hidden rounded-md border-2 border-[#31513A] shadow-sm"
            style={{
                width: template.width * scale,
                height: template.height * scale,
                backgroundColor:
                    template.background.color ??
                    template.backgroundColor ??
                    '#FFFFFF',
            }}
        >
            {/* Approximate the pattern in the gallery thumbnail. */}
            {template.background.pattern?.type === 'dots' && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(${template.background.pattern.color} 1px, transparent 1px)`,
                        backgroundSize: `${Math.max(4, template.background.pattern.spacing * scale)}px ${Math.max(4, template.background.pattern.spacing * scale)}px`,
                        opacity: template.background.pattern.opacity,
                    }}
                />
            )}

            {template.background.pattern?.type === 'grid' && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(${template.background.pattern.color} 1px, transparent 1px), linear-gradient(90deg, ${template.background.pattern.color} 1px, transparent 1px)`,
                        backgroundSize: `${Math.max(4, template.background.pattern.spacing * scale)}px ${Math.max(4, template.background.pattern.spacing * scale)}px`,
                        opacity: template.background.pattern.opacity,
                    }}
                />
            )}

            {template.slots.map((slot) => (
                <div
                    key={slot.id}
                    className="absolute"
                    style={{
                        left: slot.x * scale,
                        top: slot.y * scale,
                        width: slot.width * scale,
                        height: slot.height * scale,
                        backgroundColor:
                            slot.backgroundColor ?? '#CDE8B5',
                        border: `${Math.max(0.5, (slot.borderWidth ?? 2) * scale)}px solid ${slot.borderColor ?? '#FFFFFF'}`,
                        borderRadius: (slot.cornerRadius ?? 0) * scale,
                        boxSizing: 'border-box',
                        transform: slot.rotation
                            ? `rotate(${slot.rotation}deg)`
                            : undefined,
                    }}
                />
            ))}

            {template.typography.slice(0, 1).map((item) => (
                <div
                    key={item.id}
                    className="absolute overflow-hidden font-bold"
                    style={{
                        left: item.x * scale,
                        top: item.y * scale,
                        width: item.width * scale,
                        height: item.height * scale,
                        color: item.color,
                        fontSize: Math.max(3, item.fontSize * scale),
                        textAlign: item.align ?? 'center',
                        lineHeight: 1.1,
                    }}
                >
                    {item.text}
                </div>
            ))}

            {template.stickers.slice(0, 4).map((sticker) => (
                <span
                    key={sticker.id}
                    className="absolute flex items-center justify-center"
                    style={{
                        left: sticker.x * scale,
                        top: sticker.y * scale,
                        width: sticker.width * scale,
                        height: sticker.height * scale,
                        fontSize: Math.max(
                            4,
                            Math.min(
                                sticker.width,
                                sticker.height,
                            ) * scale * 0.65,
                        ),
                        transform: `rotate(${sticker.rotation ?? 0}deg)`,
                    }}
                >
                    {sticker.text ?? ''}
                </span>
            ))}
        </div>
    );
}

export default function TemplateGallery({
    templates,
    selectedTemplateId,
    onSelect,
}: Props) {
    const [category, setCategory] =
        useState<GalleryCategory>('all');

    const availableCategories = useMemo(
        () => categories.filter(
            (item) =>
                item.value === 'all' ||
                templates.some(
                    (template) => template.category === item.value,
                ),
        ),
        [templates],
    );

    const filteredTemplates = useMemo(
        () => templates.filter(
            (template) =>
                category === 'all' ||
                template.category === category,
        ),
        [templates, category],
    );

    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-sm font-black text-[#31513A]">
                    Choose your template
                </h2>

                <p className="mt-1 text-xs font-semibold text-[#55725D]">
                    Pick a design for your memories.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {availableCategories.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setCategory(item.value)}
                        aria-pressed={category === item.value}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${category === item.value
                                ? 'border-[#31513A] bg-[#31513A] text-white'
                                : 'border-[#31513A]/20 bg-white text-[#31513A] hover:bg-[#F2EDC2]'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map((template) => {
                    const active =
                        template.id === selectedTemplateId;

                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onSelect(template)}
                            aria-pressed={active}
                            className={`relative rounded-2xl border-2 p-3 text-left transition ${active
                                    ? 'border-[#31513A] bg-[#FFF0A8] shadow-[4px_4px_0_#31513A]'
                                    : 'border-[#31513A]/20 bg-white hover:border-[#31513A]'
                                }`}
                        >
                            {active && (
                                <span className="absolute right-2 top-2 z-10 rounded-full border border-[#31513A] bg-[#F26B82] p-1 text-white shadow-[2px_2px_0_#31513A]">
                                    <Check size={12} />
                                </span>
                            )}

                            <TemplatePreview template={template} />

                            <p className="mt-3 text-xs font-black text-[#31513A]">
                                {template.name}
                            </p>

                            <p className="mt-1 text-[11px] text-[#55725D]">
                                {template.slots.length}{' '}
                                {template.slots.length === 1
                                    ? 'photo'
                                    : 'photos'}
                            </p>

                            <p className="mt-1 line-clamp-2 text-[10px] text-gray-500">
                                {template.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {filteredTemplates.length === 0 && (
                <p className="rounded-xl border border-dashed p-4 text-center text-xs text-gray-500">
                    No templates in this category yet.
                </p>
            )}
        </section>
    );
}
