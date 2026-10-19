import React, { useRef, useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Camera, RotateCcw, Check, ArrowLeft, Wand2 } from 'lucide-react';

interface CaptureSelfieProps {
    isHome: boolean;
}

export default function CaptureSelfie({ isHome }: CaptureSelfieProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    // Add ratio state ('4:3' default, or '1:1', '16:9')
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');

    // Map ratio choices to Tailwind height classes
    const heightClasses: Record<string, string> = {
        '1:1': 'h-[360px] md:h-[420px]',   // Square
        '4:3': 'h-[400px] md:h-[480px]',   // Standard photo
        '16:9': 'h-[280px] md:h-[340px]',  // Widescreen
    };

    const { data, setData, processing } = useForm({
        image: '' as string | null,
    });

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("Unable to access the camera. Please check your browser permissions!");
        }
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (video?.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
        setIsStreaming(false);
    };

    useEffect(() => {
        // Stop camera when navigating to another Inertia route
        const removeListener = router.on('navigate', () => {
            stopCamera();
        });

        // Stop camera when component unmounts
        return () => {
            removeListener();
            stopCamera();
        };
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Play the shutter sound effect 📸
        const shutter = new Audio('/audio/camera-shutter.wav');
        shutter.volume = 0.5;
        shutter.play().catch((err) => {
            console.log("Audio playback prevented:", err);
        });

        const width = videoRef.current.videoWidth || 640;
        const height = videoRef.current.videoHeight || 480;
        const canvas = canvasRef.current;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setData('image', dataUrl);
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setData('image', null);
        startCamera();
    };

    // Proceed to custom template canvas editor page
    const handleUsePhoto = (e: React.FormEvent) => {
        e.preventDefault();
        if (!capturedImage) return;

        // Save image temporarily for the template editor
        sessionStorage.setItem('captured_selfie', capturedImage);

        stopCamera();
        router.visit('/photo-studio');
    };

    return (
        <>
            <Head title="Capture Your Selfie" />

            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A]">
                <main className="mx-auto max-w-xl w-full p-6 flex-1 flex flex-col items-center justify-center min-h-screen">

                    <div className="relative w-full flex items-center justify-center mb-4">
                        {!isHome && (
                            <Link
                                href="/"
                                className="absolute left-0 rotate-[-6deg] rounded-full border-2 border-[#31513A] bg-[#FF9EAD] p-3 font-black shadow-[4px_4px_0_#31513A] transition hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center gap-2"
                            >
                                <ArrowLeft />
                            </Link>
                        )}
                        <div className="text-center">
                            <h3 className="mb-3 inline-block rounded-full border-2 border-[#31513A] bg-[#FFF0A8] px-5 py-1 font-black text-sm shadow-[3px_3px_0_#31513A]">
                                ✨ snap your moment ✨
                            </h3>
                            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                                take a <span className="text-[#F26B82]">selfie</span>
                            </h1>
                        </div>
                    </div>

                    <div className="w-full rounded-[2.5rem] border-4 border-[#31513A] bg-white p-6 shadow-[8px_8px_0_#31513A]">

                        {!capturedImage ? (
                            <div className="flex flex-col items-center w-full">
                                {/* Ratio Selector Buttons */}
                                <div className="flex gap-2 mb-4 w-full justify-center">
                                    {['1:1', '4:3', '16:9'].map((ratio) => (
                                        <button
                                            key={ratio}
                                            type="button"
                                            onClick={() => setAspectRatio(ratio)}
                                            className={`px-4 py-1.5 rounded-full border-2 border-[#31513A] font-black text-sm transition ${aspectRatio === ratio
                                                    ? 'bg-[#F26B82] text-white shadow-[2px_2px_0_#31513A] translate-x-0.5 translate-y-0.5'
                                                    : 'bg-[#FFF0A8] text-[#31513A] shadow-[3px_3px_0_#31513A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                                                }`}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>

                                {/* Camera Feed Container with Dynamic Height */}
                                <div className={`relative w-full ${heightClasses[aspectRatio]} bg-black rounded-[1.5rem] border-2 border-[#31513A] overflow-hidden flex items-center justify-center mb-6 transition-all duration-300`}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform -scale-x-100"
                                    />
                                    {!isStreaming && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF8EA] text-[#31513A] p-6 text-center">
                                            <Camera className="w-16 h-16 mb-2 text-[#F26B82]" />
                                            <p className="font-black text-lg">Camera is currently off</p>
                                            <p className="text-sm font-semibold text-[#55725D] mt-1">Click below to give access and start snapping!</p>
                                        </div>
                                    )}
                                </div>

                                {!isStreaming ? (
                                    <button
                                        onClick={startCamera}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#CDE8B5] py-4 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Camera className="w-6 h-6" /> Open Camera
                                    </button>
                                ) : (
                                    <button
                                        onClick={capturePhoto}
                                        className="w-full rounded-full border-2 border-[#31513A] bg-[#F26B82] text-white py-4 font-black shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Camera className="w-6 h-6" /> Capture Photo 🍓
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleUsePhoto} className="flex flex-col items-center space-y-5 w-full">
                                <div className={`w-full ${heightClasses[aspectRatio]} rounded-[1.5rem] border-2 border-[#31513A] overflow-hidden bg-black p-2 shadow-sm transition-all duration-300`}>
                                    <img
                                        src={capturedImage}
                                        alt="Captured Selfie Preview"
                                        className="w-full h-full object-cover rounded-[1rem]"
                                    />
                                </div>

                                <p className="font-black text-center text-lg">Looking cute! Choose a frame layout ♡</p>

                                <div className="flex gap-4 w-full">
                                    <button
                                        type="button"
                                        onClick={retakePhoto}
                                        className="flex-1 rounded-full border-2 border-[#31513A] bg-[#FFF0A8] py-3 font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Retake
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] py-3 font-black shadow-[3px_3px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Wand2 className="w-5 h-5" /> Select Templates
                                    </button>
                                </div>
                            </form>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </main>
            </div>
        </>
    );
}