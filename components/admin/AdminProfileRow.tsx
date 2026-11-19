"use client";

import Link from "next/link";
import {
  AdminCandidateProfile,
  AVAILABILITY_LABELS,
  TRACK_LABELS,
} from "@/types/talent";

interface AdminProfileRowProps {
  profile: AdminCandidateProfile;
  isOldestPending?: boolean;
  onToggleApprove: (id: string, nextVerified: boolean) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminProfileRow({
  profile,
  onToggleApprove,
}: AdminProfileRowProps) {
  const orderedProjects = [...profile.projects].sort(
    (a, b) => a.position - b.position
  );

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Bar: Clean Typography on Left, Single Action on Right */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-navy text-white font-cabinet font-bold text-base flex items-center justify-center shrink-0">
              {getInitials(profile.full_name)}
            </div>
          )}

          <div>
            <h3 className="font-cabinet font-extrabold text-xl text-navy">
              {profile.full_name}
            </h3>

            <p className="mt-0.5 font-cabin text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-brand-green">
                {TRACK_LABELS[profile.track]}
              </span>
              <span className="text-slate-300">·</span>
              <span>Cohort {profile.cohort_year}</span>
              <span className="text-slate-300">·</span>
              <span>{AVAILABILITY_LABELS[profile.availability_status]}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{profile.email}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">
                {profile.submitted_at_label}
              </span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {profile.is_verified ? (
            <>
              <Link
                href={`/talent/${profile.id}`}
                className="font-cabin text-xs sm:text-sm font-semibold text-brand-green hover:underline underline-offset-4"
              >
                View public profile ↗
              </Link>
              <button
                type="button"
                onClick={() => onToggleApprove(profile.id, false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-600 font-cabin text-xs font-semibold hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer"
              >
                Unapprove
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onToggleApprove(profile.id, true)}
              className="px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer"
            >
              Approve &amp; Publish
            </button>
          )}
        </div>
      </div>

      {/* Middle: Bio & Plain Text Social Links */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <p className="font-mulish text-sm text-slate-700 leading-relaxed max-w-3xl">
          {profile.bio}
        </p>

        {(profile.github_url || profile.linkedin_url || profile.x_url) && (
          <div className="flex flex-wrap items-center gap-4 shrink-0 font-cabin text-xs font-semibold text-slate-500">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green hover:underline underline-offset-4"
              >
                GitHub ↗
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green hover:underline underline-offset-4"
              >
                LinkedIn ↗
              </a>
            )}
            {profile.x_url && (
              <a
                href={profile.x_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green hover:underline underline-offset-4"
              >
                X (Twitter) ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Submitted Projects List (Clean rows without badge clutter) */}
      <div className="px-6 py-4">
        <p className="font-cabin text-xs font-semibold text-slate-400 mb-2">
          Projects ({orderedProjects.length})
        </p>

        <div className="divide-y divide-slate-100">
          {orderedProjects.map((project) => (
            <div
              key={project.id}
              className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h4 className="font-cabinet font-bold text-base text-navy">
                    {project.position}. {project.title}
                  </h4>
                  <span className="font-cabin text-xs text-slate-400">
                    · Built with {project.tech_stack.join(", ")}
                  </span>
                </div>
                <p className="mt-0.5 font-mulish text-xs text-slate-600 line-clamp-1">
                  {project.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 font-cabin text-xs">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green font-semibold hover:underline underline-offset-4"
                >
                  Live project ↗
                </a>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-navy hover:underline underline-offset-4"
                >
                  Source code ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
