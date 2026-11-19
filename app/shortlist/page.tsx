import { Suspense } from "react";
import type { Metadata } from "next";
import { ShortlistClient } from "@/components/shortlist/ShortlistClient";
import { MOCK_TALENT_DATA } from "@/lib/mock-talent";

export const metadata: Metadata = {
  title: "Your Shortlist & Introduction Request · NitHub Talent Spotlight",
  description:
    "Review your shortlisted candidates and request a direct introduction from the NitHub placement team.",
};

function ShortlistFallback() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="h-16 bg-navy border-b border-white/10" />
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-96 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <Suspense fallback={<ShortlistFallback />}>
      <ShortlistClient allTalents={MOCK_TALENT_DATA} />
    </Suspense>
  );
}
