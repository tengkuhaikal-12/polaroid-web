import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function VerifyEmail() {
    const { flash } = usePage<{ flash: { status?: string } }>().props;

    const { post, processing } = useForm();

    const [clicked, setClicked] = useState(false)

    return (
        <>
            <Head title="Verify Email" />

            <div className="flex min-h-screen items-center justify-center p-6 bg-[#FFF8EA]">
                <div className="w-full max-w-md rounded-2xl border p-8 text-center">


                    <h1 className="mb-3 text-2xl font-bold text-center">
                        Verify your email
                    </h1>

                    <p className="mb-5">
                        We sent a verification link to your email address.
                        Please check your inbox and click the link.
                    </p>

                    {flash?.status === 'verification-link-sent' && (
                        <p className="py-2 rounded-xl bg-green-100 border">
                            A verification link has been sent.
                            <br />
                            Please check your inbox.
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={processing}
                        onClick={() =>
                            post('/email/verification-notification', {
                                onSuccess: () => setClicked(true),
                            })
                        }
                        className="mt-2 flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#31513A] bg-[#CDE8B5] px-3 py-2 font-semibold shadow-[4px_4px_0_#31513A] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#F26B82] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing
                            ? 'Sending...'
                            : clicked
                                ? 'Resend verification email'
                                : 'Send verification email'}
                    </button>
                </div>
            </div>
        </>
    );
}