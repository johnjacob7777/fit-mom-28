// =============================================================
// API: Verify Payment — checks if the Stripe session completed
// =============================================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe secret key is not configured." },
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaidOrTrial =
      session.status === "complete" &&
      (session.payment_status === "paid" ||
        session.payment_status === "no_payment_required");

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id || null;

    return NextResponse.json({
      paid: isPaidOrTrial,
      customerEmail: session.customer_email,
      subscriptionId,
    });
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
