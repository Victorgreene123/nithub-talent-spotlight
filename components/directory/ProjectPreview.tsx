import { TopProject } from "@/types/talent";

interface ProjectPreviewProps {
  project: TopProject;
  authorName: string;
}

export function ProjectPreview({ project, authorName }: ProjectPreviewProps) {
  return (
    <div className="relative aspect-[16/10] w-full bg-slate-100 border-b border-slate-200 overflow-hidden group">
      {project.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.thumbnail_url}
          alt={`${project.title} by ${authorName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="h-full w-full p-5 flex flex-col justify-between bg-slate-50">
          {/* Subtle browser frame top bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <span className="font-cabin text-xs text-slate-400 truncate max-w-[190px]">
              {project.live_url.replace(/^https?:\/\//, "")}
            </span>
            <span className="font-cabin text-[11px] font-medium text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
              Featured Project
            </span>
          </div>

          <div className="my-auto py-2">
            <p className="font-cabinet font-semibold text-lg text-navy line-clamp-1">
              {project.title}
            </p>
            <p className="mt-1 font-mulish text-xs text-slate-500 line-clamp-2">
              Built with {project.tech_stack.slice(0, 3).join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-cabin text-slate-500">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green font-semibold hover:underline underline-offset-4"
            >
              View live project ↗
            </a>
            <span className="text-slate-300">·</span>
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy hover:underline underline-offset-4"
            >
              Source code
            </a>
          </div>
        </div>
      )}

      {/* Hover overlay when an actual thumbnail image is present */}
      {project.thumbnail_url && (
        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-brand-green text-white font-cabin text-xs font-medium shadow-sm hover:bg-brand-green/90 transition-colors"
          >
            View live project ↗
          </a>
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-navy text-white border border-white/20 font-cabin text-xs font-medium hover:bg-navy/90 transition-colors"
          >
            Source code
          </a>
        </div>
      )}
    </div>
  );
}
