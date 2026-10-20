import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from '@inertiajs/react';

import CustomizerPanel from '@/component/studio/CustomizerPanel';
import StudioCanvas from '@/component/studio/StudioCanvas';
import ExportButton from '@/component/studio/ExportButton';
import { usePhotoboothStore } from '@/stores/usePhotoboothStore';

export default function Studio() {
    const clearStickers = usePhotoboothStore(
        (state) => state.clearStickers,
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
    const selectSticker = usePhotoboothStore(
        (state) => state.selectSticker,
    );

    const resetDesign = () => {
        const confirmed = window.confirm(
            'Reset your design? Your uploaded photos will be preserved.',
        );

        if (!confirmed) return;

        clearStickers();
        setTemplate({
            id: 'strip-4',
            name: '4 Shots',
            width: 600,
            height: 1800,
            backgroundColor: '#FFF4E8',
            frameColor: '#FFFFFF',
            slots: Array.from({ length: 4 }, (_, i) => ({
                id: `slot-${i + 1}`,
                x: 5,
                y: 5 + i * 23,
                width: 90,
                height: 20,
            })),
        });

        setBackgroundColor('#FFF4E8');
        setPattern('solid');
        setFilter('normal');
        selectSticker(null);
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#FAF8F5]">
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#E8DFD8] bg-white px-4 py-4 md:px-8">

                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="rounded-lg p-2 hover:bg-gray-100"
                        aria-label="Back to home"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="font-black text-[#31513A]">
                            Photobooth Studio
                        </h1>
                        <p className="text-xs text-gray-500">
                            Make something memorable.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={resetDesign}
                        className="flex items-center gap-2 rounded-lg
                            border border-gray-200 bg-white px-3 py-2
                            text-sm hover:bg-gray-50"
                    >
                        <RotateCcw size={16} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <ExportButton />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
                <CustomizerPanel />
                <StudioCanvas />
            </div>
        </main>
    );
}