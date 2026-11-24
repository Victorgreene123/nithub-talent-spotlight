import Link from "next/link";

export function AuthNavbar() {
  return (
    <header className="bg-navy text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
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

        <Link
          href="/"
          className="font-cabin text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          ← Back to Directory
        </Link>
      </div>
    </header>
  );
}
