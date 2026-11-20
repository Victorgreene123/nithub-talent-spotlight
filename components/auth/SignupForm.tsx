"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INITIAL_NEW_INTERN } from "@/lib/mock-talent";
import { Track, TRACK_LABELS } from "@/types/talent";

const INTERN_MODE_STORAGE_KEY = "nithub_intern_demo_mode";
const INTERN_PROFILE_STORAGE_KEY = "nithub_intern_profile_new";
const AUTH_ROLE_STORAGE_KEY = "nithub_auth_role";

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

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<Track>("fullstack");
  const [isTrackDropdownOpen, setIsTrackDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Please choose a password with at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const freshProfile = {
        ...INITIAL_NEW_INTERN,
        full_name: fullName.trim(),
        email: email.trim(),
        track,
      };
      window.sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, "intern");
      window.sessionStorage.setItem(INTERN_MODE_STORAGE_KEY, "new");
      window.sessionStorage.setItem(
        INTERN_PROFILE_STORAGE_KEY,
        JSON.stringify(freshProfile)
      );
    } catch {
      // Ignore storage error
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
          Join the NitHub Directory
        </p>
        <h1 className="mt-1 font-cabinet font-extrabold text-3xl text-navy tracking-tight">
          Create your{" "}
          <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
            intern profile
          </span>
          .
        </h1>
        <p className="mt-1.5 font-mulish text-xs sm:text-sm text-slate-600 leading-relaxed">
          Showcase up to three of your shipped projects and get introduced
          directly to companies hiring from NitHub.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {error && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mulish">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="signup-name"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Adeola Olaniyan"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-mulish text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/15 transition-all"
          />
        </div>

        {/* Custom Role / Track Selector */}
        <div className="relative">
          <label className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1">
            Primary role / track
          </label>
          <button
            type="button"
            onClick={() => setIsTrackDropdownOpen((prev) => !prev)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
              isTrackDropdownOpen
                ? "border-brand-green bg-brand-green/5 text-navy"
                : "border-slate-200 bg-slate-50/70 text-navy hover:border-brand-green/50"
            }`}
          >
            <span className="font-mulish text-sm">{TRACK_LABELS[track]}</span>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isTrackDropdownOpen ? "rotate-180 text-brand-green" : ""
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

          {isTrackDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 space-y-0.5 z-30">
              {ROLE_ORDER.map((r) => {
                const isSelected = track === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setTrack(r);
                      setIsTrackDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left font-cabin text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-brand-green/10 text-brand-green font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{TRACK_LABELS[r]}</span>
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

        <div>
          <label
            htmlFor="signup-email"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-mulish text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/15 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-slate-200 bg-slate-50/70 font-mulish text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 font-cabin text-xs font-semibold text-slate-400 hover:text-navy cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            {isLoading ? "Creating account..." : "Create account & continue →"}
          </button>
        </div>
      </form>

      <p className="text-center font-mulish text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-cabin font-semibold text-brand-green hover:underline underline-offset-4"
        >
          Sign in to your workspace
        </Link>
      </p>
    </div>
  );
}
