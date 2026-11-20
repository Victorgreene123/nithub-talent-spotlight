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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/directory" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
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
            Intern Workspace
          </span>
        </Link>

        <nav className="flex items-center gap-2.5 sm:gap-5 font-cabin text-xs sm:text-sm shrink-0">
          {/* Desktop Demo Switcher */}
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

          <div className="flex items-center gap-2 pl-2 border-l border-white/15">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white font-cabinet font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(fullName || "Intern")}
            </div>
            <span className="hidden sm:inline font-medium text-white truncate max-w-[140px]">
              {fullName || "Intern"}
            </span>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white text-xs transition-colors"
            >
              Sign out
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Demo Switcher Strip (< 768px) */}
      <div className="md:hidden bg-navy/95 border-t border-white/10 px-4 py-2 flex items-center justify-between gap-2 font-cabin text-xs">
        <span className="text-slate-400">Preview:</span>
        <div className="flex items-center bg-white/10 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onSwitchDemoMode("returning")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
              demoMode === "returning"
                ? "bg-brand-green text-white font-semibold"
                : "text-slate-300"
            }`}
          >
            Returning Intern
          </button>
          <button
            type="button"
            onClick={() => onSwitchDemoMode("new")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
              demoMode === "new"
                ? "bg-brand-green text-white font-semibold"
                : "text-slate-300"
            }`}
          >
            New Intern Setup
          </button>
        </div>
      </div>
    </header>
  );
}
