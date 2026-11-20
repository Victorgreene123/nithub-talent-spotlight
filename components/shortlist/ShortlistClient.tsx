"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TalentDirectoryItem, TRACK_LABELS } from "@/types/talent";
import { DirectoryNavbar } from "@/components/directory/DirectoryNavbar";
import { DirectoryFooter } from "@/components/directory/DirectoryFooter";
import { ShortlistHeader } from "./ShortlistHeader";
import { ShortlistedCandidateCard } from "./ShortlistedCandidateCard";
import {
  IntroductionRequestCard,
  SubmittedRequestSummary,
} from "./IntroductionRequestCard";

const SHORTLIST_STORAGE_KEY = "nithub_shortlist_ids";
const SHORTLIST_NOTES_KEY = "nithub_shortlist_notes";
const MAX_SHORTLIST = 5;

interface ShortlistClientProps {
  allTalents: TalentDirectoryItem[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ShortlistClient({ allTalents }: ShortlistClientProps) {
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [candidateNotes, setCandidateNotes] = useState<Record<string, string>>(
    {}
  );
  const [submittedSummary, setSubmittedSummary] =
    useState<SubmittedRequestSummary | null>(null);

  useEffect(() => {
    try {
      const savedIds = window.sessionStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (savedIds) {
        const parsed = JSON.parse(savedIds);
        if (Array.isArray(parsed)) {
          setShortlistedIds(parsed.slice(0, MAX_SHORTLIST));
        }
      }

      const savedNotes = window.sessionStorage.getItem(SHORTLIST_NOTES_KEY);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (parsedNotes && typeof parsedNotes === "object") {
          setCandidateNotes(parsedNotes);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  function saveShortlist(nextIds: string[]) {
    setShortlistedIds(nextIds);
    try {
      window.sessionStorage.setItem(
        SHORTLIST_STORAGE_KEY,
        JSON.stringify(nextIds)
      );
    } catch {
      // Ignore storage errors
    }
  }

  function handleUpdateCandidateNote(id: string, note: string) {
    const next = { ...candidateNotes, [id]: note };
    setCandidateNotes(next);
    try {
      window.sessionStorage.setItem(SHORTLIST_NOTES_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }

  function handleRemoveCandidate(id: string) {
    saveShortlist(shortlistedIds.filter((item) => item !== id));
  }

  function handleClearAll() {
    saveShortlist([]);
    setCandidateNotes({});
    try {
      window.sessionStorage.removeItem(SHORTLIST_NOTES_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  function handleFormSuccess(summary: SubmittedRequestSummary) {
    handleClearAll();
    setSubmittedSummary(summary);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToForm() {
    const el = document.getElementById("introduction-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const shortlistedPeople = useMemo(() => {
    return shortlistedIds
      .map((id) => allTalents.find((t) => t.id === id))
      .filter((t): t is TalentDirectoryItem => Boolean(t));
  }, [shortlistedIds, allTalents]);

  const spotsRemaining = MAX_SHORTLIST - shortlistedPeople.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-navy">
      <DirectoryNavbar
        shortlistCount={shortlistedPeople.length}
        onOpenShortlist={() => {}}
      />

      {!submittedSummary && <ShortlistHeader />}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-16 sm:pb-20">
        {submittedSummary ? (
          /* Animated Request Received Confirmation Card */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-modal-up">
            {/* Deep Navy Hero Top Banner with Animated Checkmark */}
            <div className="bg-navy text-white px-5 py-8 sm:px-10 sm:py-10 text-center">
              <div className="relative w-15 h-15 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-brand-green/35 animate-soft-ripple"
                />
                <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-brand-green text-white flex items-center justify-center shadow-md animate-check-pop">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      className="animate-check-stroke"
                    />
                  </svg>
                </div>
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-brand-green/20 text-brand-green-light font-cabin text-xs font-semibold tracking-wide uppercase">
                Introduction Request Sent
              </span>

              <h1 className="mt-2.5 font-cabinet font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                We’re connecting you, {submittedSummary.companyName}!
              </h1>

              <p className="mt-2 font-mulish text-xs sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                Our placement team at NitHub has received your request for{" "}
                <strong className="text-white font-semibold">
                  {submittedSummary.engagementType.toLowerCase()}
                </strong>{" "}
                and will follow up at{" "}
                <strong className="text-white font-semibold underline decoration-brand-green-light/60 underline-offset-4 break-all">
                  {submittedSummary.contactEmail}
                </strong>
                .
              </p>
            </div>

            {/* Body: Requested Candidates & Next Steps */}
            <div className="p-5 sm:p-9 space-y-6 sm:space-y-7">
              {/* Candidates Included */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-cabinet font-bold text-base sm:text-lg text-navy">
                    Shortlisted talent in this request
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                    {submittedSummary.candidates.length}{" "}
                    {submittedSummary.candidates.length === 1
                      ? "candidate"
                      : "candidates"}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {submittedSummary.candidates.map((person) => {
                    const specificNote =
                      submittedSummary.candidateNotes[person.id];
                    return (
                      <li
                        key={person.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white font-cabinet font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-brand-green/25">
                            {getInitials(person.full_name)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/talent/${person.id}`}
                              className="font-cabinet font-bold text-sm sm:text-base text-navy hover:text-brand-green transition-colors block truncate"
                            >
                              {person.full_name}
                            </Link>
                            <p className="font-cabin text-xs text-slate-500 truncate">
                              {TRACK_LABELS[person.track]} ·{" "}
                              {person.top_project.title}
                            </p>
                            {specificNote && (
                              <p className="mt-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mulish text-xs text-slate-600">
                                Note: “{specificNote}”
                              </p>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/talent/${person.id}`}
                          className="font-cabin text-xs font-semibold text-brand-green hover:underline underline-offset-4 shrink-0 mt-1"
                        >
                          Profile →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* What happens next */}
              <div className="rounded-xl bg-brand-green/5 border border-brand-green/20 p-4 sm:p-5">
                <h3 className="font-cabinet font-bold text-sm text-navy mb-2.5">
                  What happens next?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mulish text-xs text-slate-600 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-green text-white font-cabin text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong className="font-semibold text-navy">
                        Review &amp; verification:
                      </strong>{" "}
                      The NitHub placement team confirms availability with your
                      selected talent.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-green text-white font-cabin text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      <strong className="font-semibold text-navy">
                        Direct email intro:
                      </strong>{" "}
                      You receive a warm email thread connecting you directly to
                      schedule interviews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/directory"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold text-center hover:bg-brand-green/90 transition-colors shadow-xs"
                >
                  Browse more talent in directory
                </Link>

                <button
                  type="button"
                  onClick={() => setSubmittedSummary(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-cabin text-xs font-semibold text-slate-500 hover:text-navy underline underline-offset-4 cursor-pointer"
                >
                  Start another shortlist
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column Split Workspace */
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
            {/* Mobile Quick-Jump Banner (only on < 1024px when candidates are selected) */}
            {shortlistedPeople.length > 0 && (
              <div className="lg:hidden rounded-xl bg-navy text-white p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex -space-x-2 shrink-0">
                    {shortlistedPeople.map((person) => (
                      <div
                        key={person.id}
                        className="w-7 h-7 rounded-full bg-brand-green border-2 border-navy text-white font-cabinet text-[11px] font-bold flex items-center justify-center"
                      >
                        {getInitials(person.full_name)}
                      </div>
                    ))}
                  </div>
                  <span className="font-cabin text-xs font-medium text-slate-200 truncate">
                    {shortlistedPeople.length} of {MAX_SHORTLIST} selected
                  </span>
                </div>

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-3.5 py-2 rounded-lg bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 transition-colors shrink-0 cursor-pointer"
                >
                  Fill request form ↓
                </button>
              </div>
            )}

            {/* Left Column: Selected Candidates (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-cabinet font-bold text-lg sm:text-2xl text-navy">
                    Selected Candidates ({shortlistedPeople.length} of{" "}
                    {MAX_SHORTLIST})
                  </h2>
                  <p className="font-mulish text-xs sm:text-sm text-slate-500">
                    You can optionally add a specific 1-line note under any
                    candidate.
                  </p>
                </div>

                {shortlistedPeople.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="font-cabin text-xs font-semibold text-slate-500 hover:text-red-600 underline underline-offset-4 cursor-pointer shrink-0"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {shortlistedPeople.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-10 text-center space-y-4">
                  <h3 className="font-cabinet font-bold text-xl text-navy">
                    Your shortlist is currently empty
                  </h3>
                  <p className="font-mulish text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Browse the directory and click{" "}
                    <strong className="font-semibold text-brand-green">
                      + Shortlist
                    </strong>{" "}
                    on up to 5 interns or graduates you’d like to meet.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/directory"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 transition-colors"
                    >
                      Browse Talent Directory
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 sm:space-y-4">
                  {shortlistedPeople.map((person) => (
                    <ShortlistedCandidateCard
                      key={person.id}
                      person={person}
                      candidateNote={candidateNotes[person.id] ?? ""}
                      onUpdateNote={handleUpdateCandidateNote}
                      onRemove={handleRemoveCandidate}
                    />
                  ))}

                  {spotsRemaining > 0 && (
                    <Link
                      href="/directory"
                      className="block rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-green bg-white/50 hover:bg-brand-green/5 p-3.5 sm:p-4 text-center transition-colors"
                    >
                      <span className="font-cabin text-xs sm:text-sm font-semibold text-brand-green">
                        + Add another candidate from the directory (
                        {spotsRemaining}{" "}
                        {spotsRemaining === 1 ? "spot" : "spots"} left)
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Introduction Request Form (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <IntroductionRequestCard
                shortlistedPeople={shortlistedPeople}
                candidateNotes={candidateNotes}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        )}
      </main>

      <DirectoryFooter />
    </div>
  );
}
