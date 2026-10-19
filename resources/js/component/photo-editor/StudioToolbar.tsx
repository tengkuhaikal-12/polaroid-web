import {
    Download,
    RotateCcw,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';

interface Props {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    onReset: () => void;
    onExport: () => void;
    exporting: boolean;
}

export default function StudioToolbar({
    zoom,
    onZoomChange,
    onReset,
    onExport,
    exporting,
}: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border-4 border-[#31513A] bg-white p-4 shadow-[6px_6px_0_#31513A]">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        onZoomChange(
                            Math.max(0.5, +(zoom - 0.1).toFixed(2)),
                        )
                    }
                    disabled={zoom <= 0.5}
                    aria-label="Zoom out"
                    className="rounded-full border-2 border-[#31513A] bg-[#FFF8EA] p-2 text-[#31513A] shadow-[2px_2px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40"
                >
                    <ZoomOut size={17} />
                </button>

                <span className="min-w-14 text-center text-xs font-black text-[#31513A]">
                    {Math.round(zoom * 100)}%
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onZoomChange(
                            Math.min(3, +(zoom + 0.1).toFixed(2)),
                        )
                    }
                    disabled={zoom >= 3}
                    aria-label="Zoom in"
                    className="rounded-full border-2 border-[#31513A] bg-[#FFF8EA] p-2 text-[#31513A] shadow-[2px_2px_0_#31513A] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40"
                >
                    <ZoomIn size={17} />
                </button>
            </div>

            <button
                type="button"
                onClick={onReset}
                className="rounded-full inline-flex items-center gap-2 border-2 border-[#31513A] bg-[#CDE8B5] px-4 py-2 text-xs font-black text-[#31513A] shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
                <RotateCcw size={15} />
                Reset photo
            </button>

            <button
                type="button"
                onClick={onExport}
                disabled={exporting}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#31513A] bg-[#F26B82] px-5 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 md:text-sm"
            >
                <Download size={15} />
                {exporting ? 'Exporting…' : 'Download PNG'}
            </button>
        </div>
    );
}