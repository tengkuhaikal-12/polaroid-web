
import { useEffect } from "react";

export default function PaymentPage() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://bcl.my/js/bc-encrypted-payment-embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            id="bcl-payment-form"
            data-url="https://tengkumohamadhaikalbintengkuabdullah.bcl.my/embed/form/digital-product"
        />
    );
}
