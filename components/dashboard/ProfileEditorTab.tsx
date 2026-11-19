"use client";

import { useState } from "react";
import {
  AvailabilityStatus,
  AVAILABILITY_LABELS,
  InternAccountProfile,
  Track,
  TRACK_LABELS,
} from "@/types/talent";

interface ProfileEditorTabProps {
  profile: InternAccountProfile;
  onSaveProfile: (updated: Partial<InternAccountProfile>) => void;
  onGoToProjects: () => void;
}

interface ProfileErrors {
  full_name?: string;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  x_url?: string;
  avatar?: string;
  consent?: string;
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

const COHORT_YEARS = [2026, 2025, 2024, 2023];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileEditorTab({
  profile,
  onSaveProfile,
  onGoToProjects,
}: ProfileEditorTabProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [track, setTrack] = useState<Track>(profile.track);
  const [cohortYear, setCohortYear] = useState<number>(profile.cohort_year);
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>(profile.availability_status);
  const [bio, setBio] = useState(profile.bio);
  const [githubUrl, setGithubUrl] = useState(profile.github_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url ?? "");
  const [xUrl, setXUrl] = useState(profile.x_url ?? "");
  const [hasConsented, setHasConsented] = useState(
    Boolean(profile.consented_at)
  );

  const [openDropdown, setOpenDropdown] = useState<
    "track" | "availability" | "cohort" | null
  >(null);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [savedNotice, setSavedNotice] = useState(false);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Invalid image format. Please choose a JPG, PNG, or WebP photo.",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Photo exceeds 2 MB. Please choose a smaller image.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, avatar: undefined }));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function validate(): boolean {
    const nextErrors: ProfileErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.full_name = "Please enter your full name.";
    }

    if (!bio.trim() || bio.trim().length < 20) {
      nextErrors.bio =
        "Please write a short bio (at least 20 characters, up to 280 characters).";
    } else if (bio.trim().length > 280) {
      nextErrors.bio = "Bio must be 280 characters or fewer.";
    }

    if (githubUrl.trim() && !githubUrl.trim().startsWith("https://")) {
      nextErrors.github_url = "GitHub link must start with https://";
    }

    if (linkedinUrl.trim() && !linkedinUrl.trim().startsWith("https://")) {
      nextErrors.linkedin_url = "LinkedIn link must start with https://";
    }

    if (xUrl.trim() && !xUrl.trim().startsWith("https://")) {
      nextErrors.x_url = "X (Twitter) link must start with https://";
    }

