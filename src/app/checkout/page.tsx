"use client";
// =============================================================
// CHECKOUT PAGE — Stripe payment before accessing dashboard
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getStripe } from "@/lib/stripe";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData?.isPaid) {
        router.push("/dashboard");
      } else if (!userData?.quizCompleted) {
        router.push("/onboarding");
      }
    }
  }, [user, userData, loading, router]);

  const handleCheckout = async () => {
    if (!user) return;
    setPaying(true);
    setError("");

    try {
      // 1. Ask our API to create a Stripe Checkout Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // 2. Redirect to Stripe's hosted checkout page
      const stripe = await getStripe();
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-warm-400 animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <Link href="/" className="text-peach-500 font-extrabold text-lg tracking-widest">
          FIT MOM 20
        </Link>

        <h1 className="text-2xl font-bold text-warm-800 mt-6 mb-2">
          Your plan is ready! 🎉
        </h1>
        <p className="text-warm-500 mb-8">
          One last step — unlock your personalized fitness plan.
        </p>

        {/* Plan summary card */}
        <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-sage-200 mb-6">
          <p className="text-warm-500 mb-2 font-semibold">Your Fit Mom 20 Plan</p>
          <p className="text-5xl font-extrabold text-warm-800 mb-1">
            ₹499<span className="text-lg font-normal text-warm-400">/month</span>
          </p>
          <p className="text-warm-400 text-sm mb-6">Cancel anytime • No lock-in</p>

          <ul className="text-left text-warm-600 space-y-2 mb-8 text-sm">
            {[
              "✅ Personalized 4-week workout plan",
              "✅ Weekly meal ideas for your diet",
              "✅ Daily progress & water tracking",
              "✅ Gentle mode if you need it",
              "✅ Fresh plan every month",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 rounded-lg p-3 mb-4 text-left">
              <p className="font-semibold">Payment Notice:</p>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => router.push("/checkout/success?session_id=demo_session_" + Date.now())}
                className="mt-2 bg-peach-500 hover:bg-peach-600 text-white font-bold py-1.5 px-3 rounded-lg text-xs"
              >
                Skip Stripe in Demo Mode →
              </button>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={paying}
            className="w-full bg-sage-400 hover:bg-sage-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            {paying ? "Redirecting to payment..." : "Pay ₹499 & Start →"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/checkout/success?session_id=demo_session_" + Date.now())}
            className="w-full mt-3 bg-peach-50 border border-peach-200 text-peach-600 hover:bg-peach-100 font-semibold text-sm py-2.5 rounded-xl transition-all"
          >
            ⚡ Test Payment Simulation (Demo Mode)
          </button>

          <p className="text-warm-400 text-xs mt-4">
            🔒 Secure payment via Stripe. We never see your card details.
          </p>
        </div>

        <p className="text-warm-400 text-xs">
          By subscribing, you agree that this app provides general fitness
          guidance and is not a substitute for medical advice.
        </p>
      </div>
    </main>
  );
}
