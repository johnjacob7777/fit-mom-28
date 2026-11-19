// =============================================================
// API: Verify Payment — checks if the Stripe session was paid
// =============================================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe secret key is not configured in .env.local" },
        { status: 500 }
      );
    }
    const stripe = new Stripe(stripeKey);

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // Ask Stripe if this session was actually paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: session.payment_status === "paid",
      customerEmail: session.customer_email,
    });
  } catch (error: unknown) {
    console.error("Verification error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
