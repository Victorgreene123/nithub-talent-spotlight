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
    <article className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 transition-shadow hover:shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {person.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.avatar_url}
              alt={person.full_name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-navy text-white font-cabinet font-bold text-base flex items-center justify-center shrink-0 ring-2 ring-brand-green/25">
              {getInitials(person.full_name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/talent/${person.id}`}
                className="font-cabinet font-bold text-lg text-navy hover:text-brand-green transition-colors"
              >
                {person.full_name}
              </Link>
              <span className="px-2 py-0.5 rounded bg-brand-green/10 text-brand-green font-cabin text-[11px] font-semibold">
                {TRACK_LABELS[person.track]}
              </span>
            </div>

            <p className="mt-0.5 font-cabin text-xs text-slate-500">
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

            {/* Reminder of their featured project */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-cabin text-xs text-slate-500">
                Featured project:{" "}
                <Link
                  href={`/talent/${person.id}`}
                  className="font-semibold text-navy hover:text-brand-green transition-colors"
                >
                  {person.top_project.title}
                </Link>
              </p>
              <p className="mt-1 font-mulish text-xs text-slate-600 line-clamp-1">
                {person.top_project.tagline}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {person.top_project.tech_stack.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-cabin text-[11px]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(person.id)}
          className="font-cabin text-xs font-medium text-slate-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
        >
          Remove
        </button>
      </div>

      {/* Optional 1-line note for this specific candidate */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
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
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition-colors"
            />
          </div>
        )}
      </div>
    </article>
  );
}
