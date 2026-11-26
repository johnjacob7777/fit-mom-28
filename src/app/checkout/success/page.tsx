"use client";
// =============================================================
// CHECKOUT SUCCESS — Verifies payment & finalizes plan
// =============================================================
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IS_DEMO_ENABLED } from "@/lib/appConfig";
import { CheckCircle2, Sparkles, Heart } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userData, updateUserDocument } = useAuth();
  const [status, setStatus] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyAndGenerate = async () => {
      if (!user) return;

      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("No payment session found. Redirecting...");
        setTimeout(() => router.push("/checkout"), 2000);
        return;
      }

      try {
        const isDemoSession = IS_DEMO_ENABLED && sessionId.startsWith("demo_");
        let subscriptionId: string | null = null;

        if (sessionId.startsWith("demo_") && !IS_DEMO_ENABLED) {
          setStatus("Demo mode is disabled in production. Redirecting...");
          setTimeout(() => router.push("/checkout"), 2000);
          return;
        }

        if (!isDemoSession) {
          setStatus("Verifying your payment with Stripe...");
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyData.paid) {
            setStatus("Payment not completed. Redirecting...");
            setTimeout(() => router.push("/checkout"), 2000);
            return;
          }
          subscriptionId = verifyData.subscriptionId ?? null;
        } else {
          setStatus("Demo mode active — payment verified! ✅");
        }

        setStatus("Crafting your personalized 4-week daily routines... 🌸");
        const planRes = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizAnswers: userData?.quizAnswers,
          }),
        });

        const planData = await planRes.json();

        setStatus("Saving your plan and preparing your dashboard...");
        await updateUserDocument({
          isPaid: true,
          subscriptionStatus: "active",
          plan: planData.plan,
          stripeSessionId: sessionId,
          ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}),
        });

        setStatus("All set! Welcome to your dashboard! 🎉");
        setTimeout(() => router.push("/dashboard"), 1200);
      } catch (err) {
        console.error("Error finalizing plan:", err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => router.push("/checkout"), 3000);
      }
    };

    if (user) {
      verifyAndGenerate();
    }
  }, [user, userData, router, searchParams]);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="card-soft max-w-md w-full text-center space-y-6 shadow-soft-md">
        <div className="w-16 h-16 rounded-full bg-peach-100 flex items-center justify-center text-plum mx-auto">
          <Heart className="w-8 h-8 fill-blush-200 text-plum" />
        </div>

        <div>
          <h1 className="text-2xl font-heading font-bold text-plum mb-2">
            {status}
          </h1>
          <p className="text-xs text-plum/60">
            Setting up your 20-minute daily routine and progress tracker.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <div className="w-10 h-10 border-4 border-peach-200 border-t-plum rounded-full animate-spin" />
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-peach-200 border-t-plum rounded-full animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
