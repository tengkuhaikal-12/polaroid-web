import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface StatusProps {
    status: 'success' | 'failed' | 'pending';
    order_number?: string;
    message?: string;
}

export default function Status({ status, order_number, message }: StatusProps) {
    const isSuccess = status === 'success';

    return (
        <>
            <Head title="Payment Status" />
            <div className="min-h-screen bg-[#FFF8EA] text-[#31513A] flex items-center justify-center px-6">
                <div className={`max-w-md w-full rounded-[2.5rem] border-4 border-[#31513A] ${isSuccess ? 'bg-[#CDE8B5]' : 'bg-[#FFD6DE]'} p-8 text-center shadow-[8px_8px_0_#31513A]`}>

                    <div className="flex justify-center mb-6">
                        {isSuccess ? (
                            <CheckCircle className="w-20 h-20 text-[#31513A]" />
                        ) : (
                            <XCircle className="w-20 h-20 text-[#F26B82]" />
                        )}
                    </div>

                    <h1 className="text-4xl font-black mb-3">
                        {isSuccess ? 'PAYMENT SUCCESS! ♡' : 'PAYMENT FAILED'}
                    </h1>

                    <p className="font-semibold text-[#55725D] mb-6">
                        {message || (isSuccess
                            ? `Your order (${order_number}) has been placed and is being processed with love!`
                            : 'Something went wrong with your transaction. Please try again.')}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#31513A] bg-[#FFF8EA] px-7 py-3 font-black shadow-[4px_4px_0_#31513A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition"
                    >
                        <ArrowLeft className="w-5 h-5" /> Return Home
                    </Link>
                </div>
            </div>
        </>
    );
}