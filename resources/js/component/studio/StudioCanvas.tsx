
import { useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, PointerEvent } from 'react';

import {
    ImagePlus,
    RotateCw,
    Trash2,
    Camera,
    ShoppingCart,
} from 'lucide-react';

import { router } from '@inertiajs/react';

import { usePhotoboothStore } from '../../stores/usePhotoboothStore';
import type { PhotoFilter } from '../../types/photobooth';
import AutoPhotoCapture from '../../component/photobooth/AutoPhotoCapture';

// ============================================================
// 1. TYPES
// ============================================================

interface PhotoAsset {
    id: string;
    src: string;
    name: string;
    file: File;
}

interface PolaroidItem {
    id: string;
    photo: PhotoAsset | null;
}

type DragMode = 'move' | 'resize';

// ============================================================
// 2. CONSTANTS
// ============================================================

const MAX_POLAROIDS = 9;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const filterStyles: Record<PhotoFilter, string> = {
    normal: 'none',
    grayscale: 'grayscale(1)',
    sepia: 'sepia(1)',
    vintage: 'sepia(.35) saturate(.75) contrast(.9)',
};

// ============================================================
// 3. HELPER FUNCTIONS
// ============================================================

/**
 * Converts a Base64 data URL into an actual File object.
 * Used for camera-captured photos.
 */
function dataUrlToFile(dataUrl: string, filename: string): File {
    const match = dataUrl.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
        throw new Error('Invalid camera image data.');
    }

    const mimeType = match[1];
    const base64 = match[2];

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], filename, {
        type: mimeType,
    });
}

/**
 * Creates a photo object containing both:
 * - src: for browser previews
 * - file: for uploading to Laravel
 */
function createPhotoAsset(file: File): PhotoAsset {
    return {
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        name: file.name,
        file,
    };
}

// ============================================================
// 4. MAIN COMPONENT
// ============================================================

