"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const INTERN_MODE_STORAGE_KEY = "nithub_intern_demo_mode";
const AUTH_ROLE_STORAGE_KEY = "nithub_auth_role";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
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
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }
      }

      window.sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, "intern");
      window.sessionStorage.setItem(INTERN_MODE_STORAGE_KEY, "returning");
    } catch {
      // Ignore storage error
    }
    router.push("/dashboard");
  }

  function handleQuickDemo(mode: "returning" | "new") {
    try {
      window.sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, "intern");
      window.sessionStorage.setItem(INTERN_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage error
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
          Intern &amp; Graduate Workspace
        </p>
        <h1 className="mt-1 font-cabinet font-extrabold text-3xl text-navy tracking-tight">
          Welcome{" "}
          <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
            back
          </span>
          .
        </h1>
        <p className="mt-1.5 font-mulish text-xs sm:text-sm text-slate-600 leading-relaxed">
          Sign in to check employer introductions, update your availability, or
          manage your projects.
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
            htmlFor="login-email"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-mulish text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/15 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block font-cabinet font-bold text-xs sm:text-sm text-navy mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
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
            className="w-full py-3 px-5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            {isLoading ? "Signing in..." : "Sign in to workspace →"}
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
            onClick={() => handleQuickDemo("returning")}
            className="p-2.5 rounded-xl border border-brand-green/35 bg-brand-green/5 hover:bg-brand-green/10 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-cabinet font-bold text-xs sm:text-sm text-navy group-hover:text-brand-green transition-colors">
                Returning Intern
              </span>
              <span className="text-brand-green font-bold text-xs">→</span>
            </div>
            <p className="mt-0.5 font-mulish text-[11px] text-slate-500 truncate">
              Adeola · 2 intros waiting
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo("new")}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-cabinet font-bold text-xs sm:text-sm text-navy">
                New Intern
              </span>
              <span className="text-slate-400 font-bold text-xs">→</span>
            </div>
            <p className="mt-0.5 font-mulish text-[11px] text-slate-500 truncate">
              First-time setup
            </p>
          </button>
        </div>
      </div>

      <p className="text-center font-mulish text-xs text-slate-500">
        Don’t have a profile yet?{" "}
        <Link
          href="/signup"
          className="font-cabin font-semibold text-brand-green hover:underline underline-offset-4"
        >
          Create your intern profile
        </Link>
      </p>
    </div>
  );
}
