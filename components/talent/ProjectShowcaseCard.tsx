import { TalentProject } from "@/types/talent";

interface ProjectShowcaseCardProps {
  project: TalentProject;
  authorName: string;
}

export function ProjectShowcaseCard({
  project,
  authorName,
}: ProjectShowcaseCardProps) {
  const isFeatured = project.position === 1;

  return (
    <article
      className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${
        isFeatured
          ? "border-brand-green/40 ring-1 ring-brand-green/10"
          : "border-slate-200"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Half: Project Preview Image (6 cols) */}
        <div className="lg:col-span-6 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 flex items-center justify-center overflow-hidden">
          {project.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail_url}
              alt={`${project.title} built by ${authorName}`}
              className="w-full h-full aspect-[16/10] object-cover"
            />
          ) : (
            <div className="w-full aspect-[16/10] p-8 flex flex-col justify-between bg-slate-50">
              <span className="font-cabin text-xs text-slate-400">
                {project.live_url.replace(/^https?:\/\//, "")}
              </span>
              <div>
                <p className="font-cabinet font-bold text-xl text-navy">
                  {project.title}
                </p>
                <p className="mt-1 font-mulish text-xs text-slate-500">
                  Built with {project.tech_stack.join(", ")}
                </p>
              </div>
              <span className="font-cabin text-xs text-brand-green font-semibold">
                Project Preview
              </span>
            </div>
          )}
        </div>

        {/* Right Half: Project Story, Tools & Direct Links (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              {isFeatured ? (
                <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                  Featured Project
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-cabin text-xs font-medium">
                  Project {project.position}
                </span>
              )}
            </div>

            <h3 className="font-cabinet font-bold text-2xl text-navy tracking-tight leading-snug">
              {project.title}
            </h3>

            <p className="mt-3 font-mulish text-sm sm:text-base text-slate-600 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="space-y-5">
            {/* Tools & Stack */}
            <div>
              <p className="font-cabin text-xs font-medium text-slate-400 mb-2">
                Built with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-cabin text-xs font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-brand-green/90 transition-colors"
              >
                <span>View live project</span>
                <span aria-hidden="true">↗</span>
              </a>

              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-navy font-cabin text-xs sm:text-sm font-semibold hover:border-brand-green hover:text-brand-green transition-colors"
              >
                <span>View source code</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
