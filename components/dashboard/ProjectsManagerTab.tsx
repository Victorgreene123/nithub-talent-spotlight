"use client";

import { useState } from "react";
import { TalentProject } from "@/types/talent";
import { ALL_STACK_TAGS } from "@/lib/mock-talent";

interface ProjectsManagerTabProps {
  projects: TalentProject[];
  authorName: string;
  onSaveProject: (
    project: Omit<TalentProject, "id" | "position">,
    editingId?: string
  ) => void;
  onDeleteProject: (id: string) => void;
  onMakeFeatured: (id: string) => void;
}

interface ProjectFormErrors {
  title?: string;
  tagline?: string;
  tech_stack?: string;
  live_url?: string;
  repo_url?: string;
  thumbnail?: string;
}

const MAX_PROJECTS = 3;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const SAMPLE_PREVIEW_PRESETS = [
  { label: "Dashboard UI", url: "/projects/medshelf.svg" },
  { label: "Mobile App UI", url: "/projects/lagbus.svg" },
  { label: "Ledger / Finance UI", url: "/projects/splitpay.svg" },
  { label: "Hardware Schematic", url: "/projects/solarmeter.svg" },
  { label: "Product Case Study", url: "/projects/edupay-prd.svg" },
];

export function ProjectsManagerTab({
  projects,
  authorName,
  onSaveProject,
  onDeleteProject,
  onMakeFeatured,
}: ProjectsManagerTabProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [customToolInput, setCustomToolInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<ProjectFormErrors>({});

  const orderedProjects = [...projects].sort((a, b) => a.position - b.position);
  const canAddMore = projects.length < MAX_PROJECTS;

  function openAddModal() {
    if (!canAddMore) return;
    setEditingId(null);
    setTitle("");
    setTagline("");
    setTechStack([]);
    setCustomToolInput("");
    setLiveUrl("https://");
    setRepoUrl("https://github.com/");
    setThumbnailUrl("/projects/medshelf.svg");
    setErrors({});
    setIsEditorOpen(true);
  }

  function openEditModal(project: TalentProject) {
    setEditingId(project.id);
    setTitle(project.title);
    setTagline(project.tagline);
    setTechStack(project.tech_stack);
    setCustomToolInput("");
    setLiveUrl(project.live_url);
    setRepoUrl(project.repo_url);
    setThumbnailUrl(project.thumbnail_url);
    setErrors({});
    setIsEditorOpen(true);
  }

  function handleAddTool(tool: string) {
    const cleaned = tool.trim();
    if (!cleaned || techStack.length >= 8) return;
    const exists = techStack.some(
      (t) => t.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists) {
      setTechStack([...techStack, cleaned]);
    }
    setCustomToolInput("");
  }

  function handleRemoveTool(tool: string) {
    setTechStack(techStack.filter((t) => t !== tool));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size without losing the rest of the form
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        thumbnail:
          "Invalid file type. Please upload a JPG, PNG, or WebP image.",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        thumbnail:
          "Image exceeds the 2 MB limit. Please choose a smaller screenshot.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setThumbnailUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function validateForm(): boolean {
    const nextErrors: ProjectFormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Please enter a project title.";
    } else if (title.trim().length > 80) {
      nextErrors.title = "Project title must be 80 characters or fewer.";
    }

    if (!tagline.trim() || tagline.trim().length < 15) {
      nextErrors.tagline =
        "Please write a short 1–2 sentence summary of the problem and solution.";
    } else if (tagline.trim().length > 280) {
      nextErrors.tagline = "Summary must be 280 characters or fewer.";
    }

    if (techStack.length === 0) {
      nextErrors.tech_stack = "Please select at least 1 tool or skill used.";
    }

    if (!liveUrl.trim().startsWith("https://") || liveUrl.trim().length < 12) {
      nextErrors.live_url =
        "Please enter a valid https:// URL for the live project or case study.";
    }

    if (!repoUrl.trim().startsWith("https://") || repoUrl.trim().length < 12) {
      nextErrors.repo_url =
        "Please enter a valid https:// URL for the repository or documentation.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    onSaveProject(
      {
        title: title.trim(),
        tagline: tagline.trim(),
        tech_stack: techStack,
        live_url: liveUrl.trim(),
        repo_url: repoUrl.trim(),
        thumbnail_url: thumbnailUrl,
      },
      editingId ?? undefined
    );
    setIsEditorOpen(false);
  }

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="pb-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
            Proof of Work ({projects.length} of {MAX_PROJECTS} slots used)
          </p>
          <h2 className="mt-0.5 font-cabinet font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
            Your shipped{" "}
            <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
              projects
            </span>
          </h2>
          <p className="mt-1.5 font-mulish text-sm text-slate-600">
            Your <strong className="font-semibold text-navy">#1 project</strong>{" "}
            is featured on your main card in the Talent Directory. You can add
            up to 3 projects total.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          disabled={!canAddMore}
          className={`self-start sm:self-end px-4 py-2.5 rounded-xl font-cabin text-xs sm:text-sm font-semibold transition-colors ${
            canAddMore
              ? "bg-brand-green text-white hover:bg-brand-green/90 cursor-pointer shadow-xs"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {canAddMore
            ? "+ Add project"
            : "Maximum of 3 projects reached"}
        </button>
      </div>

      {/* Projects List */}
      {orderedProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center space-y-4">
          <h3 className="font-cabinet font-bold text-xl text-navy">
            You haven’t added any projects yet
          </h3>
          <p className="font-mulish text-sm text-slate-600 max-w-md mx-auto">
            Add at least one shipped project, live prototype, or case study so
            employers can see what you’ve built.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 cursor-pointer"
          >
            + Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orderedProjects.map((project) => {
            const isFeatured = project.position === 1;

            return (
              <article
                key={project.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow ${
                  isFeatured
                    ? "border-brand-green ring-1 ring-brand-green/20"
                    : "border-slate-200"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left: Project Screenshot */}
                  <div className="lg:col-span-5 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200">
                    {project.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full aspect-[16/10] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[16/10] p-6 flex items-center justify-center text-slate-400 font-cabin text-xs">
                        No screenshot uploaded
                      </div>
                    )}
                  </div>

                  {/* Right: Details & Actions */}
                  <div className="lg:col-span-7 p-6 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        {isFeatured ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                            #1 · Featured on Directory Card
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-cabin text-xs font-medium">
                            Project #{project.position}
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          {!isFeatured && (
                            <button
                              type="button"
                              onClick={() => onMakeFeatured(project.id)}
                              className="px-2.5 py-1 rounded-lg border border-brand-green/30 bg-brand-green/5 text-brand-green font-cabin text-xs font-semibold hover:bg-brand-green/10 cursor-pointer"
                            >
                              Set as Featured (#1)
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="px-3 py-1 rounded-lg border border-slate-200 text-navy font-cabin text-xs font-semibold hover:border-navy cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProject(project.id)}
                            className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-red-600 font-cabin text-xs font-medium cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <h3 className="font-cabinet font-bold text-xl text-navy">
                        {project.title}
                      </h3>
                      <p className="mt-2 font-mulish text-sm text-slate-600 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-cabin text-xs font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 font-cabin text-xs">
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-green font-semibold hover:underline underline-offset-4"
                        >
                          Live project ↗
                        </a>
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-navy hover:underline underline-offset-4"
                        >
                          Source code ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {canAddMore && (
            <button
              type="button"
              onClick={openAddModal}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-green bg-white/60 hover:bg-brand-green/5 font-cabin text-sm font-semibold text-brand-green transition-colors cursor-pointer"
            >
              + Add another project ({MAX_PROJECTS - projects.length}{" "}
              {MAX_PROJECTS - projects.length === 1 ? "slot" : "slots"} remaining)
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 bg-navy/50 backdrop-blur-[1px]"
          />

          <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-modal-up">
            {/* Navy Header */}
            <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-cabin text-[11px] font-semibold uppercase tracking-wider text-brand-green-light">
                  {editingId ? "Update Project" : "New Project"}
                </p>
                <h3 className="font-cabinet font-bold text-xl text-white">
                  {editingId ? "Edit project details" : "Add a shipped project"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 overflow-y-auto space-y-4"
            >
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-cabinet font-bold text-sm text-navy">
                    Project title <span className="text-red-600">*</span>
                  </label>
                  <span className="font-cabin text-xs text-slate-400">
                    {title.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MedShelf Pharmacy Inventory"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-sm text-navy focus:outline-none focus:border-brand-green focus:bg-white"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600 font-mulish">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Two-sentence summary */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-cabinet font-bold text-sm text-navy">
                    What does it do? (1–2 plain-English sentences){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <span className="font-cabin text-xs text-slate-400">
                    {tagline.length}/280
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={280}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Explain the problem it solves and who uses it in simple words."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-sm text-navy focus:outline-none focus:border-brand-green focus:bg-white resize-none"
                />
                {errors.tagline && (
                  <p className="mt-1 text-xs text-red-600 font-mulish">
                    {errors.tagline}
                  </p>
                )}
              </div>

              {/* Tools & Skills */}
              <div>
                <label className="block font-cabinet font-bold text-sm text-navy mb-1">
                  Tools &amp; skills used (1–8){" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value=""
                    onChange={(e) => handleAddTool(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green"
                  >
                    <option value="">Choose a skill or tool...</option>
                    {ALL_STACK_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customToolInput}
                    onChange={(e) => setCustomToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTool(customToolInput);
                      }
                    }}
                    placeholder="Or type custom..."
                    className="w-36 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTool(customToolInput)}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-navy font-cabin text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {techStack.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {techStack.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleRemoveTool(tool)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold cursor-pointer"
                      >
                        <span>{tool}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.tech_stack && (
                  <p className="mt-1 text-xs text-red-600 font-mulish">
                    {errors.tech_stack}
                  </p>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-cabinet font-bold text-sm text-navy mb-1">
                    Live project / case study URL{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://your-project.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green focus:bg-white"
                  />
                  {errors.live_url && (
                    <p className="mt-1 text-xs text-red-600 font-mulish">
                      {errors.live_url}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-cabinet font-bold text-sm text-navy mb-1">
                    Source code / repo URL{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/you/repo"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mulish text-xs text-navy focus:outline-none focus:border-brand-green focus:bg-white"
                  />
                  {errors.repo_url && (
                    <p className="mt-1 text-xs text-red-600 font-mulish">
                      {errors.repo_url}
                    </p>
                  )}
                </div>
              </div>

              {/* Screenshot Upload & Preview */}
              <div>
                <label className="block font-cabinet font-bold text-sm text-navy mb-1">
                  Project screenshot (JPG, PNG, WebP up to 2 MB)
                </label>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  {thumbnailUrl && (
                    <div className="relative aspect-[16/10] w-48 rounded-lg overflow-hidden border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailUrl}
                        alt={`${title || "Project"} by ${authorName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 font-cabin text-xs font-semibold text-navy hover:border-brand-green cursor-pointer">
                      <span>Upload image file...</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <select
                      value={thumbnailUrl ?? ""}
                      onChange={(e) =>
                        setThumbnailUrl(e.target.value || null)
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-cabin text-xs text-slate-600"
                    >
                      <option value="">Or pick a sample template...</option>
                      {SAMPLE_PREVIEW_PRESETS.map((preset) => (
                        <option key={preset.url} value={preset.url}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.thumbnail && (
                    <p className="text-xs text-red-600 font-mulish">
                      {errors.thumbnail}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl font-cabin text-xs font-semibold text-slate-600 hover:text-navy cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 cursor-pointer shadow-xs"
                >
                  {editingId ? "Save project changes" : "Add project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
