import { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';

import { usePhotoboothStore } from '../../stores/usePhotoboothStore';
import { exportPhotostrip } from '../../lib/studio/exportPhotostrip';

export default function ExportButton() {
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    const handleExport = async () => {
        if (exporting) return;

        setExporting(true);
        setError('');

        try {
            // Snapshot the current state so the export is consistent.
            const state = usePhotoboothStore.getState();
            const blob = await exportPhotostrip(state, 3);

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'my-photostrip.png';

            document.body.appendChild(link);
            link.click();
            link.remove();

            // Delay revocation to allow the browser to start the download.
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error('Photostrip export failed:', err);

            setError(
                'Export failed. Check that your photos and stickers can be loaded.',
            );
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                disabled={exporting}
                onClick={handleExport}
                className="flex items-center gap-2 rounded-xl
                    bg-[#31513A] px-5 py-3 font-bold text-white
                    transition hover:bg-[#25412D]
                    disabled:cursor-not-allowed disabled:opacity-60"
            >
                {exporting ? (
                    <LoaderCircle className="animate-spin" size={18} />
                ) : (
                    <Download size={18} />
                )}

                {exporting ? 'Preparing PNG...' : 'Download PNG'}
            </button>

            {error && (
                <p role="alert" className="max-w-xs text-right text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}