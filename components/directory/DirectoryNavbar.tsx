"use client";

import { useState } from "react";
import Link from "next/link";

interface DirectoryNavbarProps {
  shortlistCount: number;
  onOpenShortlist?: () => void;
}

export function DirectoryNavbar({ shortlistCount }: DirectoryNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-navy text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <Link
          href="/directory"
          className="flex items-center gap-2 sm:gap-2.5 min-w-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nithub-logo.png"
            alt="NitHub"
            width={110}
            height={40}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span
            className="hidden sm:inline-block h-4 w-px bg-white/20 shrink-0"
            aria-hidden="true"
          />
          <span className="font-cabinet font-semibold text-sm sm:text-base tracking-tight text-white/90 truncate">
            Talent Spotlight
          </span>
        </Link>

        {/* Right: Actions + Mobile Menu Button */}
        <nav className="flex items-center gap-2.5 sm:gap-5 font-cabin text-sm shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-block font-medium text-slate-300 hover:text-white transition-colors"
          >
            For Interns (Sign in)
          </Link>

          <Link
            href="/shortlist"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-cabin text-xs sm:text-sm font-semibold bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
          >
            <span>Shortlist</span>
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded bg-white text-brand-green text-xs font-bold">
              {shortlistCount}
            </span>
          </Link>

          {/* Mobile Menu Toggle Button (< 640px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="sm:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Collapsible Mobile Navigation Drawer (< 640px) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-navy border-t border-white/10 px-4 pt-3 pb-4 space-y-2 font-cabin text-sm">
          <Link
            href="/directory"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-white hover:bg-white/10 font-medium"
          >
            Talent Directory
          </Link>
          <Link
            href="/shortlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-white hover:bg-white/10 font-medium"
          >
            <span>Your Shortlist</span>
            <span className="px-2 py-0.5 rounded bg-brand-green text-white text-xs font-bold">
              {shortlistCount}
            </span>
          </Link>
          <div className="pt-2 border-t border-white/10 flex items-center gap-2.5">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2.5 px-3 rounded-lg bg-white text-navy font-semibold text-center text-xs"
            >
              Intern Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2.5 px-3 rounded-lg border border-white/20 text-white font-medium text-center text-xs"
            >
              Create profile
            </Link>
          </div>
          <Link
            href="/admin/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block pt-1 text-center text-xs text-slate-400 hover:text-white"
          >
            NitHub Admin Sign in →
          </Link>
        </div>
      )}
    </header>
  );
}
