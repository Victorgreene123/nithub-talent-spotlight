"use client";

import Link from "next/link";

interface AuthSplitLayoutProps {
  mode: "login" | "signup" | "admin";
  children: React.ReactNode;
}

export function AuthSplitLayout({ mode, children }: AuthSplitLayoutProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white text-navy">
      {/* Left Column: Photographic Human Backdrop with Deep Navy Editorial Overlay */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 h-full flex-col justify-between p-8 xl:p-12 bg-navy text-white overflow-hidden">
        {/* Real Workspace Photograph */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/auth-workspace.jpg"
          alt="Builders collaborating at NitHub"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Rich Deep Navy Gradient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/45"
        />

        {/* Top: Official NitHub Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/directory" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nithub-logo.png"
              alt="NitHub"
              width={116}
              height={42}
              className="h-8 w-auto object-contain"
            />
            <span className="h-4 w-px bg-white/25" aria-hidden="true" />
            <span className="font-cabinet font-semibold text-base tracking-tight text-white/95">
              {mode === "admin" ? "Placement Admin" : "Talent Spotlight"}
            </span>
          </Link>
        </div>

        {/* Bottom: Grounded Human Story & Quote */}
        <div className="relative z-10 max-w-lg space-y-5">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-brand-green text-white font-cabin text-xs font-semibold tracking-wide">
              NitHub · University of Lagos
            </span>

            <h2 className="mt-3 font-cabinet font-extrabold text-2xl xl:text-3xl text-white tracking-tight leading-[1.18]">
              {mode === "admin"
                ? "Verify cohort work and connect employers with our builders."
                : mode === "login"
                ? "Your shipped work and employer introductions, in one place."
                : "Let the projects you’ve built open the door to your next role."}
            </h2>

            <p className="mt-2 font-mulish text-xs xl:text-sm text-slate-200 leading-relaxed">
              {mode === "admin"
                ? "Review pending intern profiles, audit live project links, and forward employer introduction requests to shortlisted talent."
                : mode === "login"
                ? "Sign in to review introduction requests from hiring teams, update your availability, or add new work from your cohort."
                : "Create your profile in under five minutes, showcase up to three real projects, and connect directly with companies hiring from NitHub."}
            </p>
          </div>

          {/* Warm Human Testimonial / Community Note */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-green text-white font-cabinet font-bold text-xs flex items-center justify-center shrink-0">
                {mode === "admin" ? "NH" : "AO"}
              </div>
              <div>
                <p className="font-cabinet font-bold text-sm text-white">
                  {mode === "admin"
                    ? "NitHub Placement Office"
                    : "Adeola Olaniyan"}
                </p>
                <p className="font-cabin text-xs text-slate-300">
                  {mode === "admin"
                    ? "6th Floor, NitHub Building · University of Lagos"
                    : "Fullstack Cohort ’25 · Matched via NitHub Talent"}
                </p>
              </div>
            </div>

            <span className="font-cabin text-xs text-slate-300 hidden xl:inline">
              Akoka, Yaba · Lagos
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean, Fixed-Height White Form Canvas */}
      <div className="lg:col-span-7 xl:col-span-6 h-full overflow-hidden flex flex-col justify-between px-6 py-5 sm:px-10 sm:py-6 xl:px-14 xl:py-8 bg-white">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <Link
              href="/directory"
              className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nithub-logo.png"
                alt="NitHub"
                width={84}
                height={30}
                className="h-5 w-auto object-contain"
              />
            </Link>

            <Link
              href="/directory"
              className="font-cabin text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-green transition-colors"
            >
              ← Back to Talent Directory
            </Link>
          </div>

          <div className="font-cabin text-xs sm:text-sm text-slate-600">
            {mode === "admin" ? (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-navy hover:border-brand-green hover:text-brand-green transition-colors"
              >
                Intern Sign in
              </Link>
            ) : mode === "login" ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500">
                  New to NitHub Talent?
                </span>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-navy hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Create profile
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500">
                  Already have a profile?
                </span>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-navy hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Center Form Container (Vertically centered, fits 100vh cleanly) */}
        <div className="w-full max-w-[400px] mx-auto my-auto">
          {children}
        </div>

        {/* Quiet Bottom Privacy Note */}
        <div className="shrink-0 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mulish">
          <p>© 2026 NitHub, University of Lagos.</p>
          {mode === "admin" ? (
            <p>Restricted to confirmed @nithub.unilag.edu.ng staff.</p>
          ) : (
            <Link
              href="/admin/login"
              className="font-cabin text-slate-400 hover:text-navy transition-colors"
            >
              NitHub Admin Sign in →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
