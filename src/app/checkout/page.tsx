"use client";
// =============================================================
// CHECKOUT PAGE — Clean theme with plum, cream & peach
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getStripe } from "@/lib/stripe";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

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

      const stripe = await getStripe();
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment connection error";
      setError(message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-peach-200 border-t-plum rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-plum/70 hover:text-plum mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach-200 text-plum font-heading font-bold flex items-center justify-center">
              F
            </div>
            <span className="font-heading font-bold text-xl text-plum">Fit Mom 20</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-plum mt-3">
            Your Plan Is Ready, Mama! 🌸
          </h1>
          <p className="text-plum/70 text-sm mt-1">
            Unlock your personalized 4-week daily routines and meal ideas.
          </p>
        </div>

        <div className="card-soft shadow-soft-md border-2 border-plum/20 text-left">
          <div className="text-center pb-4 border-b border-peach-200">
            <span className="text-xs font-bold uppercase tracking-wider text-plum/60 bg-peach-100 px-3 py-1 rounded-full border border-peach-200">
              All-Access Membership
            </span>
            <p className="text-4xl font-heading font-extrabold text-plum mt-3">
              ₹499
              <span className="text-base font-sans font-normal text-plum/60">/month</span>
            </p>
            <p className="text-xs text-plum/60 mt-1">Cancel anytime • No lock-in period</p>
          </div>

          <ul className="space-y-3 text-sm text-plum/85 py-6">
            {[
              "Personalized 20-minute daily home workouts",
              "Gentle posture & postpartum-conscious variations",
              "Balanced weekly meal guides (fits your diet)",
              "Interactive daily timer & streak tracker",
              "Water intake and optional wellness logging",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="text-xs bg-peach-100 border border-peach-300 text-plum p-3.5 rounded-xl mb-4">
              <p className="font-semibold mb-1">Stripe Checkout Notice:</p>
              <p className="text-plum/70 mb-2">{error}</p>
              <button
                type="button"
                onClick={() => router.push("/checkout/success?session_id=demo_session_" + Date.now())}
                className="w-full bg-plum text-white font-semibold py-2 px-3 rounded-lg text-xs hover:bg-plum-500 transition-colors"
              >
                Continue in Instant Demo Mode →
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={paying}
            className="btn-primary w-full text-base py-3.5"
          >
            <Lock className="w-4 h-4 mr-1" />
            {paying ? "Redirecting to Stripe..." : "Subscribe for ₹499 & Start →"}
          </button>

          {/* Demo simulation shortcut */}
          <button
            type="button"
            onClick={() => router.push("/checkout/success?session_id=demo_session_" + Date.now())}
            className="w-full mt-3 bg-peach-50 border border-peach-200 text-plum hover:bg-peach-100 font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Test Payment Simulation (Demo Mode)
          </button>

          <div className="bg-sage-50 border border-sage-200 rounded-xl p-3 mt-4 text-[11px] text-plum/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
            <span>
              <strong>7-Day Money-Back Guarantee:</strong> Try your routines for 7 days. If you aren&apos;t completely satisfied, contact us for an immediate refund.
            </span>
          </div>
        </div>

        <p className="text-[11px] text-plum/60 leading-normal">
          ⚕️ Fit Mom 20 provides general educational fitness guidance. Please check with your doctor before beginning any physical exercise program.
        </p>
      </div>
    </main>
  );
}
