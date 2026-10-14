import React from 'react';
import {
    X,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Info,
    ArrowRight,
} from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'confirm' | 'info';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const themes = {
    success: {
        bg: 'bg-[#E6F1DB]',
        accent: 'bg-[#C5DDB1]',
        button: 'bg-[#B5D39F] hover:bg-[#A5C68C]',
        iconColor: 'text-[#426044]',
        label: 'ALL GOOD!',
        Icon: CheckCircle2,
    },
    error: {
        bg: 'bg-[#FBE3E8]',
        accent: 'bg-[#F5BCCB]',
        button: 'bg-[#F3B0C1] hover:bg-[#EB9DB1]',
        iconColor: 'text-[#8C4055]',
        label: 'OOPS!',
        Icon: AlertTriangle,
    },
    confirm: {
        bg: 'bg-[#FFF3C9]',
        accent: 'bg-[#FFE49A]',
        button: 'bg-[#F5B8C9] hover:bg-[#EDA1B6]',
        iconColor: 'text-[#795044]',
        label: 'ONE MORE THING',
        Icon: Sparkles,
    },
    info: {
        bg: 'bg-[#FFF7EE]',
        accent: 'bg-[#DCEBCF]',
        button: 'bg-[#C5DDB1] hover:bg-[#B4D19D]',
        iconColor: 'text-[#426044]',
        label: 'A LITTLE NOTE',
        Icon: Info,
    },
};

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    onConfirm,
    confirmText = 'Yes, continue',
    cancelText = 'Maybe later',
}: ModalProps) {
    if (!isOpen) return null;

    const theme = themes[type];
    const Icon = theme.Icon;
    const isConfirm = type === 'confirm';

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#263629]/45 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-message"
                className={`relative w-full max-w-md overflow-hidden rounded-[2rem] border-[3px] border-[#426044] ${theme.bg} p-6 sm:p-8 shadow-[8px_8px_0_#426044] animate-in zoom-in-95 slide-in-from-bottom-2 duration-200`}
                onClick={(event) => event.stopPropagation()}
            >
                {/* Decorative corner accents */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full border-[10px] border-white/40"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 top-12 text-[#426044]/20"
                >
                    <Sparkles size={30} />
                </div>

                {/* Top bar */}
                <div className="relative flex items-center justify-between">
                    <span
                        className="rounded-full border-2 border-[#426044]/20 bg-white/70 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#426044]"
                    >
                        {theme.label}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-full border-2 border-[#426044] bg-white p-2 text-[#426044] shadow-[2px_2px_0_#426044] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#426044]"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Icon */}
                <div className="relative mb-5 mt-7 flex justify-center">
                    <div
                        className={`flex h-[84px] w-[84px] items-center justify-center rounded-[28px] border-[3px] border-[#426044] ${theme.accent} shadow-[4px_4px_0_#426044] rotate-[-4deg] transition-transform duration-200 hover:rotate-0`}
                    >
                        <Icon
                            size={38}
                            strokeWidth={2.2}
                            className={theme.iconColor}
                        />
                    </div>

                    <Sparkles
                        aria-hidden="true"
                        size={19}
                        className="absolute right-[27%] top-0 text-[#D28B9C]"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[28%] text-xl text-[#D28B9C]"
                    >
                        ✳
                    </span>
                </div>

                {/* Heading and message */}
                <div className="relative text-center">
                    <h2
                        id="modal-title"
                        className="text-2xl font-black leading-tight tracking-tight text-[#304A34] sm:text-3xl"
                    >
                        {title}
                    </h2>

                    <div className="mx-auto my-4 flex w-fit items-center gap-2">
                        <span className="h-1.5 w-6 rounded-full bg-[#C5DDB1]" />
                        <span className="h-1.5 w-6 rounded-full bg-[#F5B8C9]" />
                        <span className="h-1.5 w-6 rounded-full bg-[#FFE49A]" />
                    </div>

                    <p
                        id="modal-message"
                        className="mx-auto max-w-sm text-sm font-medium leading-7 text-[#536653] sm:text-base"
                    >
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="relative mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                    {isConfirm && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border-2 border-[#426044] bg-white/80 px-5 py-3 text-sm font-extrabold text-[#426044] transition-all duration-150 hover:bg-white active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426044]"
                        >
                            {cancelText}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={isConfirm ? handleConfirm : onClose}
                        className={`group flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#426044] ${theme.button} px-5 py-3 text-sm font-black text-[#304A34] shadow-[3px_3px_0_#426044] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#426044]`}
                    >
                        {isConfirm ? confirmText : 'Got it!'}
                        {isConfirm ? (
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        ) : (
                            <Sparkles size={15} />
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}