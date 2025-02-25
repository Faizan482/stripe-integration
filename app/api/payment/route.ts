
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

console.log("Stripe Secret Key is loaded:", stripeSecretKey ? "Present" : "Missing");

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}


export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    console.log("Amount in server side:", amount);
    if (!amount) {
      return NextResponse.json({ error: { message: "Amount is required" } }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal server error", error);
    return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}