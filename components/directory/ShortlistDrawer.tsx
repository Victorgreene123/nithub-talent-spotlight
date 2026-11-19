"use client";

import { useState } from "react";
import Link from "next/link";
import { TalentDirectoryItem, TRACK_LABELS } from "@/types/talent";
import { HiringRequestForm } from "./HiringRequestForm";

interface ShortlistDrawerProps {
  isOpen: boolean;
  shortlistedPeople: TalentDirectoryItem[];
  limitMessage: string | null;
  onOpen: () => void;
  onClose: () => void;
  onRemovePerson: (id: string) => void;
  onClearAll: () => void;
  onDismissLimitMessage: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ShortlistDrawer({
  isOpen,
  shortlistedPeople,
  limitMessage,
  onOpen,
  onClose,
  onRemovePerson,
  onClearAll,
  onDismissLimitMessage,
}: ShortlistDrawerProps) {
  const [step, setStep] = useState<"list" | "form" | "submitted">("list");

  function handleCloseDrawer() {
    onClose();
    if (step === "submitted") {
      setStep("list");
    }
  }

  function handleFormSuccess() {
    onClearAll();
    setStep("submitted");
  }

  return (
    <>
      {/* Toast when user tries to add a 6th person */}
      {limitMessage && (
        <div
          role="status"
          className="fixed bottom-20 right-4 sm:right-6 z-40 max-w-sm bg-navy text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3"
        >
          <p className="font-mulish text-xs leading-relaxed">{limitMessage}</p>
          <button
            type="button"
            onClick={onDismissLimitMessage}
            className="text-white/70 hover:text-white font-cabin text-xs shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Floating Bottom Bar when 1–5 people are shortlisted and drawer is closed */}
      {shortlistedPeople.length > 0 && !isOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-30">
          <div className="bg-navy text-white rounded-xl shadow-xl px-4 py-3 sm:px-5 flex items-center justify-between gap-5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {shortlistedPeople.map((person) => (
                  <div
                    key={person.id}
                    title={person.full_name}
                    className="w-8 h-8 rounded-full bg-slate-700 border-2 border-navy text-white font-cabinet text-xs font-semibold flex items-center justify-center"
                  >
                    {getInitials(person.full_name)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-cabin text-xs font-medium text-white">
                  {shortlistedPeople.length} of 5 shortlisted
                </p>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="font-mulish text-[11px] text-slate-300 hover:text-white underline underline-offset-2 cursor-pointer"
                >
                  Clear list
                </button>
              </div>
            </div>

            <Link
              href="/shortlist"
              className="px-4 py-2 rounded-lg bg-brand-green text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-brand-green/90 transition-colors shrink-0"
            >
              Request introduction →
            </Link>
          </div>
        </div>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-labelledby="shortlist-drawer-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-navy/40 transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2
                    id="shortlist-drawer-title"
                    className="font-cabinet font-bold text-xl text-navy"
                  >
                    {step === "submitted"
                      ? "Request sent"
                      : step === "form"
                      ? "Request an introduction"
                      : `Your shortlist (${shortlistedPeople.length}/5)`}
                  </h2>
                  {step !== "submitted" && (
                    <p className="mt-0.5 font-mulish text-xs text-slate-500">
                      Select up to 5 people and we’ll connect you directly.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  aria-label="Close shortlist drawer"
                  className="p-2 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {step === "submitted" ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green mx-auto flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <h3 className="font-cabinet font-bold text-2xl text-navy">
                      We’ve received your request
                    </h3>
                    <p className="font-mulish text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                      Thank you for reaching out. The NitHub team has been
                      notified and will follow up with you by email to arrange
                      introductions.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleCloseDrawer}
                        className="px-5 py-2.5 rounded-lg bg-navy text-white font-cabin text-sm font-medium hover:bg-navy/90 cursor-pointer"
                      >
                        Back to directory
                      </button>
                    </div>
                  </div>
                ) : shortlistedPeople.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-cabinet font-semibold text-lg text-navy">
                      Your shortlist is empty
                    </p>
                    <p className="mt-1.5 font-mulish text-sm text-slate-500 max-w-xs mx-auto">
                      Browse the directory and click “+ Shortlist” on up to 5
                      people you’d like to meet.
                    </p>
                  </div>
                ) : step === "list" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-cabin text-xs font-medium text-slate-500">
                        Selected talent
                      </span>
                      <button
                        type="button"
                        onClick={onClearAll}
                        className="font-cabin text-xs text-slate-500 hover:text-navy underline underline-offset-2 cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>

                    <ul className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {shortlistedPeople.map((person) => (
                        <li
                          key={person.id}
                          className="p-3.5 bg-white flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-navy text-white font-cabinet font-semibold text-xs flex items-center justify-center shrink-0">
                              {getInitials(person.full_name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-cabinet font-bold text-sm text-navy truncate">
                                {person.full_name}
                              </p>
                              <p className="font-mulish text-xs text-slate-500 truncate">
                                {TRACK_LABELS[person.track]} ·{" "}
                                {person.top_project.title}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemovePerson(person.id)}
                            className="font-cabin text-xs text-slate-400 hover:text-red-600 px-2 py-1 cursor-pointer shrink-0"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Compact pill summary of who they are requesting */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="font-cabin text-xs text-slate-500 mb-2">
                        Requesting an introduction to:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {shortlistedPeople.map((person) => (
                          <span
                            key={person.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 font-cabin text-xs text-navy"
                          >
                            {person.full_name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <HiringRequestForm
                      shortlistedPeople={shortlistedPeople}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setStep("list")}
                    />
                  </div>
                )}
              </div>

              {/* Drawer Footer (only on the 'list' step when people are selected) */}
              {step === "list" && shortlistedPeople.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="w-full py-3 px-4 rounded-xl bg-brand-green text-white font-cabin text-sm font-medium hover:bg-brand-green/90 transition-colors cursor-pointer"
                  >
                    Continue to introduction details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
