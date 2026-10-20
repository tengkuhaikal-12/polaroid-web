
import React, { useMemo, useState } from 'react';
import {
    ShoppingCart,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { usePhotoboothStore } from '@/stores/usePhotoboothStore';

interface StudioConfig {
    quantity: number;
    style: 'regular' | 'borderless' | 'designed_border';
    album: boolean;
}

interface PhotoItem {
    id: string;
    serverId?: number;
    src: string;
    file: File;
    isSelected: boolean;
}

interface Props {
    photos: PhotoItem[];
    onConfigChange: (config: StudioConfig) => void;
    onPhotoSelectionChange: (
        photoId: string,
        isSelected: boolean,
    ) => void;
}

const QUANTITIES = [
    0, 9, 18, 27, 36, 45, 54, 63, 72, 81,
    90, 99, 108, 117, 126, 135, 144,
];

const STYLES: {
    id: StudioConfig['style'];
    label: string;
}[] = [
        { id: 'regular', label: 'Regular' },
        { id: 'borderless', label: 'Borderless' },
        { id: 'designed_border', label: 'Designed Border' },
    ];

const PRICE_TABLE: Record<StudioConfig['style'], number> = {
    regular: 3.50,
    borderless: 4.50,
    designed_border: 5.50,
};

const ALBUM_PRICE = 6.00;

/**
 * Convert the Zustand state into JSON-safe data.
 * Store actions (functions), File objects and Blob objects
 * are excluded. Uploaded images are submitted separately.
 */
function makeSerializable(
    value: unknown,
    seen = new WeakSet<object>(),
): unknown {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean'
    ) {
        return value;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (
        typeof value === 'undefined' ||
        typeof value === 'function' ||
        typeof value === 'symbol' ||
        typeof value === 'bigint'
    ) {
        return undefined;
    }

    if (typeof value !== 'object') {
        return undefined;
    }

    if (typeof File !== 'undefined' && value instanceof File) {
        return undefined;
    }

    if (typeof Blob !== 'undefined' && value instanceof Blob) {
        return undefined;
    }

    if (seen.has(value)) {
        return undefined;
    }

    seen.add(value);

    if (Array.isArray(value)) {
        return value.map((item) =>
            makeSerializable(item, seen) ?? null,
        );
    }

    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
        const serializable = makeSerializable(item, seen);

        if (serializable !== undefined) {
            result[key] = serializable;
        }
    }

    return result;
}

