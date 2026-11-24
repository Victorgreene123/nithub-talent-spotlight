"use client";

import Link from "next/link";

interface AdminNavbarProps {
  isAuthorizedAdmin: boolean;
  onToggleRoleTest: (isAdmin: boolean) => void;
}

export function AdminNavbar({
  isAuthorizedAdmin,
  onToggleRoleTest,
}: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-navy text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nithub-logo.png"
            alt="NitHub"
            width={110}
            height={40}
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span className="h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />
          <span className="font-cabinet font-semibold text-sm sm:text-base tracking-tight text-white/90 truncate">
            Placement Admin
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 font-cabin text-xs sm:text-sm shrink-0">
          {/* Desktop Role Gate Switcher */}
          <div className="hidden md:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => onToggleRoleTest(true)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                isAuthorizedAdmin
                  ? "bg-brand-green text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              NitHub Admin (@nithub.unilag.edu.ng)
            </button>
            <button
              type="button"
              onClick={() => onToggleRoleTest(false)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                !isAuthorizedAdmin
                  ? "bg-red-600 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Test 403 Gate (Non-Admin)
            </button>
          </div>

          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Directory ↗
          </Link>

          <Link
            href="/dashboard"
            className="text-slate-300 hover:text-white transition-colors hidden sm:inline"
          >
            Intern View
          </Link>

          <Link
            href="/admin/login"
            className="text-slate-400 hover:text-white transition-colors pl-2 border-l border-white/15"
          >
            Sign out
          </Link>
        </nav>
      </div>

      {/* Mobile Role Gate Switcher (< 768px) */}
      <div className="md:hidden bg-navy/95 border-t border-white/10 px-4 py-2 flex items-center justify-between gap-2 font-cabin text-xs">
        <span className="text-slate-400">Role gate:</span>
        <div className="flex items-center bg-white/10 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onToggleRoleTest(true)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
              isAuthorizedAdmin
                ? "bg-brand-green text-white font-semibold"
                : "text-slate-300"
            }`}
          >
            NitHub Admin
          </button>
          <button
            type="button"
            onClick={() => onToggleRoleTest(false)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
              !isAuthorizedAdmin
                ? "bg-red-600 text-white font-semibold"
                : "text-slate-300"
            }`}
          >
            Test 403 Gate
          </button>
        </div>
      </div>
    </header>
  );
}
