"use client";

import Link from "next/link";

interface AdminForbiddenViewProps {
  onRestoreAdmin: () => void;
}

export function AdminForbiddenView({
  onRestoreAdmin,
}: AdminForbiddenViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-center">
        <div className="h-1.5 w-full bg-red-600" />
        <div className="p-8 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-cabin text-xs font-semibold uppercase tracking-wider">
            403 · Access Restricted
          </span>

          <h1 className="font-cabinet font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
            Admin access requires a confirmed NitHub email
          </h1>

          <p className="font-mulish text-sm text-slate-600 leading-relaxed">
            Only confirmed accounts with an official{" "}
            <strong className="font-semibold text-navy">
              @nithub.unilag.edu.ng
            </strong>{" "}
            address can review pending profiles or read employer hiring
            requests.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRestoreAdmin}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer"
            >
              Switch back to NitHub Admin
            </button>

            <Link
              href="/directory"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-navy font-cabin text-xs sm:text-sm font-semibold hover:border-navy transition-colors"
            >
              Go to Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
