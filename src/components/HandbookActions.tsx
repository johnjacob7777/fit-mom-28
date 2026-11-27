"use client";
// =============================================================
// HANDBOOK ACTIONS — Auth-aware PDF Download, Print & Funnel CTAs
// =============================================================
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Download, Printer, ArrowLeft, Lock, ArrowRight } from "lucide-react";

export function HandbookCoverActions() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="no-print pt-2 flex justify-center">
        <div className="h-10 w-48 rounded-2xl bg-peach-200/50 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="no-print pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/fit-mom-20-comeback-handbook.pdf"
          download="Fit-Mom-20-Comeback-Handbook.pdf"
          className="btn-primary py-3 px-6 text-sm"
        >
          <Download className="w-4 h-4" /> Download Full 36-Page PDF
        </a>
        <Link
          href={userData?.isPaid ? "/dashboard" : "/onboarding"}
          className="btn-secondary py-3 px-5 text-sm"
        >
          {userData?.isPaid
            ? "Return to Dashboard"
            : "Personalize My 4-Week App Plan"}{" "}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="no-print pt-2 flex flex-wrap items-center justify-center gap-3">
      <a href="#unlock-ebook" className="btn-primary py-3 px-6 text-sm">
        <Lock className="w-4 h-4" /> Unlock Full 36-Page Manual &amp; PDF
      </a>
      <a href="#chapter-1" className="btn-secondary py-3 px-5 text-sm">
        Read Chapter 1 Free Below
      </a>
    </div>
  );
}

export default function HandbookActions() {
  const { user, userData } = useAuth();

  return (
    <div className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-peach-200 px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <Link
          href={userData?.isPaid ? "/dashboard" : "/"}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-plum/75 hover:text-plum"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {userData?.isPaid ? "Back to Dashboard" : "Back to Fit Mom 20"}
        </Link>

        {user ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-secondary py-2 px-3.5 text-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save Copy
            </button>
            <a
              href="/fit-mom-20-comeback-handbook.pdf"
              download="Fit-Mom-20-Comeback-Handbook.pdf"
              className="btn-primary py-2 px-4 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download Free PDF
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-plum/75 hover:text-plum px-3 py-2"
            >
              Member Login
            </Link>
            <a href="#unlock-ebook" className="btn-primary py-2 px-4 text-xs">
              <Lock className="w-3.5 h-3.5" /> Unlock Free PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
