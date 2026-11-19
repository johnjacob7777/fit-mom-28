import Link from "next/link";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Fit Mom 20",
  description: "Terms and conditions for using Fit Mom 20.",
};

export default function TermsPage() {
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
          <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-plum">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-plum">Terms of Service</h1>
        </div>

        <p className="text-sm text-plum/60 mb-6">Last updated: November 2026</p>

        <div className="bg-peach-50 border border-peach-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-plum shrink-0 mt-0.5" />
          <p className="text-sm text-plum/80 leading-relaxed">
            <strong>Important Medical Disclaimer:</strong> Fit Mom 20 provides general educational fitness guidance and home wellness plans. It is not medical advice. Always consult your physician or obstetrician before beginning any physical exercise regimen, especially postpartum or if managing pain.
          </p>
        </div>

        <div className="space-y-4 text-plum/80 text-base leading-relaxed">
          <h2 className="text-xl font-heading font-semibold text-plum pt-2">1. Subscription & Billing</h2>
          <p>
            Fit Mom 20 is offered as a recurring monthly subscription (₹499/month, or as configured at checkout). You may cancel your subscription at any time directly through your dashboard with no lock-in periods or penalties.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">2. 7-Day Money-Back Guarantee</h2>
          <p>
            We want you to feel confident in your routine. If you try the plan and feel it isn't the right fit for your schedule within your first 7 days, contact our support team for a full refund.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">3. User Responsibility</h2>
          <p>
            You agree to exercise within your comfortable range of motion, stop immediately if you feel dizzy or sharp pain, and follow appropriate recovery guidelines.
          </p>

          <h2 className="text-xl font-heading font-semibold text-plum pt-4">4. Inquiries</h2>
          <p>
            Questions? Email our team anytime at{" "}
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