    if (!hasConsented) {
      nextErrors.consent =
        "Please tick the consent box so NitHub can display your public profile in the directory.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent, goToProjectsAfter = false) {
    e.preventDefault();
    if (!validate()) return;

    onSaveProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      avatar_url: avatarUrl,
      track,
      cohort_year: cohortYear,
      availability_status: availabilityStatus,
      bio: bio.trim(),
      github_url: githubUrl.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      x_url: xUrl.trim() || null,
      consented_at: hasConsented
        ? profile.consented_at ?? "2026-11-19T12:00:00Z"
        : null,
    });

    if (goToProjectsAfter) {
      onGoToProjects();
      return;
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="pb-5 border-b border-slate-200">
        <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
          Public Profile &amp; Contact Settings
        </p>
        <h2 className="mt-0.5 font-cabinet font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
          Your profile &amp;{" "}
          <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
            bio
          </span>
        </h2>
        <p className="mt-1.5 font-mulish text-sm text-slate-600">
          Keep your bio and public links up to date. Your email and phone number
          remain private until you accept an employer introduction.
        </p>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="p-4 rounded-xl bg-navy text-white flex items-center gap-3 shadow-sm animate-modal-up"
        >
          <span className="w-6 h-6 rounded-full bg-brand-green text-white font-bold text-xs flex items-center justify-center shrink-0">
            ✓
          </span>
          <p className="font-mulish text-xs sm:text-sm">
            Your profile changes have been saved.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-visible"
      >
        <div className="h-1.5 w-full bg-navy rounded-t-2xl" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* 1. Avatar Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-green/30 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-navy text-white font-cabinet font-extrabold text-xl flex items-center justify-center shrink-0 ring-4 ring-brand-green/20">
                {getInitials(fullName || "Intern")}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-cabin text-xs font-semibold text-navy hover:border-brand-green cursor-pointer transition-colors">
                  <span>Upload profile photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    className="font-cabin text-xs text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
              <p className="font-mulish text-xs text-slate-500">
                JPG, PNG, or WebP up to 2 MB.
              </p>
              {errors.avatar && (
                <p className="text-xs text-red-600 font-mulish">
                  {errors.avatar}
                </p>
              )}
            </div>
          </div>

          {/* 2. Name & Private Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-name"
                className="block font-cabinet font-bold text-sm text-navy mb-1.5"
              >
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-sm text-navy focus:outline-none focus:border-brand-green focus:bg-white"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-600 font-mulish">
                  {errors.full_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block font-cabinet font-bold text-sm text-navy mb-1.5"
              >
                Phone or WhatsApp{" "}
                <span className="font-mulish font-normal text-xs text-slate-400">
                  (private)
                </span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-sm text-navy focus:outline-none focus:border-brand-green focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Custom Dropdowns for Role, Cohort Year & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Role / Track Custom Dropdown */}
            <div className="relative">
              <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                Role / Track <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "track" ? null : "track")
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  openDropdown === "track"
                    ? "border-brand-green bg-brand-green/5 text-navy"
                    : "border-slate-200 bg-slate-50 text-navy hover:border-brand-green/50"
                }`}
              >
                <span className="font-mulish text-sm truncate">
                  {TRACK_LABELS[track]}
                </span>
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
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

              {openDropdown === "track" && (
                <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                  {ROLE_ORDER.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setTrack(r);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs cursor-pointer ${
                        track === r
                          ? "bg-brand-green/10 text-brand-green font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{TRACK_LABELS[r]}</span>
                      {track === r && (
                        <span className="w-4 h-4 rounded bg-brand-green text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cohort Year Custom Dropdown */}
            <div className="relative">
              <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                Cohort year <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "cohort" ? null : "cohort")
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-left flex items-center justify-between gap-2 hover:border-brand-green/50 cursor-pointer"
              >
                <span className="font-mulish text-sm text-navy">
                  {cohortYear}
                </span>
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
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

              {openDropdown === "cohort" && (
                <div className="absolute left-0 right-0 mt-1.5 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                  {COHORT_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setCohortYear(yr);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs cursor-pointer ${
                        cohortYear === yr
                          ? "bg-brand-green/10 text-brand-green font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>Cohort {yr}</span>
                      {cohortYear === yr && (
                        <span className="w-4 h-4 rounded bg-brand-green text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Custom Dropdown */}
            <div className="relative">
              <label className="block font-cabinet font-bold text-sm text-navy mb-1.5">
                Availability <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "availability" ? null : "availability"
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-left flex items-center justify-between gap-2 hover:border-brand-green/50 cursor-pointer"
              >
                <span className="font-mulish text-sm text-navy truncate">
                  {AVAILABILITY_LABELS[availabilityStatus]}
                </span>
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
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

              {openDropdown === "availability" && (
                <div className="absolute left-0 right-0 mt-1.5 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
                  {AVAILABILITY_ORDER.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setAvailabilityStatus(status);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs cursor-pointer ${
                        availabilityStatus === status
                          ? "bg-brand-green/10 text-brand-green font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{AVAILABILITY_LABELS[status]}</span>
                      {availabilityStatus === status && (
                        <span className="w-4 h-4 rounded bg-brand-green text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="profile-bio"
                className="font-cabinet font-bold text-sm text-navy"
              >
                Short bio <span className="text-red-600">*</span>
              </label>
              <span className="font-cabin text-xs text-slate-400">
                {bio.length}/280
              </span>
            </div>
            <textarea
              id="profile-bio"
              rows={3}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write 2–3 plain-English sentences about what you build and the kind of problems you enjoy solving."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-sm text-navy focus:outline-none focus:border-brand-green focus:bg-white resize-none"
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-600 font-mulish">
                {errors.bio}
              </p>
            )}
          </div>

          {/* 5. Public Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="profile-github"
                className="block font-cabinet font-bold text-sm text-navy mb-1.5"
              >
                GitHub URL{" "}
                <span className="font-mulish font-normal text-xs text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                id="profile-github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green focus:bg-white"
              />
              {errors.github_url && (
                <p className="mt-1 text-xs text-red-600 font-mulish">
                  {errors.github_url}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-linkedin"
                className="block font-cabinet font-bold text-sm text-navy mb-1.5"
              >
                LinkedIn URL{" "}
                <span className="font-mulish font-normal text-xs text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                id="profile-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green focus:bg-white"
              />
              {errors.linkedin_url && (
                <p className="mt-1 text-xs text-red-600 font-mulish">
                  {errors.linkedin_url}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-x"
                className="block font-cabinet font-bold text-sm text-navy mb-1.5"
              >
                X / Twitter URL{" "}
                <span className="font-mulish font-normal text-xs text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                id="profile-x"
                type="url"
                value={xUrl}
                onChange={(e) => setXUrl(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green focus:bg-white"
              />
              {errors.x_url && (
                <p className="mt-1 text-xs text-red-600 font-mulish">
                  {errors.x_url}
                </p>
              )}
            </div>
          </div>

          {/* 6. Directory Consent Box */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 accent-brand-green text-brand-green focus:ring-brand-green"
              />
              <span className="font-mulish text-xs sm:text-sm text-slate-700 leading-relaxed">
                I consent to NitHub displaying my name, role, bio, public social
                links, and projects in the public Talent Directory.{" "}
                <span className="text-slate-500">
                  (Your personal email and phone number are never shown publicly
                  and are only shared when you accept an employer introduction).
                </span>
              </span>
            </label>
            {errors.consent && (
              <p className="mt-1.5 text-xs text-red-600 font-mulish">
                {errors.consent}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shadow-xs"
            >
              Save profile changes
            </button>

            {profile.projects.length === 0 && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-5 py-2.5 rounded-xl border border-brand-green text-brand-green font-cabin text-sm font-semibold hover:bg-brand-green/5 transition-colors cursor-pointer"
              >
                Save &amp; add first project →
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
