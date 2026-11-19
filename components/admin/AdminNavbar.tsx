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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
              Placement Admin
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-3 sm:gap-5 font-cabin text-xs sm:text-sm">
          {/* Demo Role Gate Switcher (to verify Acceptance Criteria #2: 403 for non-admin accounts) */}
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
            href="/directory"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Public Directory ↗
          </Link>

          <Link
            href="/dashboard"
            className="text-slate-300 hover:text-white transition-colors hidden sm:inline"
          >
            Intern View
          </Link>
        </nav>
      </div>
    </header>
  );
}
