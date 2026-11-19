"use client";

import Link from "next/link";

interface InternNavbarProps {
  fullName: string;
  demoMode: "returning" | "new";
  onSwitchDemoMode: (mode: "returning" | "new") => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function InternNavbar({
  fullName,
  demoMode,
  onSwitchDemoMode,
}: InternNavbarProps) {
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
              Intern Workspace
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-3 sm:gap-5 font-cabin text-xs sm:text-sm">
          {/* Quick Demo Switcher between Returning Intern & First-Time Onboarding */}
          <div className="hidden md:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => onSwitchDemoMode("returning")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                demoMode === "returning"
                  ? "bg-brand-green text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Returning Intern
            </button>
            <button
              type="button"
              onClick={() => onSwitchDemoMode("new")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                demoMode === "new"
                  ? "bg-brand-green text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              New Intern Setup
            </button>
          </div>

          <Link
            href="/directory"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Directory
          </Link>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/15">
            <div className="w-8 h-8 rounded-full bg-brand-green text-white font-cabinet font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(fullName || "Intern")}
            </div>
            <span className="hidden sm:inline font-medium text-white truncate max-w-[140px]">
              {fullName || "Intern"}
            </span>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white text-xs ml-1 transition-colors"
            >
              Sign out
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
