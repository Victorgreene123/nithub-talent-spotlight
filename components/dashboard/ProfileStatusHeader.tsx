"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AvailabilityStatus,
  AVAILABILITY_LABELS,
  InternAccountProfile,
  TRACK_LABELS,
} from "@/types/talent";

export type DashboardTab = "introductions" | "projects" | "profile";

interface ProfileStatusHeaderProps {
  profile: InternAccountProfile;
  activeTab: DashboardTab;
  pendingIntrosCount: number;
  onSelectTab: (tab: DashboardTab) => void;
  onUpdateAvailability: (status: AvailabilityStatus) => void;
}

const AVAILABILITY_ORDER: AvailabilityStatus[] = [
  "available_now",
  "open_to_gigs",
  "in_cohort",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileStatusHeader({
  profile,
  activeTab,
  pendingIntrosCount,
  onSelectTab,
  onUpdateAvailability,
}: ProfileStatusHeaderProps) {
  const [isAvailOpen, setIsAvailOpen] = useState(false);

  const isProfileComplete =
    Boolean(profile.full_name.trim()) &&
    Boolean(profile.bio.trim()) &&
    Boolean(profile.consented_at) &&
    profile.projects.length > 0;

  const profileState: "incomplete" | "pending" | "approved" =
    !isProfileComplete
      ? "incomplete"
      : profile.is_verified
      ? "approved"
      : "pending";

  return (
    <section className="bg-white border-b border-slate-200 pt-8 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Identity on Left, Status & Quick Availability Dropdown on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8">
          <div className="flex items-start sm:items-center gap-4">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-green/30 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-navy text-white font-cabinet font-extrabold text-xl flex items-center justify-center shrink-0 ring-4 ring-brand-green/20">
                {getInitials(profile.full_name || "Intern")}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-cabinet font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
                  {profile.full_name || "Welcome to NitHub Talent"}
                </h1>

                {profileState === "approved" && (
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                    Live in Directory ✓
                  </span>
                )}
                {profileState === "pending" && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-cabin text-xs font-semibold">
                    Pending NitHub Approval
                  </span>
                )}
                {profileState === "incomplete" && (
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-cabin text-xs font-semibold">
                    Setup In Progress
                  </span>
                )}
              </div>

              <p className="mt-1 font-cabin text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-navy">
                  {TRACK_LABELS[profile.track]}
                </span>
                <span className="text-slate-300">·</span>
                <span>Cohort {profile.cohort_year}</span>
                {profileState === "approved" && (
                  <>
                    <span className="text-slate-300">·</span>
                    <Link
                      href={`/talent/${profile.id}`}
                      className="text-brand-green font-semibold hover:underline underline-offset-4"
                    >
                      View my public profile ↗
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right Controls: Quick Availability Custom Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="font-cabin text-xs font-medium text-slate-500">
                  Availability:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAvailOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:border-brand-green/60 font-cabin text-xs font-semibold text-navy transition-colors cursor-pointer"
                >
                  <span
                    className={
                      profile.availability_status === "available_now"
                        ? "text-brand-green"
                        : "text-navy"
                    }
                  >
                    {AVAILABILITY_LABELS[profile.availability_status]}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      isAvailOpen ? "rotate-180 text-brand-green" : ""
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
                </button>
              </div>

              {isAvailOpen && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                  {AVAILABILITY_ORDER.map((status) => {
                    const isSelected = profile.availability_status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          onUpdateAvailability(status);
                          setIsAvailOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-brand-green/10 text-brand-green font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{AVAILABILITY_LABELS[status]}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded bg-brand-green text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Setup Helper Banner when Profile is Incomplete */}
        {profileState === "incomplete" && (
          <div className="mb-6 p-4 rounded-xl bg-brand-green/5 border border-brand-green/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-cabinet font-bold text-sm text-navy">
                Complete your profile in 2 quick steps to appear in the
                directory
              </p>
              <p className="mt-0.5 font-mulish text-xs text-slate-600">
                1. Fill in your bio and tick the directory consent box · 2. Add
                at least one shipped project.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!profile.bio.trim() || !profile.consented_at ? (
                <button
                  type="button"
                  onClick={() => onSelectTab("profile")}
                  className="px-3.5 py-2 rounded-lg bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 cursor-pointer"
                >
                  Step 1: Complete Bio →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectTab("projects")}
                  className="px-3.5 py-2 rounded-lg bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 cursor-pointer"
                >
                  Step 2: Add First Project →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          className="flex items-center gap-2 sm:gap-6 border-t border-slate-100 pt-1 overflow-x-auto no-scrollbar"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "introductions"}
            onClick={() => onSelectTab("introductions")}
            className={`py-3.5 px-2 font-cabin text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "introductions"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-600 hover:text-navy"
            }`}
          >
            <span>Employer Introductions</span>
            {pendingIntrosCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brand-green text-white text-xs font-bold">
                {pendingIntrosCount}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "projects"}
            onClick={() => onSelectTab("projects")}
            className={`py-3.5 px-2 font-cabin text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "projects"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-600 hover:text-navy"
            }`}
          >
            <span>My Projects</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
              {profile.projects.length}/3
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
            onClick={() => onSelectTab("profile")}
            className={`py-3.5 px-2 font-cabin text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-600 hover:text-navy"
            }`}
          >
            Profile &amp; Bio
          </button>
        </div>
      </div>
    </section>
  );
}
