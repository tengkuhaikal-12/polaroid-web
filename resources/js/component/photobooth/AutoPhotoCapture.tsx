
import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, RotateCcw, X } from 'lucide-react';

interface AutoPhotoCaptureProps {
    slotCount: number;
    onComplete: (photos: string[]) => void;
    onClose: () => void;
}

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function AutoPhotoCapture({
    slotCount,
    onComplete,
    onClose,
}: AutoPhotoCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cancelledRef = useRef(false);
    const runningRef = useRef(false);

    const [cameraReady, setCameraReady] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState('');

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    useEffect(() => {
        let disposed = false;

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });

                if (disposed) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }

                if (!disposed) {
                    setCameraReady(true);
                }
            } catch {
                if (!disposed) {
                    setError(
                        'Unable to access the camera. Please allow camera permission and try again.',
                    );
                }
            }
        }

        void startCamera();

        return () => {
            disposed = true;
            cancelledRef.current = true;
            stopCamera();
        };
    }, []);

    const takeSnapshot = (): string | null => {
        const video = videoRef.current;

        if (!video || video.readyState < 2) {
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');

        if (!context) {
            return null;
        }

        // Mirror the front-camera image to match the preview.
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.92);
    };

    const startSession = async () => {
        if (runningRef.current || !cameraReady || slotCount < 1) return;

        runningRef.current = true;
        cancelledRef.current = false;
        setIsCapturing(true);
        setError('');

        const capturedPhotos: string[] = [];

        try {
            for (let i = 0; i < slotCount; i++) {
                if (cancelledRef.current) return;

                // Three-second countdown for each slot.
                for (let seconds = 3; seconds >= 1; seconds--) {
                    if (cancelledRef.current) return;

                    setCountdown(seconds);
                    await delay(1000);
                }

                if (cancelledRef.current) return;

                setCountdown(null);

                const photo = takeSnapshot();

                if (!photo) {
                    throw new Error(
                        'The camera is not ready. Please try capturing again.',
                    );
                }

                capturedPhotos.push(photo);
                setPhotos([...capturedPhotos]);

                // Brief pause before the next photo.
                if (i < slotCount - 1) {
                    await delay(800);
                }
            }

            if (!cancelledRef.current) {
                stopCamera();
                onComplete(capturedPhotos);
            }
        } catch (err) {
            if (!cancelledRef.current) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Something went wrong while taking photos.',
                );
            }
        } finally {
            runningRef.current = false;
            setIsCapturing(false);
            setCountdown(null);
        }
    };

    const retakeAll = async () => {
        if (isCapturing) return;

        setPhotos([]);
        setError('');

        // Camera stays active until the session is completed.
        await startSession();
    };

    const close = () => {
        cancelledRef.current = true;
        stopCamera();
        onClose();
    };

    const finished = photos.length === slotCount && slotCount > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-[#31513A] bg-[#FFF9EF] shadow-[8px_8px_0_#31513A]">
                <div className="flex items-center justify-between border-b-2 border-[#31513A] p-5">
                    <div>
                        <h2 className="text-xl font-black text-[#31513A]">
                            Photobooth
                        </h2>
                        <p className="text-sm text-[#31513A]/70">
                            {finished
                                ? 'All photos captured!'
                                : `Photo ${photos.length + 1} of ${slotCount}`}
                        </p>
                    </div>

                    <button
                        onClick={close}
                        className="rounded-full border-2 border-[#31513A] p-2 text-[#31513A]"
                        aria-label="Close camera"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-[1fr_200px]">
                    <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full scale-x-[-1] object-cover"
                        />

                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                <span className="text-8xl font-black text-white drop-shadow-lg">
                                    {countdown}
                                </span>
                            </div>
                        )}

                        {finished && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
                                <CheckCircle2 size={48} />
                                <p className="text-xl font-black">
                                    Session complete!
                                </p>
                            </div>
                        )}

                        {!cameraReady && !error && (
                            <p className="absolute text-white">
                                Starting camera...
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-[#31513A]">
                            Your photos
                        </h3>

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-2">
                            {Array.from({ length: slotCount }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square overflow-hidden rounded-lg border-2 border-[#31513A]/30 bg-white"
                                    >
                                        {photos[index] ? (
                                            <img
                                                src={photos[index]}
                                                alt={`Captured photo ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm font-bold text-[#31513A]/40">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>
                                ),
                            )}
                        </div>

                        <p className="text-sm text-[#31513A]/70">
                            {photos.length} / {slotCount} photos taken
                        </p>

                        <div className="h-2 overflow-hidden rounded-full bg-[#31513A]/15">
                            <div
                                className="h-full rounded-full bg-[#79AE6F] transition-all"
                                style={{
                                    width: `${slotCount > 0 ? (photos.length / slotCount) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="mx-5 mb-3 rounded-xl bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-3 border-t-2 border-[#31513A]/15 p-5">
                    {finished ? (
                        <>
                            <button
                                onClick={retakeAll}
                                disabled={isCapturing}
                                className="flex items-center gap-2 rounded-xl border-2 border-[#31513A] px-4 py-3 font-bold text-[#31513A] disabled:opacity-50"
                            >
                                <RotateCcw size={18} />
                                Retake all
                            </button>

                            <button
                                onClick={() => onComplete(photos)}
                                className="flex items-center gap-2 rounded-xl border-2 border-[#31513A] bg-[#79AE6F] px-5 py-3 font-black text-[#183522] shadow-[3px_3px_0_#31513A]"
                            >
                                <CheckCircle2 size={18} />
                                Use these photos
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={startSession}
                            disabled={!cameraReady || isCapturing || slotCount < 1}
                            className="flex items-center gap-2 rounded-xl border-2 border-[#31513A] bg-[#79AE6F] px-5 py-3 font-black text-[#183522] shadow-[3px_3px_0_#31513A] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Camera size={18} />
                            {isCapturing
                                ? 'Capturing photos...'
                                : 'Start auto shoot'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