export default function StudioCanvas() {
    // --------------------------------------------------------
    // 4.1 LOCAL STATE
    // --------------------------------------------------------

    const [cameraOpen, setCameraOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [polaroids, setPolaroids] = useState<PolaroidItem[]>([
        {
            id: crypto.randomUUID(),
            photo: null,
        },
    ]);

    const [activePolaroidId, setActivePolaroidId] = useState(
        () => polaroids[0].id,
    );

    const [dragging, setDragging] = useState<{
        id: string;
        mode: DragMode;
        pointerX: number;
        pointerY: number;
        initialX: number;
        initialY: number;
        initialWidth: number;
        initialHeight: number;
    } | null>(null);

    const workspaceRef = useRef<HTMLDivElement>(null);

    // --------------------------------------------------------
    // 4.2 ZUSTAND STORE
    // --------------------------------------------------------

    const template = usePhotoboothStore(
        (state) => state.selectedTemplate,
    );

    const photos = usePhotoboothStore(
        (state) => state.photos,
    );

    const filter = usePhotoboothStore(
        (state) => state.selectedFilter,
    );

    const stickers = usePhotoboothStore(
        (state) => state.stickers,
    );

    const selectedId = usePhotoboothStore(
        (state) => state.selectedStickerId,
    );

    const setPhoto = usePhotoboothStore(
        (state) => state.setPhoto,
    );

    const updateSticker = usePhotoboothStore(
        (state) => state.updateSticker,
    );

    const removeSticker = usePhotoboothStore(
        (state) => state.removeSticker,
    );

    const selectSticker = usePhotoboothStore(
        (state) => state.selectSticker,
    );

    const backgroundColor = usePhotoboothStore(
        (state) => state.backgroundColor,
    );

    const pattern = usePhotoboothStore(
        (state) => state.selectedPattern,
    );

    // --------------------------------------------------------
    // 4.3 DERIVED VALUES
    // --------------------------------------------------------

    const activePolaroid = polaroids.find(
        (item) => item.id === activePolaroidId,
    );

    const readyCount = polaroids.filter(
        (item) => item.photo !== null,
    ).length;

    const missingPictures = MAX_POLAROIDS - readyCount;

    const canPrint =
        polaroids.length === MAX_POLAROIDS &&
        readyCount === MAX_POLAROIDS;

    // --------------------------------------------------------
    // 5. COLLECTION FUNCTIONS
    // --------------------------------------------------------

    function addPolaroid() {
        if (polaroids.length >= MAX_POLAROIDS) return;

        const newPolaroid: PolaroidItem = {
            id: crypto.randomUUID(),
            photo: null,
        };

        setPolaroids((current) => [
            ...current,
            newPolaroid,
        ]);

        setActivePolaroidId(newPolaroid.id);
        selectSticker(null);
    }

    function updateActivePolaroidPhoto(photo: PhotoAsset) {
        setPolaroids((current) =>
            current.map((item) =>
                item.id === activePolaroidId
                    ? { ...item, photo }
                    : item,
            ),
        );
    }

    function selectPolaroid(polaroid: PolaroidItem) {
        setActivePolaroidId(polaroid.id);
        selectSticker(null);
    }

    // --------------------------------------------------------
    // 6. PHOTO UPLOAD
    // --------------------------------------------------------

    function uploadPhoto(
        event: ChangeEvent<HTMLInputElement>,
        slotId: string,
    ) {
        const input = event.currentTarget;
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            window.alert('Please select an image file.');
            input.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            window.alert(
                'Please choose an image smaller than 15 MB.',
            );
            input.value = '';
            return;
        }

        const photo = createPhotoAsset(file);

        if (slotId === template.slots[0]?.id) {
            updateActivePolaroidPhoto(photo);
        } else {
            // Preserve the existing template-slot behaviour.
            setPhoto(slotId, photo);
        }

        input.value = '';
    }

    // --------------------------------------------------------
    // 7. CAMERA CAPTURE
    // --------------------------------------------------------

    function handleCaptureComplete(capturedPhotos: string[]) {
        const dataUrl = capturedPhotos[0];

        if (!dataUrl) {
            setCameraOpen(false);
            return;
        }

        try {
            const photoNumber =
                polaroids.findIndex(
                    (item) => item.id === activePolaroidId,
                ) + 1;

            const file = dataUrlToFile(
                dataUrl,
                `polaroid-${photoNumber}.jpg`,
            );

            if (file.size > MAX_FILE_SIZE) {
                window.alert(
                    'The captured photo is too large. Please try again.',
                );
                setCameraOpen(false);
                return;
            }

            const photo = createPhotoAsset(file);

            updateActivePolaroidPhoto(photo);
        } catch (error) {
            console.error('Camera photo conversion failed:', error);
            window.alert(
                'Unable to process the captured photo. Please try again.',
            );
        }

        setCameraOpen(false);
    }

    // --------------------------------------------------------
    // 8. ADD TO CART
    // --------------------------------------------------------

    function handleAddToCart() {
        if (!canPrint) {
            window.alert(
                'Please fill all nine Polaroids before adding them to your cart.',
            );
            return;
        }

        if (polaroids.some((item) => !item.photo?.file)) {
            window.alert(
                'One or more photos are missing. Please upload them again.',
            );
            return;
        }

        const formData = {
            polaroids: polaroids.map((item) => ({
                photo: item.photo!.file,
            })),
        };

        setIsSubmitting(true);

        router.post('/cart/studio', formData, {
            forceFormData: true,

            onError: (errors) => {
                console.error('Add to cart failed:', errors);
            },

            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    }

    // --------------------------------------------------------
    // 9. STICKER DRAG AND RESIZE
    // --------------------------------------------------------

    function startDrag(
        event: PointerEvent<HTMLDivElement>,
        sticker: (typeof stickers)[number],
        mode: DragMode,
    ) {
        event.preventDefault();
        event.stopPropagation();

        selectSticker(sticker.id);

        const rect =
            workspaceRef.current?.getBoundingClientRect();

        if (!rect) return;

        event.currentTarget.setPointerCapture(event.pointerId);

        setDragging({
            id: sticker.id,
            mode,
            pointerX: event.clientX,
            pointerY: event.clientY,
            initialX: sticker.x,
            initialY: sticker.y,
            initialWidth: sticker.width,
            initialHeight: sticker.height,
        });
    }

    function moveDrag(event: PointerEvent<HTMLDivElement>) {
        if (!dragging) return;

        const rect =
            workspaceRef.current?.getBoundingClientRect();

        if (!rect) return;

        const dx =
            ((event.clientX - dragging.pointerX) / rect.width) * 100;

        const dy =
            ((event.clientY - dragging.pointerY) / rect.height) * 100;

        if (dragging.mode === 'move') {
            updateSticker(dragging.id, {
                x: Math.max(
                    0,
                    Math.min(95, dragging.initialX + dx),
                ),
                y: Math.max(
                    0,
                    Math.min(95, dragging.initialY + dy),
                ),
            });
        } else {
            updateSticker(dragging.id, {
                width: Math.max(
                    4,
                    Math.min(80, dragging.initialWidth + dx),
                ),
                height: Math.max(
                    4,
                    Math.min(80, dragging.initialHeight + dy),
                ),
            });
        }
    }

    // --------------------------------------------------------
    // 10. BACKGROUND STYLES
    // --------------------------------------------------------

    const backgroundStyles: CSSProperties = {
        backgroundColor,

        ...(pattern === 'plaid' && {
            backgroundImage: `
                repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 18px,
                    rgba(49,81,58,.13) 19px,
                    rgba(49,81,58,.13) 21px
                ),
                repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 18px,
                    rgba(49,81,58,.13) 19px,
                    rgba(49,81,58,.13) 21px
                )
            `,
        }),

        ...(pattern === 'checkerboard' && {
            backgroundImage: `
                conic-gradient(
                    rgba(49,81,58,.12) 25%,
                    transparent 0 50%,
                    rgba(49,81,58,.12) 0 75%,
                    transparent 0
                )
            `,
            backgroundSize: '32px 32px',
        }),

        ...(pattern === 'sunburst' && {
            backgroundImage: `
                repeating-conic-gradient(
                    from 0deg at 50% 50%,
                    rgba(255,255,255,.4) 0deg 10deg,
                    transparent 10deg 20deg
                )
            `,
        }),
    };

    // ============================================================
    // 11. RENDER
    // ============================================================

    return (
        <section
            className="flex min-w-0 flex-1 flex-col items-center
                gap-4 rounded-2xl bg-[#F5F1ED] p-4 md:p-8"
        >
            {/* HEADER */}

            <div className="flex w-full items-center justify-between gap-2">
                <div>
                    <h2 className="font-bold text-[#31513A]">
                        Your Polaroid Studio
                    </h2>

                    <p className="text-xs text-gray-500">
                        Editing Polaroid{' '}
                        {polaroids.findIndex(
                            (item) => item.id === activePolaroidId,
                        ) + 1}{' '}
                        of {polaroids.length}
                    </p>
                </div>

                {selectedId && (
                    <button
                        type="button"
                        onClick={() => removeSticker(selectedId)}
                        className="flex items-center gap-2 rounded-lg
                            bg-white px-3 py-2 text-sm text-red-600
                            shadow-sm hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Remove Sticker
                    </button>
                )}
            </div>

            {/* CANVAS AND COLLECTION */}

            <div
                className="grid w-full min-w-0 grid-cols-1
                    items-start gap-6
                    xl:grid-cols-[minmax(0,1fr)_260px]"
            >
                {/* CANVAS */}

                <div className="flex min-w-0 flex-col items-center gap-4">
                    <div className="flex w-full items-center justify-center overflow-auto py-2">
                        <div
                            ref={workspaceRef}
                            onPointerMove={moveDrag}
                            onPointerUp={() => setDragging(null)}
                            onPointerCancel={() => setDragging(null)}
                            onPointerDown={(event) => {
                                if (event.target === event.currentTarget) {
                                    selectSticker(null);
                                }
                            }}
                            className="relative shrink-0 overflow-hidden rounded-sm
                                shadow-[0_15px_45px_rgba(0,0,0,.15)]"
                            style={{
                                ...backgroundStyles,
                                aspectRatio: `${template.width}/${template.height}`,
                                width: `min(100%, 360px, calc((100dvh - 220px) * ${template.width / template.height}))`,
                            }}
                        >
                            {/* PHOTO SLOTS */}

                            {template.slots.map((slot) => {
                                const photo =
                                    slot.id === template.slots[0]?.id
                                        ? activePolaroid?.photo
                                        : photos[slot.id];

                                return (
                                    <div
                                        key={slot.id}
                                        className="absolute overflow-hidden
                                            border border-white/60 bg-white/50"
                                        style={{
                                            left: `${slot.x}%`,
                                            top: `${slot.y}%`,
                                            width: `${slot.width}%`,
                                            height: `${slot.height}%`,
                                        }}
                                    >
                                        {photo ? (
                                            <img
                                                src={photo.src}
                                                alt={photo.name}
                                                draggable={false}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    filter: filterStyles[filter],
                                                }}
                                            />
                                        ) : (
                                            <label
                                                className="flex h-full w-full
                                                    cursor-pointer flex-col
                                                    items-center justify-center
                                                    gap-2 text-[#31513A]
                                                    hover:bg-white/80"
                                            >
                                                <ImagePlus
                                                    size={24}
                                                    className="max-sm:hidden"
                                                />

                                                <span className="text-center text-xs">
                                                    Add Photo
                                                </span>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(event) =>
                                                        uploadPhoto(
                                                            event,
                                                            slot.id,
                                                        )
                                                    }
                                                />
                                            </label>
                                        )}
                                    </div>
                                );
                            })}

                            {/* STICKERS */}

                            {stickers.map((sticker) => (
                                <div
                                    key={sticker.id}
                                    onPointerDown={(event) =>
                                        startDrag(event, sticker, 'move')
                                    }
                                    className={`absolute touch-none select-none ${selectedId === sticker.id
                                            ? 'z-20 outline outline-2 outline-dashed outline-[#31513A]'
                                            : 'z-10'
                                        }`}
                                    style={{
                                        left: `${sticker.x}%`,
                                        top: `${sticker.y}%`,
                                        width: `${sticker.width}%`,
                                        height: `${sticker.height}%`,
                                        transform: `rotate(${sticker.rotation}deg)`,
                                        cursor:
                                            dragging?.id === sticker.id
                                                ? 'grabbing'
                                                : 'grab',
                                    }}
                                >
                                    <img
                                        src={sticker.src}
                                        alt="Sticker"
                                        draggable={false}
                                        className="pointer-events-none h-full w-full object-contain"
                                    />

                                    {selectedId === sticker.id && (
                                        <>
                                            <button
                                                type="button"
                                                title="Rotate sticker 15 degrees"
                                                onPointerDown={(event) =>
                                                    event.stopPropagation()
                                                }
                                                onClick={() =>
                                                    updateSticker(sticker.id, {
                                                        rotation:
                                                            (sticker.rotation + 15) % 360,
                                                    })
                                                }
                                                className="absolute -right-3 -top-3
                                                    flex h-6 w-6 items-center
                                                    justify-center rounded-full
                                                    bg-white text-[#31513A] shadow"
                                            >
                                                <RotateCw size={13} />
                                            </button>

                                            <div
                                                onPointerDown={(event) =>
                                                    startDrag(
                                                        event,
                                                        sticker,
                                                        'resize',
                                                    )
                                                }
                                                className="absolute -bottom-2
                                                    -right-2 h-4 w-4
                                                    cursor-nwse-resize rounded-sm
                                                    border-2 border-white
                                                    bg-[#31513A]"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CAMERA */}

                    <button
                        type="button"
                        onClick={() => setCameraOpen(true)}
                        className="flex items-center gap-2 rounded-xl
                            bg-[#31513A] px-5 py-3 font-bold text-white
                            transition hover:bg-[#426B4A]"
                    >
                        <Camera size={18} />
                        Take Photo
                    </button>
                </div>

                {/* COLLECTION SIDEBAR */}

                <aside className="w-full rounded-2xl border-2
                    border-[#31513A]/15 bg-white p-4"
                >
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <div>
                            <h3 className="font-black text-[#31513A]">
                                Your Polaroids
                            </h3>

                            <p className="text-xs text-gray-500">
                                {readyCount} of 9 ready to print
                            </p>
                        </div>

                        <span className="rounded-full bg-[#F2EDC2]
                            px-3 py-1 text-sm font-bold text-[#31513A]"
                        >
                            {polaroids.length}/9
                        </span>
                    </div>

                    {/* THUMBNAILS */}

                    <div className="grid grid-cols-3 gap-2">
                        {polaroids.map((polaroid, index) => (
                            <button
                                key={polaroid.id}
                                type="button"
                                onClick={() => selectPolaroid(polaroid)}
                                aria-label={`Select Polaroid ${index + 1}`}
                                aria-pressed={
                                    activePolaroidId === polaroid.id
                                }
                                className={`relative aspect-[4/5]
                                    overflow-hidden border-2 bg-[#FFF4E8] p-1
                                    transition ${activePolaroidId === polaroid.id
                                        ? 'border-[#31513A] shadow-[3px_3px_0_#31513A]'
                                        : 'border-gray-200 hover:border-[#79AE6F]'
                                    }`}
                            >
                                {polaroid.photo ? (
                                    <img
                                        src={polaroid.photo.src}
                                        alt={`Polaroid ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full flex-col
                                        items-center justify-center gap-1
                                        text-xs text-[#31513A]/60"
                                    >
                                        <ImagePlus size={18} />
                                        Photo {index + 1}
                                    </span>
                                )}

                                <span className="absolute bottom-1 right-1
                                    rounded bg-white/90 px-1 text-[10px]
                                    font-bold text-[#31513A]"
                                >
                                    {index + 1}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ADD POLAROID */}

                    <button
                        type="button"
                        onClick={addPolaroid}
                        disabled={polaroids.length >= MAX_POLAROIDS}
                        className="mt-4 flex w-full items-center
                            justify-center gap-2 rounded-xl border-2
                            border-dashed border-[#31513A] px-3 py-3
                            text-sm font-bold text-[#31513A]
                            hover:bg-[#F2EDC2] disabled:cursor-not-allowed
                            disabled:opacity-40"
                    >
                        <ImagePlus size={18} />

                        {polaroids.length >= MAX_POLAROIDS
                            ? 'Collection Full'
                            : 'Add More Pictures'}
                    </button>

                    {/* PROGRESS */}

                    <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs text-gray-500">
                            <span>Print Collection</span>
                            <span>{readyCount}/9</span>
                        </div>

                        <div
                            className="h-2 overflow-hidden rounded-full bg-gray-100"
                            role="progressbar"
                            aria-label="Polaroid print completion"
                            aria-valuemin={0}
                            aria-valuemax={9}
                            aria-valuenow={readyCount}
                        >
                            <div
                                className="h-full rounded-full bg-[#79AE6F]
                                    transition-all duration-300"
                                style={{
                                    width: `${(readyCount / MAX_POLAROIDS) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* ADD TO CART */}

                    <div className="group relative mt-4">
                        <button
                            type="button"
                            disabled={!canPrint || isSubmitting}
                            onClick={handleAddToCart}
                            className="flex w-full items-center justify-center
                                gap-2 rounded-xl bg-[#31513A] px-4 py-3
                                font-black text-white transition
                                hover:bg-[#426B4A] disabled:cursor-not-allowed
                                disabled:bg-gray-300 disabled:text-gray-600
                                disabled:hover:bg-gray-300"
                        >
                            <ShoppingCart size={18} />

                            {isSubmitting
                                ? 'Adding to Cart...'
                                : 'Add to Cart'}
                        </button>

                        {!canPrint && (
                            <div
                                role="tooltip"
                                className="pointer-events-none absolute
                                    bottom-full left-1/2 z-30 mb-2 w-max
                                    max-w-[220px] -translate-x-1/2
                                    rounded-lg bg-[#183522] px-3 py-2
                                    text-center text-xs font-medium text-white
                                    opacity-0 shadow-lg transition
                                    group-hover:opacity-100
                                    group-focus-within:opacity-100"
                            >
                                {polaroids.length < MAX_POLAROIDS
                                    ? `Add ${MAX_POLAROIDS - polaroids.length} more Polaroid ${MAX_POLAROIDS - polaroids.length === 1
                                        ? 'card'
                                        : 'cards'
                                    } and fill all photos.`
                                    : `You need ${missingPictures} more ${missingPictures === 1
                                        ? 'picture'
                                        : 'pictures'
                                    }.`}
                            </div>
                        )}
                    </div>

                    <p className="mt-3 text-center text-xs text-gray-500">
                        {canPrint
                            ? 'All 9 Polaroids are ready to print!'
                            : 'Complete all 9 Polaroids to continue to printing.'}
                    </p>
                </aside>
            </div>

            {/* CAMERA MODAL */}

            {cameraOpen && (
                <AutoPhotoCapture
                    slotCount={1}
                    onClose={() => setCameraOpen(false)}
                    onComplete={handleCaptureComplete}
                />
            )}

            {/* FOOTER */}

            <p className="text-center text-xs text-gray-500">
                Select a Polaroid to edit its photo. Select a sticker
                to move, resize or rotate it.
            </p>
        </section>
    );
}
