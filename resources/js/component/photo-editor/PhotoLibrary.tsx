
import { ImagePlus, Trash2, Upload } from 'lucide-react';

import type {
    ChangeEvent,
    DragEvent,
} from 'react';

import type { PhotoAsset } from './types';

interface Props {
    photos: PhotoAsset[];
    selectedPhotoId: string | null;

    onUpload: (files: FileList | null) => void;
    onSelect: (photo: PhotoAsset) => void;
    onRemove: (photoId: string) => void;
}

export default function PhotoLibrary({
    photos,
    selectedPhotoId,
    onUpload,
    onSelect,
    onRemove,
}: Props) {
    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        onUpload(event.target.files);

        // Allow the same file to be selected again later.
        event.target.value = '';
    }

    function handleDragStart(
        event: DragEvent<HTMLButtonElement>,
        photo: PhotoAsset,
    ) {
        event.dataTransfer.setData(
            'text/photo-id',
            photo.id,
        );

        event.dataTransfer.effectAllowed = 'copy';
    }

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-black text-[#31513A]">
                        Your photos
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        {photos.length} uploaded
                    </p>
                </div>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#9FCB98] bg-[#F5F8F1] px-4 py-5 text-sm font-bold text-[#31513A] transition hover:bg-[#EBF3E6]">
                <Upload size={18} />
                Upload photos

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            <p className="text-[11px] leading-relaxed text-gray-500">
                JPG, PNG or WebP. Drag a thumbnail onto a photo
                frame to place it.
            </p>

            {photos.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-6 text-center">
                    <ImagePlus
                        className="mx-auto text-gray-400"
                        size={28}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        Your uploaded photos will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo) => {
                        const active =
                            selectedPhotoId === photo.id;

                        return (
                            <div
                                key={photo.id}
                                className={`group relative overflow-hidden rounded-xl border-2 ${active
                                        ? 'border-[#31513A]'
                                        : 'border-gray-200'
                                    }`}
                            >
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(event) => {
                                        handleDragStart(event, photo);
                                    }}
                                    onClick={() => onSelect(photo)}
                                    className="block w-full text-left"
                                    title="Select or drag this photo to a frame"
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.name}
                                        draggable={false}
                                        className="aspect-square w-full object-cover"
                                    />

                                    <span className="block truncate px-2 py-2 text-[11px] font-medium text-gray-700">
                                        {photo.name}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onRemove(photo.id);
                                    }}
                                    aria-label={`Remove ${photo.name}`}
                                    className="absolute right-1 top-1 rounded-lg bg-white/95 p-1.5 text-red-600 shadow hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
