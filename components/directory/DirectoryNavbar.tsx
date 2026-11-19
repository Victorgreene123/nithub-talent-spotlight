"use client";

import Link from "next/link";

interface DirectoryNavbarProps {
  shortlistCount: number;
  onOpenShortlist?: () => void;
}

export function DirectoryNavbar({ shortlistCount }: DirectoryNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-navy text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/directory" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nithub-logo.png"
              alt="NitHub"
              width={110}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <span className="h-4 w-px bg-white/20" aria-hidden="true" />
            <span className="font-cabinet font-semibold text-base tracking-tight text-white/90">
              Talent Spotlight
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6 font-cabin text-sm">
          <Link
            href="/login"
            className="font-medium text-slate-300 hover:text-white transition-colors"
          >
            For Interns (Sign in)
          </Link>

          <Link
            href="/shortlist"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-cabin font-semibold bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
          >
            <span>Shortlist</span>
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded bg-white text-brand-green text-xs font-bold">
              {shortlistCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
