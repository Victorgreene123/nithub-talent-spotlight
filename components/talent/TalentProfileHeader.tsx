"use client";

import Link from "next/link";
import {
  AVAILABILITY_LABELS,
  TalentProfile,
  TRACK_LABELS,
} from "@/types/talent";

interface TalentProfileHeaderProps {
  profile: TalentProfile;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onOpenShortlistDrawer: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TalentProfileHeader({
  profile,
  isShortlisted,
  onToggleShortlist,
  onOpenShortlistDrawer,
}: TalentProfileHeaderProps) {
  const firstName = profile.full_name.split(" ")[0] ?? profile.full_name;
  const isAvailableNow = profile.availability_status === "available_now";

  return (
    <section className="bg-white border-b border-slate-200 pt-8 pb-12 sm:pt-10 sm:pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 font-cabin text-sm font-medium text-slate-500 hover:text-brand-green transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Talent Directory</span>
          </Link>
        </div>

        {/* Main Split Header: Bio on Left, Primary Action Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Person Identity & Bio (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-green/30 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy text-white font-cabinet font-extrabold text-2xl flex items-center justify-center shrink-0 ring-4 ring-brand-green/20">
                  {getInitials(profile.full_name)}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-cabinet font-extrabold text-3xl sm:text-4xl text-navy tracking-tight">
                    {profile.full_name}
                  </h1>
                  {profile.is_verified && (
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                      NitHub Verified
                    </span>
                  )}
                </div>

                <p className="mt-1.5 font-cabin text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-navy">
                    {TRACK_LABELS[profile.track]}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Cohort {profile.cohort_year}</span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={
                      isAvailableNow
                        ? "text-brand-green font-semibold"
                        : "text-slate-600"
                    }
                  >
                    {AVAILABILITY_LABELS[profile.availability_status]}
                  </span>
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-6 font-mulish text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Public Social / Code Links */}
            {(profile.github_url || profile.linkedin_url || profile.x_url) && (
              <div className="mt-6 flex flex-wrap items-center gap-4 font-cabin text-sm">
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-navy font-medium hover:border-brand-green hover:text-brand-green transition-colors"
                  >
                    <span>GitHub</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-navy font-medium hover:border-brand-green hover:text-brand-green transition-colors"
                  >
                    <span>LinkedIn</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {profile.x_url && (
                  <a
                    href={profile.x_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-navy font-medium hover:border-brand-green hover:text-brand-green transition-colors"
                  >
                    <span>X (Twitter)</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: Single Primary Action Box (4 cols) */}
          <div className="lg:col-span-4 w-full">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">
              <div>
                <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
                  Hire through NitHub
                </p>
                <h2 className="mt-1 font-cabinet font-bold text-xl text-navy">
                  Interested in working with {firstName}?
                </h2>
                <p className="mt-1.5 font-mulish text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Add {firstName} to your shortlist (up to 5 candidates) and
                  send one introduction request. Our team will connect you
                  directly.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={onToggleShortlist}
                  aria-pressed={isShortlisted}
                  className={`w-full py-3 px-4 rounded-xl font-cabin text-sm font-semibold transition-colors cursor-pointer ${
                    isShortlisted
                      ? "bg-brand-green text-white hover:bg-brand-green/90"
                      : "bg-brand-green text-white hover:bg-brand-green/90 shadow-xs"
                  }`}
                >
                  {isShortlisted
                    ? `${firstName} is in your shortlist ✓`
                    : `+ Add ${firstName} to shortlist`}
                </button>

                {isShortlisted && (
                  <Link
                    href="/shortlist"
                    className="block w-full py-2.5 px-4 rounded-xl bg-white border border-brand-green text-brand-green font-cabin text-xs font-semibold text-center hover:bg-brand-green/5 transition-colors"
                  >
                    Request introduction now →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
