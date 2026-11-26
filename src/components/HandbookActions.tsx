"use client";
// =============================================================
// HANDBOOK ACTIONS — Instant Free PDF Download & Print Controls
// =============================================================
import Link from "next/link";
import { Download, Printer, ArrowLeft } from "lucide-react";

export default function HandbookActions() {
  return (
    <div className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-peach-200 px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-plum/75 hover:text-plum"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fit Mom 20
        </Link>

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
      </div>
    </div>
  );
}
