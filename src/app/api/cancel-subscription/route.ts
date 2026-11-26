// =============================================================
// API: Cancel Subscription — ends Stripe recurring billing cleanly
// =============================================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const { stripeSubscriptionId, stripeSessionId } = await request.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // If demo mode or no live Stripe subscription ID, return cleanly
    if (
      !stripeKey ||
      (!stripeSubscriptionId &&
        (!stripeSessionId || String(stripeSessionId).startsWith("demo_")))
    ) {
      return NextResponse.json({ cancelled: true, mode: "local" });
    }

    const stripe = new Stripe(stripeKey);
    let subId = stripeSubscriptionId as string | undefined;

    if (!subId && stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
    }

    if (subId) {
      await stripe.subscriptions.cancel(subId);
    }

    return NextResponse.json({ cancelled: true, mode: "stripe" });
  } catch (error: unknown) {
    console.error("Cancel subscription error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to cancel subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
