import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Fit Mom 20",
  description: "How Fit Mom 20 respects and protects your privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-2xl mx-auto card-soft">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-plum/70 hover:text-plum mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-plum">Privacy Policy</h1>
        </div>

        <p className="text-sm text-plum/60 mb-6">Last updated: November 2026</p>

        <div className="space-y-4 text-plum/80 text-base leading-relaxed">
          <p>
            At <strong>Fit Mom 20</strong>, your personal wellness and peace of mind are our priority. We are committed to transparency in how we collect, use, and protect your information.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">1. Information We Collect</h2>
          <p>
            When you create an account and complete our onboarding quiz, we collect your name, email, age, general fitness preferences, and optional wellness logs (such as daily water intake and optional weight notes).
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">2. How We Use It</h2>
          <p>
            We use this information exclusively to tailor your 20-minute daily home workout routines, suggest meal plans according to your dietary preferences, and track your progress inside your private dashboard.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">3. Security & Payments</h2>
          <p>
            We never sell or rent your personal information to third parties. Financial transactions are securely handled directly through Stripe; we never store your credit or debit card details on our servers.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">4. Contact Us</h2>
          <p>
            For questions regarding your data or account deletion, reach out to us at{" "}
            <a href="mailto:support@fitmom20.com" className="text-plum font-semibold underline">
              support@fitmom20.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
