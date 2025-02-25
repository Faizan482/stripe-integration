"use client";
import CheckoutPage from "@/components/CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export default function Home() {
  const amount = 400;
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
    } else {
      console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
    }
  }, []);

  if (!stripePromise) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-10 text-center text-white border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Harry</h1>
        <h2 className="text-2xl">
          has requested <span className="font-bold">${amount}</span>
        </h2>
      </div>
      <Elements stripe={stripePromise} options={{ mode: 'payment', amount: amount, currency: 'usd' }}>
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  );
}