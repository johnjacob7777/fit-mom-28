"use client";
// =============================================================
// CHECKOUT SUCCESS — verifies payment and generates the plan
// =============================================================
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

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
        const isDemoSession = sessionId.startsWith("demo_");

        if (!isDemoSession) {
          // 1. Verify payment with our API
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
        } else {
          setStatus("Demo mode active — payment verified! ✅");
        }

        // 2. Generate the personalized plan
        setStatus("Creating your personalized plan... 💪");
        const planRes = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizAnswers: userData?.quizAnswers,
          }),
        });

        const planData = await planRes.json();

        // 3. Save everything
        setStatus("Saving your plan... Almost there!");
        await updateUserDocument({
          isPaid: true,
          plan: planData.plan,
          stripeSessionId: sessionId,
        });

        // 4. Done! Go to dashboard
        setStatus("All set! Welcome to your dashboard! 🎉");
        setTimeout(() => router.push("/dashboard"), 1200);
      } catch (err) {
        console.error("Error:", err);
        setStatus("Something went wrong. Please try again.");
        setTimeout(() => router.push("/checkout"), 3000);
      }
    };

    if (user) {
      verifyAndGenerate();
    }
  }, [user, userData, router, searchParams]);

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">🌸</div>
        <h1 className="text-2xl font-bold text-warm-800 mb-4">{status}</h1>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream-50 flex items-center justify-center">
          <p className="text-warm-400 animate-pulse text-lg">Loading...</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
