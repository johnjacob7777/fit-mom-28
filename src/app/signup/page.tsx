"use client";
// =============================================================
// SIGNUP PAGE — Clean theme with deep plum, cream & peach
// =============================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { IS_DEMO_ENABLED } from "@/lib/appConfig";
import { ArrowLeft, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { startDemoSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick launch in Demo Mode
  const handleStartDemo = () => {
    startDemoSession(name || "Mama", email || "mom@example.com");
    router.push("/onboarding");
  };

  const createUserDoc = async (uid: string, userEmail: string, displayName: string) => {
    const docRef = doc(db, "users", uid);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        email: userEmail,
        displayName: displayName || "",
        quizCompleted: false,
        isPaid: false,
        createdAt: new Date().toISOString(),
        progress: {
          workoutsCompleted: {},
          waterIntake: {},
          weightLog: {},
        },
      });
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await createUserDoc(result.user.uid, email, name);
      router.push("/onboarding");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDoc(
        result.user.uid,
        result.user.email || "",
        result.user.displayName || ""
      );
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data?.isPaid) {
        router.push("/dashboard");
      } else if (data?.quizCompleted) {
        router.push("/checkout");
      } else {
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Back Link & Brand */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-plum/70 hover:text-plum font-medium mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach-200 text-plum font-heading font-bold flex items-center justify-center">
              F
            </div>
            <span className="font-heading font-bold text-xl text-plum">Fit Mom 20</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-plum mt-3">
            Start Your 20-Minute Plan
          </h1>
          <p className="text-plum/70 text-sm mt-1">
            Gentle, restorative daily movement built for mom life.
          </p>
        </div>

        {/* Demo Mode Quick Access (dev/demo only) */}
        {IS_DEMO_ENABLED && (
          <div className="mb-4 bg-peach-100/70 border border-peach-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-plum" /> Instant Test Preview
            </div>
            <button
              type="button"
              onClick={handleStartDemo}
              className="w-full bg-plum text-white font-medium py-2.5 px-4 rounded-xl text-sm hover:bg-plum-500 transition-all shadow-xs"
            >
              Explore in Demo Mode (No Setup Required) →
            </button>
          </div>
        )}

        {/* Card */}
        <div className="card-soft shadow-soft-md">
          {/* Google sign-in */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-peach-200/80 rounded-2xl px-4 py-3.5 font-medium text-plum hover:bg-peach-50 transition-colors disabled:opacity-50 text-base"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-peach-200" />
            <span className="text-plum/50 text-xs uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-peach-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-plum font-medium text-sm mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-peach-200 rounded-2xl px-4 py-3.5 focus:border-plum focus:outline-none transition-colors text-base text-plum bg-cream-50"
                placeholder="e.g. Priya"
              />
            </div>
            <div>
              <label className="block text-plum font-medium text-sm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-peach-200 rounded-2xl px-4 py-3.5 focus:border-plum focus:outline-none transition-colors text-base text-plum bg-cream-50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-plum font-medium text-sm mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border-2 border-peach-200 rounded-2xl px-4 py-3.5 focus:border-plum focus:outline-none transition-colors text-base text-plum bg-cream-50"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <div className="text-red-700 text-sm bg-red-50 rounded-2xl p-4 border border-red-200">
                <p className="font-semibold mb-1">Notice:</p>
                <p className="text-xs">{error}</p>
                {IS_DEMO_ENABLED && (
                  <button
                    type="button"
                    onClick={handleStartDemo}
                    className="mt-2 text-xs font-semibold text-plum underline"
                  >
                    Switch to instant demo mode instead →
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5"
            >
              {loading ? "Creating your account..." : "Continue to 2-Min Quiz →"}
            </button>
          </form>

          <p className="text-xs text-plum/60 text-center mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-600" /> 7-day money-back guarantee • Cancel anytime
          </p>
        </div>

        {/* Login link */}
        <p className="text-center text-plum/70 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-plum font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </main>
  );
}
