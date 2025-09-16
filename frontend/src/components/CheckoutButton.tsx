import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

type CheckoutButtonProps = {
    jwtToken: string;
};

export default function CheckoutButton({ jwtToken }: CheckoutButtonProps) {
    const handleClick = async () => {
        const stripe = await stripePromise;
        if (!stripe) {
            alert("Stripe failed to load. Try again later.");
            return;
        }

        try {
            console.log("TOKEN", jwtToken)
            const { data } = await axios.post(
                "http://localhost:8000/api/create-checkout-session/",
                {},
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );
            await stripe.redirectToCheckout({ sessionId: data.id });
        } catch (err) {
            console.error(err);
            alert("Failed to create checkout session.");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition"
        >
            Buy Course
        </button>
    );
}