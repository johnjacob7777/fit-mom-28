import Link from "next/link";
import { ArrowLeft, Mail, Heart, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us — Fit Mom 20",
  description: "Get in touch with the Fit Mom 20 team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-xl mx-auto card-soft text-center">
        <div className="text-left mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-plum/70 hover:text-plum font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center text-plum mx-auto mb-4">
          <Heart className="w-8 h-8 fill-blush-200" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-plum mb-3">
          We&apos;re Here For You, Mama
        </h1>
        <p className="text-plum/80 text-base mb-8 max-w-md mx-auto">
          Have questions about your plan, billing, or need help adjusting your exercises? We reply to every single email personally.
        </p>

        <div className="bg-cream-100 rounded-2xl p-6 border border-peach-200 mb-8 text-left space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-plum shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-plum/60 tracking-wider">Email Us</p>
              <a
                href="mailto:support@fitmom20.com"
                className="text-base md:text-lg font-semibold text-plum hover:underline"
              >
                support@fitmom20.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-peach-200">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sage-600 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-plum/60 tracking-wider">Response Time</p>
              <p className="text-sm text-plum/80">Typically within 24 hours on business days</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-plum/50">
          Fit Mom 20 • Designed with care for busy mothers worldwide.
        </p>
      </div>
    </main>
  );
}
