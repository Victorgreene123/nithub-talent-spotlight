"use client";

import Link from "next/link";
import {
  AVAILABILITY_LABELS,
  TalentDirectoryItem,
  TRACK_LABELS,
} from "@/types/talent";
import { ProjectPreview } from "./ProjectPreview";

interface TalentCardProps {
  talent: TalentDirectoryItem;
  isShortlisted: boolean;
  onToggleShortlist: (talent: TalentDirectoryItem) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TalentCard({
  talent,
  isShortlisted,
  onToggleShortlist,
}: TalentCardProps) {
  const { top_project } = talent;
  const isAvailableNow = talent.availability_status === "available_now";

  return (
    <article
      className={`flex flex-col bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md ${
        isShortlisted
          ? "border-brand-green ring-1 ring-brand-green/25"
          : "border-slate-200 hover:border-brand-green/40"
      }`}
    >
      {/* Top Half: Project Preview */}
      <ProjectPreview project={top_project} authorName={talent.full_name} />

      {/* Middle: What they built */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={`/talent/${talent.id}`}
              className="font-cabinet font-bold text-lg text-navy leading-snug tracking-tight hover:text-brand-green transition-colors"
            >
              {top_project.title}
            </Link>
          </div>

          <p className="mt-2 font-mulish text-sm text-slate-600 leading-relaxed line-clamp-3">
            {top_project.tagline}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {/* Calm tool tags in Cabin */}
          <div className="flex flex-wrap items-center gap-1.5">
            {top_project.tech_stack.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-cabin text-xs font-medium"
              >
                {tool}
              </span>
            ))}
            {top_project.tech_stack.length > 4 && (
              <span className="px-2 py-0.5 text-slate-400 font-cabin text-xs">
                +{top_project.tech_stack.length - 4}
              </span>
            )}
          </div>

          {/* Direct project links (accessible on both mobile and desktop) */}
          <div className="flex items-center gap-4 pt-1 font-cabin text-xs">
            <a
              href={top_project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green font-semibold hover:underline underline-offset-4"
            >
              View live project ↗
            </a>
            <a
              href={top_project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-navy hover:underline underline-offset-4"
            >
              Source code
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Half: The Person */}
      <div className="px-5 py-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between gap-3">
        <Link
          href={`/talent/${talent.id}`}
          className="flex items-center gap-3 min-w-0 group"
        >
          {talent.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.avatar_url}
              alt={talent.full_name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy text-white font-cabinet font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-brand-green/25">
              {getInitials(talent.full_name)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-cabinet font-bold text-base text-navy truncate group-hover:text-brand-green transition-colors">
              {talent.full_name}
            </h3>
            <p className="font-cabin text-xs text-slate-500 truncate">
              <span>{TRACK_LABELS[talent.track]}</span>
              <span> · </span>
              <span
                className={
                  isAvailableNow ? "text-brand-green font-semibold" : ""
                }
              >
                {AVAILABILITY_LABELS[talent.availability_status]}
              </span>
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => onToggleShortlist(talent)}
          aria-pressed={isShortlisted}
          className={`shrink-0 px-3.5 py-2 rounded-lg font-cabin text-xs font-semibold transition-colors cursor-pointer ${
            isShortlisted
              ? "bg-brand-green text-white hover:bg-brand-green/90"
              : "bg-white text-brand-green border border-brand-green hover:bg-brand-green hover:text-white"
          }`}
        >
          {isShortlisted ? "Shortlisted ✓" : "+ Shortlist"}
        </button>
      </div>
    </article>
  );
}
