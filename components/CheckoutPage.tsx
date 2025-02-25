'use client'
import { useState,useEffect } from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
// import convertToSubcurrency from "@/lib/convertToSubcurrency"

const CheckoutPage = ({ amount }:{amount:number}) => {
const stripe = useStripe();
const elements = useElements();


const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [succeeded] = useState(false);
const [clientSecret, setClientSecret] = useState('');

console.log(amount ,"amount  is here in client side")
useEffect(() => {
  fetch('/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: amount})
  })
    .then(res => res.json())
    .then(data => {
      setClientSecret(data.clientSecret);
    });


  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const {error:submitError} = await elements.submit();
    if(submitError){
      setError(submitError.message || "An error occurred");
      setLoading(false);
      return;
    }
    const {error} = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url:`http://localhost:3000/payment-success?amount=${amount}`,
      }
    });
    if(error){
      setError(error.message || "An error occurred");
      return;
    }else{
      setLoading(false)
    }
  }
  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center ">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }
    return(
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md ">
        {clientSecret && <PaymentElement />}
        {error && <div>{error}</div>}
        {succeeded && <div>Payment succeeded</div>}
        <button
          disabled={!stripe || loading }
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse">
          {!loading ? `Pay $${amount}` : "Processing..."}
        </button>
      </form>
    )
  }

export default CheckoutPage