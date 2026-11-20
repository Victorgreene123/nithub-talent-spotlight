"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AVAILABILITY_LABELS,
  TalentDirectoryItem,
  TRACK_LABELS,
} from "@/types/talent";

interface ShortlistedCandidateCardProps {
  person: TalentDirectoryItem;
  candidateNote: string;
  onUpdateNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ShortlistedCandidateCard({
  person,
  candidateNote,
  onUpdateNote,
  onRemove,
}: ShortlistedCandidateCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(
    Boolean(candidateNote.trim())
  );
  const firstName = person.full_name.split(" ")[0] ?? person.full_name;
  const isAvailableNow = person.availability_status === "available_now";

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 transition-shadow hover:shadow-xs">
      {/* Row 1: Avatar + Name/Meta on Left, Remove Button on Right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {person.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.avatar_url}
              alt={person.full_name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-navy text-white font-cabinet font-bold text-sm sm:text-base flex items-center justify-center shrink-0 ring-2 ring-brand-green/25">
              {getInitials(person.full_name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <Link
                href={`/talent/${person.id}`}
                className="font-cabinet font-bold text-base sm:text-lg text-navy hover:text-brand-green transition-colors truncate"
              >
                {person.full_name}
              </Link>
              <span className="font-cabin text-xs font-semibold text-brand-green">
                · {TRACK_LABELS[person.track]}
              </span>
            </div>

            <p className="mt-0.5 font-cabin text-xs text-slate-500 truncate">
              <span>Cohort {person.cohort_year}</span>
              <span> · </span>
              <span
                className={
                  isAvailableNow ? "text-brand-green font-semibold" : ""
                }
              >
                {AVAILABILITY_LABELS[person.availability_status]}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(person.id)}
          aria-label={`Remove ${person.full_name} from shortlist`}
          className="font-cabin text-xs font-medium text-slate-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
        >
          Remove
        </button>
      </div>

      {/* Row 2: Full-Width Featured Project Reminder Box */}
      <div className="mt-3.5 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-cabin text-xs text-slate-500">
            Featured project:{" "}
            <Link
              href={`/talent/${person.id}`}
              className="font-semibold text-navy hover:text-brand-green transition-colors"
            >
              {person.top_project.title}
            </Link>
          </p>
          <span className="font-cabin text-[11px] text-slate-400">
            {person.top_project.tech_stack.slice(0, 3).join(", ")}
          </span>
        </div>
        <p className="mt-1 font-mulish text-xs text-slate-600 line-clamp-2 sm:line-clamp-1">
          {person.top_project.tagline}
        </p>
      </div>

      {/* Row 3: Full-Width Optional 1-Line Note for this Candidate */}
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        {!showNoteInput ? (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="font-cabin text-xs font-medium text-brand-green hover:underline underline-offset-4 cursor-pointer"
          >
            + Add a specific note for {firstName} (optional)
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`note-${person.id}`}
                className="font-cabin text-xs font-medium text-slate-600"
              >
                Specific note for {firstName}{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              {!candidateNote.trim() && (
                <button
                  type="button"
                  onClick={() => setShowNoteInput(false)}
                  className="font-cabin text-[11px] text-slate-400 hover:text-navy cursor-pointer"
                >
                  Hide
                </button>
              )}
            </div>
            <input
              id={`note-${person.id}`}
              type="text"
              value={candidateNote}
              onChange={(e) => onUpdateNote(person.id, e.target.value)}
              placeholder={`e.g. Interested in ${firstName} for our ${TRACK_LABELS[person.track].toLowerCase()} role`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-base sm:text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition-colors"
            />
          </div>
        )}
      </div>
    </article>
  );
}
