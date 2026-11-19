import Link from "next/link";

export default function TalentNotFound() {
  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
          Profile unavailable
        </p>
        <h1 className="mt-2 font-cabinet font-extrabold text-2xl sm:text-3xl text-navy">
          We couldn’t find that talent profile
        </h1>
        <p className="mt-3 font-mulish text-sm text-slate-600 leading-relaxed">
          This profile may still be pending review by NitHub mentors, or the
          link may be incorrect.
        </p>
        <div className="mt-6">
          <Link
            href="/directory"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 transition-colors"
          >
            Back to Talent Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
