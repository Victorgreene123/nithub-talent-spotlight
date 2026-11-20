"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AUTH_ROLE_STORAGE_KEY = "nithub_auth_role";

function isNithubAdminEmail(email: string): boolean {
  const lower = email.trim().toLowerCase();
  return (
    lower.endsWith("@nithub.unilag.edu.ng") ||
    lower.endsWith("@nithub.ng") ||
    lower === "admin@nithub.unilag.edu.ng"
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isNithubAdminEmail(email)) {
      setError(
        "Access denied (403): Admin sign-in requires an official @nithub.unilag.edu.ng email address."
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        "Incorrect email or password. Passwords must be at least 6 characters."
      );
      return;
    }

    setIsLoading(true);
    try {
      window.sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, "admin");
    } catch {
      // Ignore storage error
    }
    router.push("/admin");
  }

  function handleQuickAdminDemo(asAdmin: boolean) {
    try {
      window.sessionStorage.setItem(
        AUTH_ROLE_STORAGE_KEY,
        asAdmin ? "admin" : "intern"
      );
    } catch {
      // Ignore storage error
    }
    router.push("/admin");
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
          NitHub Placement &amp; Directory Team
        </p>
        <h1 className="mt-1 font-cabinet font-extrabold text-3xl text-navy tracking-tight">
          Admin{" "}
          <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
            sign in
          </span>
          .
        </h1>
        <p className="mt-1.5 font-mulish text-xs sm:text-sm text-slate-600 leading-relaxed">
          Sign in with your confirmed{" "}
          <strong className="font-semibold text-navy">
            @nithub.unilag.edu.ng
          </strong>{" "}
          account to approve intern profiles and manage employer requests.
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
            htmlFor="admin-login-email"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            NitHub staff email
          </label>
          <input
            id="admin-login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="placement@nithub.unilag.edu.ng"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-mulish text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/15 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="admin-login-password"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
            className="w-full py-3 px-5 rounded-xl bg-navy text-white font-cabin text-sm font-semibold hover:bg-navy/90 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            {isLoading ? "Signing in..." : "Sign in to Placement Admin →"}
          </button>
        </div>
      </form>

      {/* Quick Demo Switcher */}
      <div className="pt-4 border-t border-slate-200 space-y-2.5">
        <p className="font-cabin text-xs font-semibold text-slate-500">
          Instant demo preview (no password needed)
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickAdminDemo(true)}
            className="p-2.5 rounded-xl border border-brand-green/35 bg-brand-green/5 hover:bg-brand-green/10 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-cabinet font-bold text-xs sm:text-sm text-navy group-hover:text-brand-green transition-colors">
                NitHub Admin
              </span>
              <span className="text-brand-green font-bold text-xs">→</span>
            </div>
            <p className="mt-0.5 font-mulish text-[11px] text-slate-500 truncate">
              @nithub.unilag.edu.ng
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAdminDemo(false)}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-cabinet font-bold text-xs sm:text-sm text-navy">
                Non-Admin (403)
              </span>
              <span className="text-slate-400 font-bold text-xs">→</span>
            </div>
            <p className="mt-0.5 font-mulish text-[11px] text-slate-500 truncate">
              Test 403 access gate
            </p>
          </button>
        </div>
      </div>

      <p className="text-center font-mulish text-xs text-slate-500">
        Are you a NitHub intern or graduate?{" "}
        <Link
          href="/login"
          className="font-cabin font-semibold text-brand-green hover:underline underline-offset-4"
        >
          Sign in at the Intern Portal
        </Link>
      </p>
    </div>
  );
}
