
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { Head } from '@inertiajs/react';

import {
    ArrowLeft,
    Image as ImageIcon,
    Sparkles,
} from 'lucide-react';

import Konva from 'konva';

import PhotoCanvas from '@/component/photo-editor/PhotoCanvas';
import PhotoLibrary from '@/component/photo-editor/PhotoLibrary';
import StudioToolbar from '@/component/photo-editor/StudioToolbar';
import TemplateGallery from '@/component/photo-editor/TemplateGallery';

import { PHOTO_TEMPLATES } from '@/component/photo-editor/templates';

import type {
    PhotoAsset,
    PhotoPlacement,
    PhotoPlacements,
    PhotoTemplate,
} from '@/component/photo-editor/types';

export default function PhotoEditor() {
    const stageRef = useRef<Konva.Stage | null>(null);

    const canvasContainerRef = useRef<HTMLDivElement | null>(null);

    const photosRef = useRef<PhotoAsset[]>([]);

    const [template, setTemplate] = useState<PhotoTemplate>(
        PHOTO_TEMPLATES[0],
    );

    const [photos, setPhotos] = useState<PhotoAsset[]>([]);

    const [placements, setPlacements] = useState<PhotoPlacements>({});

    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(
        null,
    );

    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
        PHOTO_TEMPLATES[0]?.slots[0]?.id ?? null,
    );

    const [exporting, setExporting] = useState(false);

    const [availableWidth, setAvailableWidth] = useState(600);

    // Keep the photo ref synchronized with the current photo list.
    useEffect(() => {
        photosRef.current = photos;
    }, [photos]);

    // Import a selfie captured on the previous page.
    useEffect(() => {
        const capturedSelfie = sessionStorage.getItem('captured_selfie');

        if (!capturedSelfie) return;

        const selfie: PhotoAsset = {
            id: crypto.randomUUID(),
            name: 'My Selfie.jpg',
            url: capturedSelfie,
        };

        const updatedPhotos = [
            ...photosRef.current,
            selfie,
        ];

        photosRef.current = updatedPhotos;

        setPhotos(updatedPhotos);
        setSelectedPhotoId(selfie.id);

        const firstSlot = template.slots[0];

        if (firstSlot) {
            setPlacements((current) => ({
                ...current,
                [firstSlot.id]: {
                    photoId: selfie.id,
                    offsetX: 0,
                    offsetY: 0,
                    zoom: 1,
                },
            }));

            setSelectedSlotId(firstSlot.id);
        }

        sessionStorage.removeItem('captured_selfie');
    }, []); // Intentionally run only when the editor mounts.

    // Release uploaded blob URLs when the editor unmounts.
    // Selfie data URLs must not be revoked.
    useEffect(() => {
        return () => {
            photosRef.current.forEach((photo) => {
                if (photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });

            photosRef.current = [];
        };
    }, []);

    // Observe the available canvas width.
    useEffect(() => {
        const container = canvasContainerRef.current;

        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];

            if (entry) {
                setAvailableWidth(entry.contentRect.width);
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    // Fit the canvas to the available width without enlarging it.
    const viewScale = Math.max(
        0.1,
        Math.min(1, availableWidth / template.width),
    );

    const selectedPlacement = selectedSlotId
        ? placements[selectedSlotId]
        : undefined;

    const selectedZoom = selectedPlacement?.zoom ?? 1;

    const selectedPhoto = useMemo(
        () => photos.find((photo) => photo.id === selectedPhotoId),
        [photos, selectedPhotoId],
    );

    // Upload JPEG, PNG, and WebP images.
    const uploadPhotos = useCallback((files: FileList | null) => {
        if (!files) return;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        const newPhotos: PhotoAsset[] = [];

        for (const file of Array.from(files)) {
            if (!allowedTypes.includes(file.type)) {
                window.alert(
                    `${file.name} is not supported. Please use JPEG, PNG, or WebP.`,
                );

                continue;
            }

            if (file.size > 15 * 1024 * 1024) {
                window.alert(
                    `${file.name} exceeds the 15 MB limit.`,
                );

                continue;
            }

            newPhotos.push({
                id: crypto.randomUUID(),
                name: file.name,
                url: URL.createObjectURL(file),
            });
        }

        if (newPhotos.length === 0) return;

        const updatedPhotos = [
            ...photosRef.current,
            ...newPhotos,
        ];

        photosRef.current = updatedPhotos;

        setPhotos(updatedPhotos);
        setSelectedPhotoId(newPhotos[0].id);
    }, []);

    // Remove a photo and clear every slot using it.
    const removePhoto = useCallback((photoId: string) => {
        const photoToRemove = photosRef.current.find(
            (photo) => photo.id === photoId,
        );

        if (photoToRemove?.url.startsWith('blob:')) {
            URL.revokeObjectURL(photoToRemove.url);
        }

        const remainingPhotos = photosRef.current.filter(
            (photo) => photo.id !== photoId,
        );

        photosRef.current = remainingPhotos;

        setPhotos(remainingPhotos);


        setPlacements((current) => {
            const next: PhotoPlacements = {};

            Object.entries(current).forEach(([slotId, placement]) => {
                if (placement && placement.photoId !== photoId) {
                    next[slotId] = placement;
                }
            });

            return next;
        });


        setSelectedPhotoId((current) => {
            if (current !== photoId) return current;

            return remainingPhotos[0]?.id ?? null;
        });
    }, []);

    // Assign a selected photo to a frame.
    const assignPhoto = useCallback(
        (slotId: string, photoId: string) => {
            const photoExists = photosRef.current.some(
                (photo) => photo.id === photoId,
            );

            if (!photoExists) return;

            setPlacements((current) => ({
                ...current,
                [slotId]: {
                    photoId,
                    offsetX: 0,
                    offsetY: 0,
                    zoom: 1,
                },
            }));

            setSelectedSlotId(slotId);
            setSelectedPhotoId(photoId);
        },
        [],
    );

    // Update image position or zoom within a frame.
    const updatePlacement = useCallback(
        (slotId: string, placement: PhotoPlacement) => {
            setPlacements((current) => ({
                ...current,
                [slotId]: placement,
            }));
        },
        [],
    );

    // Select a template and clear the previous template's placements.
    const chooseTemplate = useCallback(
        (nextTemplate: PhotoTemplate) => {
            setTemplate(nextTemplate);

            setSelectedSlotId(
                nextTemplate.slots[0]?.id ?? null,
            );

            setPlacements({});
        },
        [],
    );

    // Select a frame. If a photo is selected, assign it to that frame.
    const handleSlotSelect = useCallback(
        (slotId: string) => {
            setSelectedSlotId(slotId);

            if (selectedPhotoId) {
                assignPhoto(slotId, selectedPhotoId);
            }
        },
        [selectedPhotoId, assignPhoto],
    );

    // Reset the selected frame's image positioning.
    const resetSelectedPhoto = useCallback(() => {
        if (!selectedSlotId || !selectedPlacement) return;

        setPlacements((current) => {
            const placement = current[selectedSlotId];

            if (!placement) return current;

            return {
                ...current,
                [selectedSlotId]: {
                    ...placement,
                    offsetX: 0,
                    offsetY: 0,
                    zoom: 1,
                },
            };
        });
    }, [selectedSlotId, selectedPlacement]);

    // Update zoom for the currently selected frame.
    const changeZoom = useCallback(
        (zoom: number) => {
            if (!selectedSlotId || !selectedPlacement) return;

            updatePlacement(selectedSlotId, {
                ...selectedPlacement,
                zoom,
            });
        },
        [selectedSlotId, selectedPlacement, updatePlacement],
    );

    // Export the canvas as a high-resolution PNG.
    const exportDesign = useCallback(() => {
        const stage = stageRef.current;

        if (!stage) {
            window.alert('The canvas is not ready yet.');
            return;
        }

        setExporting(true);

        const outlines = stage.find('.frame-outline');

        try {
            // Hide editor selection outlines in the downloaded image.
            outlines.forEach((node) => node.hide());

            stage.batchDraw();

            const dataUrl = stage.toDataURL({
                pixelRatio: 3,
                mimeType: 'image/png',
            });

            const link = document.createElement('a');

            link.download = `${template.id}-design.png`;
            link.href = dataUrl;

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);

            window.alert(
                'Unable to export. Try using fewer or smaller photos.',
            );
        } finally {
            // Restore outlines in the editor after exporting.
            outlines.forEach((node) => node.show());

            stage.batchDraw();

            setExporting(false);
        }
    }, [template.id]);

    return (
        <>
            <Head title="Photo Studio" />

            <main className="min-h-screen bg-[#FFF8EA] text-[#31513A]">
                {/* Header */}
                <header className="sticky top-0 z-20 border-b-4 border-[#31513A] bg-[#FFF8EA]/95 backdrop-blur">
                    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 md:px-6">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                            <ArrowLeft size={15} />
                            Back
                        </a>

                        <div className="text-center">
                            <h1 className="text-lg font-black tracking-tight">
                                PolaroidKU Studio
                            </h1>

                            <p className="hidden text-[11px] font-semibold text-[#55725D] sm:block">
                                Make something worth keeping.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-2 text-[11px] font-black shadow-[3px_3px_0_#31513A]">
                            <Sparkles size={14} />
                            Editor
                        </span>
                    </div>
                </header>

                {/* Main editor layout */}
                <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 p-4 md:p-6 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
                    {/* Left sidebar: photo library */}
                    <aside className="space-y-6 rounded-[2rem] border-4 border-[#31513A] bg-white p-5">
                        <PhotoLibrary
                            photos={photos}
                            selectedPhotoId={selectedPhotoId}
                            onUpload={uploadPhotos}
                            onSelect={(photo) => {
                                setSelectedPhotoId(photo.id);
                            }}
                            onRemove={removePhoto}
                        />

                        {selectedPhoto && (
                            <p className="break-all text-xs font-semibold text-[#55725D]">
                                Selected: {selectedPhoto.name}
                            </p>
                        )}
                    </aside>

                    {/* Center: photo editor canvas */}
                    <section className="min-w-0 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-black">
                                    Your design
                                </h2>

                                <p className="mt-1 text-xs font-semibold text-[#55725D]">
                                    Drag a photo into a frame, then adjust
                                    its position.
                                </p>
                            </div>

                            <span className="rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#31513A]">
                                {template.width} × {template.height}
                            </span>
                        </div>

                        <StudioToolbar
                            zoom={selectedZoom}
                            onZoomChange={changeZoom}
                            onReset={resetSelectedPhoto}
                            onExport={exportDesign}
                            exporting={exporting}
                        />

                        <div
                            ref={canvasContainerRef}
                            className="flex min-h-[400px] items-center justify-center overflow-auto rounded-[2rem] border-4 border-[#31513A] bg-[#CDE8B5] p-4 md:p-8"
                        >
                            <div className="my-auto w-full">
                                <PhotoCanvas
                                    stageRef={stageRef}
                                    template={template}
                                    photos={photos}
                                    placements={placements}
                                    selectedSlotId={selectedSlotId}
                                    viewScale={viewScale}
                                    onSelectSlot={handleSlotSelect}
                                    onAssignPhoto={assignPhoto}
                                    onUpdatePlacement={updatePlacement}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-2xl border-2 border-[#31513A] bg-[#FFF0A8] p-4 text-xs font-semibold leading-relaxed text-[#31513A] shadow-[4px_4px_0_#31513A]">
                            <ImageIcon
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <p>
                                Unfilled frames appear as placeholders.
                                Select a photo and click a frame, or drag
                                the thumbnail directly onto a frame.
                            </p>
                        </div>
                    </section>

                    {/* Right sidebar: template gallery */}
                    <aside className="rounded-[2rem] border-4 border-[#31513A] bg-white p-5">
                        <TemplateGallery
                            templates={PHOTO_TEMPLATES}
                            selectedTemplateId={template.id}
                            onSelect={chooseTemplate}
                        />
                    </aside>
                </div>
            </main>
        </>
    );
}
