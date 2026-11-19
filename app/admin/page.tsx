import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Placement & Directory Admin · NitHub Talent Spotlight",
  description:
    "Review and approve pending NitHub intern profiles and manage incoming employer introduction requests.",
};

function AdminFallback() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="h-16 bg-navy border-b border-white/10" />
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-80 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminDashboardClient />
    </Suspense>
  );
}
