"use client";

import { useState } from "react";
import {
  AvailabilityStatus,
  AVAILABILITY_LABELS,
  Track,
  TRACK_LABELS,
} from "@/types/talent";

interface FilterBarProps {
  selectedRoles: Track[];
  selectedStacks: string[];
  selectedAvailabilities: AvailabilityStatus[];
  availableStackTags: string[];
  totalResults: number;
  onApplyFilters: (
    roles: Track[],
    stacks: string[],
    availabilities: AvailabilityStatus[]
  ) => void;
  onToggleRole: (role: Track) => void;
  onToggleStack: (stack: string) => void;
  onToggleAvailability: (availability: AvailabilityStatus) => void;
  onClearAll: () => void;
}

const ROLE_ORDER: Track[] = [
  "frontend",
  "backend",
  "fullstack",
  "uiux",
  "mobile",
  "aiml",
  "hardware",
  "pm",
];

const AVAILABILITY_ORDER: AvailabilityStatus[] = [
  "available_now",
  "open_to_gigs",
  "in_cohort",
];

type OpenSelectKey = "role" | "availability" | "stack" | null;

export function FilterBar({
  selectedRoles,
  selectedStacks,
  selectedAvailabilities,
  availableStackTags,
  totalResults,
  onApplyFilters,
  onToggleRole,
  onToggleStack,
  onToggleAvailability,
  onClearAll,
}: FilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState<OpenSelectKey>(null);

  // Draft state inside the popup modal before user clicks "Apply filters"
  const [draftRoles, setDraftRoles] = useState<Track[]>([]);
  const [draftStacks, setDraftStacks] = useState<string[]>([]);
  const [draftAvailabilities, setDraftAvailabilities] = useState<
    AvailabilityStatus[]
  >([]);

  const activeFilterCount =
    selectedRoles.length +
    selectedStacks.length +
    selectedAvailabilities.length;

  const draftFilterCount =
    draftRoles.length + draftStacks.length + draftAvailabilities.length;

  function handleOpenModal() {
    setDraftRoles(selectedRoles);
    setDraftStacks(selectedStacks);
    setDraftAvailabilities(selectedAvailabilities);
    setOpenSelect(null);
    setIsModalOpen(true);
  }

  function toggleDraftRole(role: Track) {
    setDraftRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function toggleDraftAvailability(status: AvailabilityStatus) {
    setDraftAvailabilities((prev) =>
      prev.includes(status)
        ? prev.filter((a) => a !== status)
        : [...prev, status]
    );
  }

  function toggleDraftStack(tag: string) {
    setDraftStacks((prev) => {
      const exists = prev.some((s) => s.toLowerCase() === tag.toLowerCase());
      return exists
        ? prev.filter((s) => s.toLowerCase() !== tag.toLowerCase())
        : [...prev, tag];
    });
  }

  function handleResetDraft() {
    setDraftRoles([]);
    setDraftStacks([]);
    setDraftAvailabilities([]);
    setOpenSelect(null);
  }

  function handleApply() {
    onApplyFilters(draftRoles, draftStacks, draftAvailabilities);
    setOpenSelect(null);
    setIsModalOpen(false);
  }

  const roleSummary =
    draftRoles.length === 0
      ? "All roles"
      : draftRoles.map((r) => TRACK_LABELS[r]).join(", ");

  const availabilitySummary =
    draftAvailabilities.length === 0
      ? "Any availability"
      : draftAvailabilities.map((a) => AVAILABILITY_LABELS[a]).join(", ");

  const stackSummary =
    draftStacks.length === 0 ? "Any skill or tool" : draftStacks.join(", ");

  return (
    <>
      {/* Main Page Section Heading & Filter Bar */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Left: Heading & Subtext */}
          <div>
            <h2 className="font-cabin font-extrabold text-3xl sm:text-4xl lg:text-[35px] leading-[1.14] tracking-tight text-navy">
              Featured{" "}
              <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
                Projects &amp; Talent
              </span>
            </h2>
            <p className="mt-3 font-mulish text-base sm:text-lg text-slate-600 leading-relaxed">
              Showing{" "}
              <strong className="font-semibold text-navy">
                {totalResults}
              </strong>{" "}
              {totalResults === 1
                ? "verified profile"
                : "verified profiles"}{" "}
              from NitHub cohorts
            </p>
          </div>

          {/* Right: Filter Controls */}
          <div className="flex items-center gap-3 self-start sm:self-end">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2.5 py-2 font-cabin text-xs font-semibold text-slate-500 hover:text-navy underline underline-offset-4 cursor-pointer"
              >
                Reset ({activeFilterCount})
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenModal}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-cabin text-sm font-semibold border transition-all cursor-pointer shadow-2xs ${activeFilterCount > 0
                ? "border-brand-green bg-brand-green text-white hover:bg-brand-green/90"
                : "border-slate-300 text-navy bg-white hover:border-brand-green hover:text-brand-green"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filter talent</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded bg-white text-brand-green text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Summary Line (when filters are applied) */}
        {activeFilterCount > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-cabin">
            <span className="text-slate-500">Active filters:</span>

            {selectedRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onToggleRole(role)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-green/10 text-brand-green font-semibold hover:bg-brand-green/20 cursor-pointer"
              >
                <span>{TRACK_LABELS[role]}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}

            {selectedAvailabilities.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onToggleAvailability(status)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-green/10 text-brand-green font-semibold hover:bg-brand-green/20 cursor-pointer"
              >
                <span>{AVAILABILITY_LABELS[status]}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}

            {selectedStacks.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => onToggleStack(stack)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-green/10 text-brand-green font-semibold hover:bg-brand-green/20 cursor-pointer"
              >
                <span>{stack}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Popup Modal with Navy Header & Custom Dropdowns */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-navy/50 backdrop-blur-[1px] transition-opacity"
          />

          {/* Compact Popup Box */}
          <div
            style={{ width: "100%", maxWidth: "420px" }}
            className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-visible flex flex-col animate-modal-up"
          >
            {/* Deep Navy Top Header Section */}
            <div className="bg-navy text-white px-6 py-5 rounded-t-2xl flex items-start justify-between">
              <div>
                <p className="font-cabin text-[11px] font-semibold uppercase tracking-wider text-brand-green-light">
                  Filter Directory
                </p>
                <h2
                  id="filter-modal-title"
                  className="font-cabinet font-extrabold text-2xl text-white tracking-tight mt-0.5"
                >
                  Find the right talent
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close filter popup"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body: Three Custom Dropdown Selectors */}
            <div className="px-6 py-5 space-y-4">
              {/* 1. Custom Role Dropdown */}
              <div className="relative">
                <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                  Role / Track
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSelect(openSelect === "role" ? null : "role")
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${openSelect === "role" || draftRoles.length > 0
                    ? "border-brand-green bg-brand-green/5 text-navy"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-green/50"
                    }`}
                >
                  <span className="font-mulish text-sm truncate">
                    {roleSummary}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {draftRoles.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-green text-white font-cabin text-[11px] font-bold">
                        {draftRoles.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${openSelect === "role"
                        ? "rotate-180 text-brand-green"
                        : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {openSelect === "role" && (
                  <div className="mt-1.5 w-full max-h-52 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                    {ROLE_ORDER.map((role) => {
                      const isSelected = draftRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleDraftRole(role)}
                          className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs transition-colors cursor-pointer ${isSelected
                            ? "bg-brand-green/10 text-brand-green font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <span>{TRACK_LABELS[role]}</span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${isSelected
                              ? "bg-brand-green border-brand-green text-white"
                              : "border-slate-300 bg-white"
                              }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Custom Availability Dropdown */}
              <div className="relative">
                <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                  Availability
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSelect(
                      openSelect === "availability" ? null : "availability"
                    )
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${openSelect === "availability" ||
                    draftAvailabilities.length > 0
                    ? "border-brand-green bg-brand-green/5 text-navy"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-green/50"
                    }`}
                >
                  <span className="font-mulish text-sm truncate">
                    {availabilitySummary}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {draftAvailabilities.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-green text-white font-cabin text-[11px] font-bold">
                        {draftAvailabilities.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${openSelect === "availability"
                        ? "rotate-180 text-brand-green"
                        : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {openSelect === "availability" && (
                  <div className="mt-1.5 w-full rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                    {AVAILABILITY_ORDER.map((status) => {
                      const isSelected = draftAvailabilities.includes(status);
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleDraftAvailability(status)}
                          className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs transition-colors cursor-pointer ${isSelected
                            ? "bg-brand-green/10 text-brand-green font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <span>{AVAILABILITY_LABELS[status]}</span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${isSelected
                              ? "bg-brand-green border-brand-green text-white"
                              : "border-slate-300 bg-white"
                              }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Custom Skills & Tools Dropdown */}
              <div className="relative">
                <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                  Skills &amp; Tools
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSelect(openSelect === "stack" ? null : "stack")
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${openSelect === "stack" || draftStacks.length > 0
                    ? "border-brand-green bg-brand-green/5 text-navy"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-green/50"
                    }`}
                >
                  <span className="font-mulish text-sm truncate">
                    {stackSummary}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {draftStacks.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-green text-white font-cabin text-[11px] font-bold">
                        {draftStacks.length}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${openSelect === "stack"
                        ? "rotate-180 text-brand-green"
                        : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {openSelect === "stack" && (
                  <div className="mt-1.5 w-full max-h-48 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                    {availableStackTags.map((tag) => {
                      const isSelected = draftStacks.some(
                        (s) => s.toLowerCase() === tag.toLowerCase()
                      );
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleDraftStack(tag)}
                          className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs transition-colors cursor-pointer ${isSelected
                            ? "bg-brand-green/10 text-brand-green font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <span>{tag}</span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${isSelected
                              ? "bg-brand-green border-brand-green text-white"
                              : "border-slate-300 bg-white"
                              }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetDraft}
                disabled={draftFilterCount === 0}
                className="font-cabin text-xs font-semibold text-slate-500 hover:text-brand-green disabled:opacity-40 underline underline-offset-4 cursor-pointer disabled:cursor-default"
              >
                Reset all
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl font-cabin text-xs font-semibold text-slate-600 hover:text-navy cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shadow-xs"
                >
                  Apply filters
                  {draftFilterCount > 0 ? ` (${draftFilterCount})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
