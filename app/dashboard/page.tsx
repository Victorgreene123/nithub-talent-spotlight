import { Suspense } from "react";
import type { Metadata } from "next";
import { InternDashboardClient } from "@/components/dashboard/InternDashboardClient";

export const metadata: Metadata = {
  title: "Intern Workspace · NitHub Talent Spotlight",
  description:
    "Review employer introduction requests, update your availability, and manage your shipped projects.",
};

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="h-16 bg-navy border-b border-white/10" />
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-36 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <InternDashboardClient />
    </Suspense>
  );
}
