import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectoryClient } from "@/components/directory/DirectoryClient";
import { ALL_STACK_TAGS, MOCK_TALENT_DATA } from "@/lib/mock-talent";

export const metadata: Metadata = {
  title: "Talent Directory · NitHub Talent Spotlight",
  description:
    "Browse real projects built by NitHub interns and graduates. Filter by role, skills, and availability to connect with your next hire.",
};

function DirectoryFallback() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="h-16 bg-navy border-b border-white/10" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="h-10 w-80 bg-slate-200 rounded animate-pulse" />
        <div className="mt-4 h-5 w-96 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<DirectoryFallback />}>
      <DirectoryClient
        initialTalents={MOCK_TALENT_DATA}
        availableStackTags={ALL_STACK_TAGS}
      />
    </Suspense>
  );
}
