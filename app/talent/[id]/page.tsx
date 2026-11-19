import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TalentProfileClient } from "@/components/talent/TalentProfileClient";
import { getTalentProfileById, MOCK_TALENT_DATA } from "@/lib/mock-talent";

interface TalentPageProps {
  params: Promise<{ id: string }>;
}

function TalentProfileFallback() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="h-16 bg-navy border-b border-white/10" />
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="flex items-center gap-5 pt-2">
            <div className="w-20 h-20 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2.5">
              <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-44 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function TalentProfileLoader({ params }: TalentPageProps) {
  const { id } = await params;
  const profile = getTalentProfileById(id);

  if (!profile) {
    notFound();
  }

  return (
    <TalentProfileClient profile={profile} allTalents={MOCK_TALENT_DATA} />
  );
}

export default function TalentProfilePage({ params }: TalentPageProps) {
  return (
    <Suspense fallback={<TalentProfileFallback />}>
      <TalentProfileLoader params={params} />
    </Suspense>
  );
}
