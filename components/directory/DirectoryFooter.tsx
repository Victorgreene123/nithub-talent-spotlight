"use client";

import Link from "next/link";

interface DirectoryFooterProps {
  onOpenShortlist?: () => void;
}

export function DirectoryFooter({ onOpenShortlist }: DirectoryFooterProps) {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {/* Main Horizontal Split: Brand Identity on Left, Two Audience Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-10 border-b border-white/10">
          {/* Left: NitHub Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nithub-logo.png"
                alt="NitHub"
                width={120}
                height={44}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <h2 className="font-cabinet font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug max-w-sm">
              Trained at the University of Lagos. Ready for your team.
            </h2>

            <p className="font-mulish text-xs text-slate-400 leading-relaxed max-w-sm">
              6th Floor, NitHub Building, University of Lagos, Akoka, Yaba,
              Lagos ·{" "}
              <a
                href="mailto:nithub@unilag.edu.ng"
                className="text-slate-300 underline underline-offset-4 hover:text-white transition-colors"
              >
                nithub@unilag.edu.ng
              </a>
            </p>
          </div>

          {/* Right: Two Action Cards for the Two Audiences (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: For Employers */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-between gap-5">
              <div>
                <span className="inline-block font-cabin text-xs font-semibold text-brand-green bg-brand-green/15 px-2.5 py-1 rounded-md mb-3">
                  For Employers
                </span>
                <h3 className="font-cabinet font-bold text-lg text-white">
                  Hiring for your team?
                </h3>
                <p className="mt-1.5 font-mulish text-xs text-slate-300 leading-relaxed">
                  Shortlist up to five people from the directory and send one
                  request. We’ll connect you directly.
                </p>
              </div>

              <Link
                href="/shortlist"
                className="w-full py-2.5 px-4 rounded-lg bg-brand-green text-white font-cabin text-xs font-semibold text-center hover:bg-brand-green/90 transition-colors"
              >
                Open your shortlist
              </Link>
            </div>

            {/* Card 2: For NitHub Interns */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-between gap-5">
              <div>
                <span className="inline-block font-cabin text-xs font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-md mb-3">
                  For NitHub Interns
                </span>
                <h3 className="font-cabinet font-bold text-lg text-white">
                  Part of a NitHub cohort?
                </h3>
                <p className="mt-1.5 font-mulish text-xs text-slate-300 leading-relaxed">
                  Sign in to complete your profile and showcase up to three of
                  your best projects to employers.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="flex-1 py-2.5 px-3.5 rounded-lg bg-white text-navy font-cabin text-xs font-semibold text-center hover:bg-slate-100 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 py-2.5 px-3.5 rounded-lg border border-white/20 text-white font-cabin text-xs font-medium text-center hover:bg-white/10 transition-colors"
                >
                  Create profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-mulish">
            © 2026 NitHub, University of Lagos.
          </p>

          <div className="flex flex-wrap items-center gap-6 font-cabin">
            <a
              href="https://nithub.unilag.edu.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              NitHub UNILAG ↗
            </a>
            <a
              href="mailto:nithub@unilag.edu.ng"
              className="hover:text-white transition-colors"
            >
              Contact Placement Team
            </a>
            <Link
              href="/admin/login"
              className="hover:text-white transition-colors"
            >
              Admin Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
