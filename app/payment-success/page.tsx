'use client'

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');

  console.log("Amount in page.tsx component:", amount);

  return (
    <div className="max-w-6xl mx-auto p-10 text-center text-white border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <h1 className="text-4xl font-extrabold mb-2">Payment successful</h1>
      <h2 className="text-2xl">
        You paid <span className="font-bold">${amount}</span>
      </h2>
    </div>
  );
}