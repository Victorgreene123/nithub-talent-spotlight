export function DirectoryHeader() {
  return (
    <section className="py-10 sm:py-14 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-cabin text-xs font-semibold text-brand-green tracking-wider uppercase mb-2">
            NitHub Talent Directory
          </p>
          <h1 className="font-cabinet font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-[1.14] tracking-tight text-navy">
            Hire{" "}
            <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
              trained tech talent
            </span>{" "}
            from NitHub.
          </h1>
          <p className="mt-3.5 font-mulish text-base sm:text-lg text-slate-600 leading-relaxed">
            Browse real projects built by our interns and graduates. Pick up to
            five people who fit your team, and we’ll connect you directly.
          </p>
        </div>
      </div>
    </section>
  );
}
