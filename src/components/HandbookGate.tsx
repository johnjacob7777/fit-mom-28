"use client";
// =============================================================
// HANDBOOK GATE — Unlocks Chapters 2–5 & PDF Download via Free Signup
// =============================================================
import { useState, ReactNode } from "react";
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
import {
  Lock,
  CheckCircle2,
  Download,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function HandbookGate({ children }: { children: ReactNode }) {
  const { user, userData, loading, startDemoSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ensureLeadDoc = async (uid: string, userEmail: string, displayName: string) => {
    const docRef = doc(db, "users", uid);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        email: userEmail,
        displayName: displayName || "Mama",
        quizCompleted: false,
        isPaid: false,
        leadSource: "free_ebook",
        ebookUnlocked: true,
        createdAt: new Date().toISOString(),
        progress: {
          workoutsCompleted: {},
          waterIntake: {},
          weightLog: {},
        },
      });
    }
  };

  const handleGoogleUnlock = async () => {
    setError("");
    setSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureLeadDoc(
        result.user.uid,
        result.user.email || "",
        result.user.displayName || ""
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not sign in with Google.";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await ensureLeadDoc(result.user.uid, email, name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not create free account.";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-soft text-center py-12 space-y-3">
        <div className="w-8 h-8 border-4 border-peach-200 border-t-plum rounded-full animate-spin mx-auto" />
        <p className="text-xs text-plum/65 font-medium">Checking access...</p>
      </div>
    );
  }

  if (user) {
    return (
      <>
        <div className="no-print bg-sage-50 border-2 border-sage-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-heading font-bold text-lg text-plum flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
              Your Free 36-Page eBook &amp; Workbook Is Unlocked!
            </p>
            <p className="text-xs text-plum/75">
              Download your full 36-page illustrated PDF workbook (with 4 regional shopping lists, postpartum diagrams &amp; printable posters) or read below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/fit-mom-20-comeback-handbook.pdf"
              download="Fit-Mom-20-Comeback-Handbook.pdf"
              className="btn-primary py-2.5 px-4 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
            <Link
              href={userData?.isPaid ? "/dashboard" : "/onboarding"}
              className="btn-secondary py-2.5 px-4 text-xs"
            >
              {userData?.isPaid ? "Go to Dashboard" : "Take 2-Min Plan Quiz"}{" "}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {children}
      </>
    );
  }

  return (
    <section id="unlock-ebook" className="space-y-6 scroll-mt-20">
      {/* Inline Conversion Gate Card */}
      <div className="card-soft border-2 border-plum/20 bg-gradient-to-br from-white via-peach-50/60 to-blush-50/40 shadow-soft-md space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-plum text-white px-3.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Free Instant Unlock
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
            Unlock All 8 Parts &amp; Download the 36-Page PDF Free
          </h2>
          <p className="text-xs sm:text-sm text-plum/75">
            Create your free Fit Mom 20 login in 10 seconds to save your complete 36-page workbook, 4 regional menus, and printable fridge trackers.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Left: What's Inside the 36-Page Edition */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-peach-200 p-5 space-y-3 text-xs">
            <p className="font-bold uppercase tracking-wider text-plum/60 text-[11px]">
              Unlocks Immediately Inside (36 Pages):
            </p>
            <ul className="space-y-2.5 text-plum/85">
              {[
                "Part 2 (pp. 8–12): 60s 2-Finger Belly Check diagram, C-Section timeline & 12 safe move cards",
                "Part 3 (pp. 13–15): \"Mommy Thumb\" Scoop Lift diagram, feeding neck unwind & ergonomics",
                "Part 4–6 (pp. 16–27): Full 7-day workouts + North/South Indian, All-India & Global menus + shopping lists",
                "Part 7–8 (pp. 28–36): 6-min sleep downshift, 3 PM craving swaps & printable fridge trackers/posters",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 border-t border-peach-100 text-[11px] text-plum/65 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
              100% free eBook access — no credit card required.
            </p>
          </div>

          {/* Right: 1-Tap Google or Email Signup */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-peach-200 p-5 space-y-4">
            {IS_DEMO_ENABLED && (
              <button
                type="button"
                onClick={() => startDemoSession("Mama", "mom@example.com", false)}
                className="w-full bg-peach-100 hover:bg-peach-200 text-plum font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-peach-300"
              >
                <Sparkles className="w-3.5 h-3.5" /> Dev Demo: Unlock eBook Preview
              </button>
            )}

            <button
              type="button"
              onClick={handleGoogleUnlock}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 border-2 border-plum/25 hover:border-plum rounded-xl px-4 py-3 font-bold text-plum bg-cream-50 hover:bg-peach-50 transition-colors text-sm disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google (1-Tap Unlock)
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-peach-200" />
              <span className="text-[11px] uppercase tracking-wider text-plum/50 font-semibold">
                or free email signup
              </span>
              <div className="flex-1 h-px bg-peach-200" />
            </div>

            <form onSubmit={handleEmailUnlock} className="space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="First name (e.g. Priya)"
                  className="w-full border border-peach-200 rounded-xl px-3.5 py-2.5 bg-cream-50 text-plum focus:border-plum focus:outline-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  className="w-full border border-peach-200 rounded-xl px-3.5 py-2.5 bg-cream-50 text-plum focus:border-plum focus:outline-none"
                />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Create a quick password (6+ characters)"
                className="w-full border border-peach-200 rounded-xl px-3.5 py-2.5 bg-cream-50 text-plum focus:border-plum focus:outline-none"
              />

              {error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-sm"
              >
                {submitting ? "Unlocking Your eBook..." : "Unlock Free eBook PDF Now →"}
              </button>
            </form>

            <p className="text-center text-[11px] text-plum/65">
              Already have a login?{" "}
              <Link href="/login" className="font-bold text-plum underline">
                Log in to unlock
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Teaser Preview Cards for Locked Parts 2–8 */}
      <div className="grid sm:grid-cols-2 gap-4 opacity-80">
        {[
          {
            ch: "Part 2 • Pages 8–12",
            title: "60s 2-Finger Belly Diagram, C-Section Roadmap & 12 Safe Moves",
          },
          {
            ch: "Part 3–4 • Pages 13–17",
            title: "2 AM \"Mommy Thumb\" Wrist Scoop, Neck Unwind & 7-Day Home Flow",
          },
          {
            ch: "Part 5–6 • Pages 18–27",
            title: "4 Regional 7-Day Menus, Grocery Checklists & 10-Min Dinners",
          },
          {
            ch: "Part 7–8 • Pages 28–36",
            title: "Evening Sleep Reset, 3 PM Cravings Fix & Printable Trackers",
          },
        ].map((item) => (
          <a
            key={item.ch}
            href="#unlock-ebook"
            className="card-soft p-5 flex items-center justify-between gap-3 hover:border-plum/40 transition-colors"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum/55 block">
                {item.ch}
              </span>
              <span className="font-heading font-bold text-base text-plum">
                {item.title}
              </span>
            </div>
            <span className="w-8 h-8 rounded-full bg-peach-100 text-plum flex items-center justify-center shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
