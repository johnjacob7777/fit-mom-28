"use client";
// =============================================================
// SIGNUP PAGE — create a new account
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

  // Create user document in Firestore (if it doesn't exist)
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

  // Sign up with email
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

  // Sign up with Google
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
      // Check if user already has quiz data
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
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-peach-500 font-extrabold text-lg tracking-widest">
            FIT MOM 20
          </Link>
          <h1 className="text-2xl font-bold text-warm-800 mt-4">
            Create your account
          </h1>
          <p className="text-warm-500 mt-1">Start your fitness journey today</p>
        </div>

        {/* Demo Mode Quick Start Banner */}
        <div className="mb-4 bg-peach-100 border border-peach-300 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-warm-700 mb-2">
            🚀 Want to preview the full app without Firebase setup?
          </p>
          <button
            type="button"
            onClick={handleStartDemo}
            className="w-full bg-peach-500 hover:bg-peach-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow"
          >
            Launch Instant Demo Mode →
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-md">
          {/* Google sign-in */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-warm-100 rounded-xl px-4 py-3 font-semibold text-warm-700 hover:bg-warm-50 transition-colors disabled:opacity-50"
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
            <div className="flex-1 h-px bg-warm-100" />
            <span className="text-warm-400 text-sm">or</span>
            <div className="flex-1 h-px bg-warm-100" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-warm-600 text-sm font-semibold mb-1">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-warm-100 rounded-xl px-4 py-3 focus:border-sage-300 focus:outline-none transition-colors"
                placeholder="e.g. Priya"
              />
            </div>
            <div>
              <label className="block text-warm-600 text-sm font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-warm-100 rounded-xl px-4 py-3 focus:border-sage-300 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-warm-600 text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border-2 border-warm-100 rounded-xl px-4 py-3 focus:border-sage-300 focus:outline-none transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="font-semibold mb-1">Firebase Error:</p>
                <p className="mb-3">{error}</p>
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs"
                >
                  Switch to Demo Mode instead →
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-400 hover:bg-sage-500 text-white font-bold py-3 rounded-xl shadow transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-warm-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-sage-500 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
