import Link from "next/link";

export function ShortlistHeader() {
  return (
    <section className="bg-white border-b border-slate-200 pt-6 pb-7 sm:pt-10 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-cabin text-xs sm:text-sm font-medium text-slate-500 hover:text-brand-green transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Talent Directory</span>
          </Link>
        </div>

        <div className="max-w-2xl">
          <p className="font-cabin text-xs font-semibold text-brand-green tracking-wider uppercase mb-1.5 sm:mb-2">
            Shortlist &amp; Introduction
          </p>
          <h1 className="font-cabinet font-extrabold text-[26px] sm:text-4xl lg:text-[42px] leading-[1.15] tracking-tight text-navy">
            Request an introduction to your{" "}
            <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
              shortlisted talent
            </span>
            .
          </h1>
          <p className="mt-2.5 sm:mt-3.5 font-mulish text-sm sm:text-lg text-slate-600 leading-relaxed">
            Review the people you selected below and tell us a little about the
            role. The NitHub placement team will introduce you directly by
            email.
          </p>
        </div>
      </div>
    </section>
  );
}
