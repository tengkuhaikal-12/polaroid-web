
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Camera,
    Check,
    RefreshCw,
    RotateCcw,
    X,
} from 'lucide-react';

interface CameraCaptureProps {
    onCapture: (photo: {
        id: string;
        src: string;
        name: string;
    }) => void;
    onClose: () => void;
}

export default function CameraCapture({
    onCapture,
    onClose,
}: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [countdown, setCountdown] = useState<number | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [cameraFacing, setCameraFacing] =
        useState<'user' | 'environment'>('user');
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(true);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        stopCamera();
        setStarting(true);
        setError('');
        setCountdown(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: { ideal: cameraFacing },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch {
            setError(
                'Unable to access the camera. Check your browser permissions and try again.',
            );
        } finally {
            setStarting(false);
        }
    }, [cameraFacing, stopCamera]);

    useEffect(() => {
        void startCamera();

        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const takePicture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (
            !video ||
            !canvas ||
            !video.videoWidth ||
            !video.videoHeight
        ) {
            setError('The camera is not ready yet.');
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');

        if (!context) {
            setError('Unable to capture the photo.');
            return;
        }

        // Mirror the front-camera picture to match the preview.
        if (cameraFacing === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        setPreview(canvas.toDataURL('image/jpeg', 0.95));
        setCountdown(null);
    };

    const startCountdown = () => {
        if (!streamRef.current || countdown !== null) return;

        setPreview(null);
        setError('');
        setCountdown(3);

        let remaining = 3;

        timerRef.current = window.setInterval(() => {
            remaining -= 1;

            if (remaining > 0) {
                setCountdown(remaining);
            } else {
                if (timerRef.current !== null) {
                    window.clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                setCountdown(null);
                takePicture();
            }
        }, 1000);
    };

    const acceptPicture = () => {
        if (!preview) return;

        onCapture({
            id: crypto.randomUUID(),
            src: preview,
            name: `photobooth-${Date.now()}.jpg`,
        });

        setPreview(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center
            justify-center bg-black/80 p-4">

            <div className="w-full max-w-lg overflow-hidden
                rounded-2xl bg-white">

                <header className="flex items-center justify-between
                    border-b p-4">
                    <h2 className="font-bold text-[#31513A]">
                        Take a picture
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close camera"
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="relative aspect-[4/3] overflow-hidden
                    bg-black">

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`h-full w-full object-cover
                            ${cameraFacing === 'user' ? '-scale-x-100' : ''}`}
                        style={{ visibility: preview ? 'hidden' : 'visible' }}
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Captured photo preview"
                            className="absolute inset-0 h-full w-full object-contain"
                        />
                    )}

                    {countdown !== null && (
                        <div className="absolute inset-0 flex
                            items-center justify-center bg-black/20">
                            <span className="text-8xl font-black
                                text-white drop-shadow-lg">
                                {countdown}
                            </span>
                        </div>
                    )}

                    {starting && (
                        <div className="absolute inset-0 flex
                            items-center justify-center text-white">
                            Starting camera...
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                <div className="space-y-4 p-4">
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {!preview ? (
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                disabled={starting || countdown !== null}
                                onClick={() =>
                                    setCameraFacing((current) =>
                                        current === 'user'
                                            ? 'environment'
                                            : 'user',
                                    )
                                }
                                className="rounded-full border p-3
                                    disabled:opacity-50"
                                aria-label="Switch camera"
                            >
                                <RefreshCw size={20} />
                            </button>

                            <button
                                type="button"
                                disabled={starting || countdown !== null || !!error}
                                onClick={startCountdown}
                                className="flex items-center gap-2 rounded-full
                                    bg-[#31513A] px-7 py-3 font-bold text-white
                                    disabled:opacity-50"
                            >
                                <Camera size={20} />
                                {countdown !== null
                                    ? 'Get ready...'
                                    : 'Start countdown'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="flex items-center gap-2 rounded-xl
                                    border px-5 py-3"
                            >
                                <RotateCcw size={18} />
                                Retake
                            </button>

                            <button
                                type="button"
                                onClick={acceptPicture}
                                className="flex items-center gap-2 rounded-xl
                                    bg-[#31513A] px-5 py-3 font-bold text-white"
                            >
                                <Check size={18} />
                                Use photo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