export default function StudioPurchasePanel({
    photos,
    onConfigChange,
    onPhotoSelectionChange,
}: Props) {
    const [config, setConfig] = useState<StudioConfig>({
        quantity: 9,
        style: 'regular',
        album: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    /*
     * Read the current editor state from Zustand.
     *
     * Serializing the state avoids assuming specific property
     * names such as backgroundColor or backgroundPattern.
     * Actions are excluded by makeSerializable().
     */
    const storeState = usePhotoboothStore();

    const designConfig = useMemo(
        () => makeSerializable(storeState),
        [storeState],
    );

    const totals = useMemo(() => {
        const printingPrice =
            (config.quantity / 9) * PRICE_TABLE[config.style];

        const albumPrice = config.album ? ALBUM_PRICE : 0;

        return {
            printingPrice,
            albumPrice,
            total: printingPrice + albumPrice,
        };
    }, [config]);

    const selectedCount = photos.filter(
        (photo) => photo.isSelected,
    ).length;

    const isValid = selectedCount === config.quantity;

    const isAlbumOnly =
        config.quantity === 0 && config.album;

    const canSubmit =
        isValid &&
        (config.quantity > 0 || config.album) &&
        !isSubmitting;

    const handleConfigUpdate = (
        updates: Partial<StudioConfig>,
    ) => {
        const newConfig = {
            ...config,
            ...updates,
        };

        setConfig(newConfig);
        onConfigChange(newConfig);
    };

    const handleSubmitPrintRequest = () => {
        if (isSubmitting) {
            return;
        }

        const selectedPhotos = photos.filter(
            (photo) => photo.isSelected,
        );

        if (selectedPhotos.length !== config.quantity) {
            alert(
                `Select exactly ${config.quantity} photos.`,
            );
            return;
        }

        if (config.quantity === 0 && !config.album) {
            alert(
                'Choose prints or an album before submitting.',
            );
            return;
        }

        const photosWithoutFiles = photos.filter(
            (photo) =>
                !(photo.file instanceof File) ||
                photo.file.size === 0,
        );

        if (photosWithoutFiles.length > 0) {
            alert(
                'Some photos are missing their original image files. Please upload them again.',
            );
            return;
        }

        let serializedDesign: string;

        try {
            serializedDesign = JSON.stringify(designConfig);

            if (!serializedDesign || serializedDesign === '{}') {
                throw new Error(
                    'The editor has no serializable design data.',
                );
            }
        } catch (error) {
            console.error(
                'Could not serialize editor state:',
                error,
            );

            alert(
                'Could not save your design. Please try again.',
            );
            return;
        }

        const formData = new FormData();

        formData.append(
            'quantity',
            String(config.quantity),
        );

        formData.append('style', config.style);

        formData.append(
            'album',
            config.album ? '1' : '0',
        );

        formData.append(
            'design_json',
            serializedDesign,
        );

        /*
         * Submit the uploaded originals and their selection state.
         * Do not submit photo.src as the stored image.
         * It may be a temporary blob URL.
         */
        photos.forEach((photo, index) => {
            formData.append(
                `photos[${index}][client_id]`,
                photo.id,
            );

            formData.append(
                `photos[${index}][file]`,
                photo.file,
                photo.file.name,
            );

            formData.append(
                `photos[${index}][is_selected]`,
                photo.isSelected ? '1' : '0',
            );

            formData.append(
                `photos[${index}][position]`,
                String(index),
            );
        });

        setIsSubmitting(true);

        router.post(
            '/studio/print-requests',
            formData,
            {
                forceFormData: true,

                onSuccess: () => {
                    /*
                     * Laravel should redirect to the order page
                     * after a successful submission.
                     */
                },

                onError: (errors) => {
                    console.error(
                        'Print request validation failed:',
                        errors,
                    );

                    const firstError = Object.values(errors)[0];

                    if (firstError) {
                        alert(String(firstError));
                    } else {
                        alert(
                            'Unable to submit your print request. Please try again.',
                        );
                    }
                },

                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <aside className="w-full space-y-6 rounded-2xl border-2 border-[#31513A]/15 bg-white p-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-black text-[#31513A]">
                    Print Configuration
                </h3>

                <p className="text-xs text-gray-500">
                    Customize your Polaroid order.
                </p>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
                {/* Quantity */}
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="studio-quantity"
                        className="text-sm font-bold text-[#31513A]"
                    >
                        Quantity
                    </label>

                    <select
                        id="studio-quantity"
                        value={config.quantity}
                        onChange={(event) =>
                            handleConfigUpdate({
                                quantity: Number(event.target.value),
                            })
                        }
                        className="rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#31513A]"
                    >
                        {QUANTITIES.map((quantity) => (
                            <option
                                key={quantity}
                                value={quantity}
                            >
                                {quantity} Photos
                            </option>
                        ))}
                    </select>
                </div>

                {/* Printing style */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#31513A]">
                        Printing Style
                    </label>

                    <div className="grid grid-cols-1 gap-2">
                        {STYLES.map((style) => (
                            <button
                                key={style.id}
                                type="button"
                                onClick={() =>
                                    handleConfigUpdate({
                                        style: style.id,
                                    })
                                }
                                aria-pressed={
                                    config.style === style.id
                                }
                                className={`flex items-center justify-between rounded-lg border p-3 text-sm transition ${config.style === style.id
                                        ? 'border-[#31513A] bg-[#F2F7EF] font-bold'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{style.label}</span>

                                {config.style === style.id && (
                                    <CheckCircle2
                                        size={16}
                                        className="text-[#31513A]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Album */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#31513A]">
                            Add Photo Album
                        </span>

                        <span className="text-xs text-gray-500">
                            + RM {ALBUM_PRICE.toFixed(2)}
                        </span>
                    </div>

                    <input
                        type="checkbox"
                        checked={config.album}
                        onChange={(event) =>
                            handleConfigUpdate({
                                album: event.target.checked,
                            })
                        }
                        aria-label="Add photo album"
                        className="h-5 w-5 rounded border-gray-300 text-[#31513A] focus:ring-[#31513A]"
                    />
                </div>
            </div>

            {/* Photo gallery */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#31513A]">
                        Select Photos
                    </label>

                    <span
                        className={`text-xs font-bold ${isValid
                                ? 'text-green-600'
                                : 'text-red-500'
                            }`}
                    >
                        {selectedCount} / {config.quantity} selected
                    </span>
                </div>

                {photos.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                        Upload photos to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() =>
                                    onPhotoSelectionChange(
                                        photo.id,
                                        !photo.isSelected,
                                    )
                                }
                                aria-pressed={photo.isSelected}
                                aria-label={`Photo ${index + 1}, ${photo.isSelected
                                        ? 'selected'
                                        : 'not selected'
                                    }`}
                                className={`relative aspect-[4/5] cursor-pointer overflow-hidden rounded-lg border-2 text-left transition ${photo.isSelected
                                        ? 'border-[#31513A] ring-2 ring-[#31513A]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <img
                                    src={photo.src}
                                    className="h-full w-full object-cover"
                                    alt={`Photo ${index + 1}`}
                                />

                                {photo.isSelected && (
                                    <span className="absolute right-1 top-1 rounded-full bg-[#31513A] p-0.5 text-white">
                                        <CheckCircle2 size={12} />
                                    </span>
                                )}

                                <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[8px] text-white">
                                    {index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Pricing */}
            <div className="space-y-2 rounded-2xl bg-[#F2F7EF] p-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        Printing
                    </span>

                    <span className="font-medium">
                        RM {totals.printingPrice.toFixed(2)}
                    </span>
                </div>

                {config.album && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Album
                        </span>

                        <span className="font-medium">
                            RM {totals.albumPrice.toFixed(2)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between border-t border-[#DDEBDD] pt-2 font-black text-[#31513A]">
                    <span>Total</span>

                    <span>
                        RM {totals.total.toFixed(2)}
                    </span>
                </div>

                <p className="text-xs text-gray-500">
                    Final pricing is verified by the server.
                </p>
            </div>

            {/* Submit print request */}
            <div className="space-y-3">
                <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={handleSubmitPrintRequest}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#31513A] py-4 font-black text-white transition hover:bg-[#426B4A] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle
                                size={20}
                                className="animate-spin"
                            />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            Submit Print Request
                        </>
                    )}
                </button>

                {!isValid && config.quantity > 0 && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-600">
                        <AlertCircle
                            size={16}
                            className="mt-0.5 shrink-0"
                        />

                        <p className="text-xs leading-relaxed">
                            Please select exactly{' '}
                            {config.quantity} photos to proceed.
                        </p>
                    </div>
                )}

                {config.quantity === 0 &&
                    !config.album && (
                        <p className="text-xs text-gray-500">
                            Select a printing quantity or add an
                            album to continue.
                        </p>
                    )}

                {isAlbumOnly && (
                    <p className="text-xs text-gray-500">
                        Album-only order selected.
                    </p>
                )}
            </div>
        </aside>
    );
}
