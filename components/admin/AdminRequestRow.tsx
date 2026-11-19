"use client";

import {
  AdminCandidateProfile,
  AdminForwardStatus,
  AdminHiringRequest,
  TRACK_LABELS,
} from "@/types/talent";

interface AdminRequestRowProps {
  request: AdminHiringRequest;
  profilesMap: Record<string, AdminCandidateProfile>;
  onOpenRequest: (request: AdminHiringRequest) => void;
}

const STATUS_TEXT: Record<
  AdminForwardStatus,
  { label: string; className: string }
> = {
  not_sent: {
    label: "Not forwarded yet",
    className: "text-slate-400",
  },
  pending_consent: {
    label: "Waiting for intern consent",
    className: "text-slate-600",
  },
  accepted: {
    label: "Accepted & contact shared ✓",
    className: "text-brand-green font-semibold",
  },
  declined: {
    label: "Declined by intern",
    className: "text-slate-400",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminRequestRow({
  request,
  profilesMap,
  onOpenRequest,
}: AdminRequestRowProps) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-shadow hover:shadow-xs">
      {/* Top Section: Company Details & Primary Button */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-cabinet font-extrabold text-2xl text-navy">
              {request.company_name}
            </h3>
            <span className="font-cabin text-sm font-semibold text-brand-green">
              {request.engagement_type}
            </span>
          </div>

          <p className="font-cabin text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-navy font-medium">
              {request.contact_email}
            </span>
            {request.contact_phone && (
              <>
                <span className="text-slate-300">·</span>
                <span>{request.contact_phone}</span>
              </>
            )}
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">
              Received {request.created_at_label}
            </span>
            {!request.notified_at && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-amber-700 font-semibold">
                  Email alert not delivered
                </span>
              </>
            )}
          </p>

          <p className="pt-1 font-mulish text-sm text-slate-600 leading-relaxed">
            {request.notes}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenRequest(request)}
          className="self-start px-4 py-2.5 rounded-xl bg-navy text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-navy/90 transition-colors cursor-pointer shrink-0"
        >
          Manage introductions →
        </button>
      </div>

      {/* Bottom Section: Clean Structured List of Shortlisted Candidates (No Badge Clutter) */}
      <div className="px-6 py-4 bg-slate-50/40">
        <p className="font-cabin text-xs font-semibold text-slate-400 mb-2">
          Shortlisted candidates ({request.candidates.length})
        </p>

        <ul className="divide-y divide-slate-200/70">
          {request.candidates.map((cand) => {
            const intern = profilesMap[cand.intern_id];
            const status = STATUS_TEXT[cand.forward_status];

            return (
              <li
                key={cand.intern_id}
                className="py-2.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-navy text-white font-cabinet font-bold text-[11px] flex items-center justify-center shrink-0">
                    {getInitials(intern?.full_name ?? "IN")}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2 min-w-0">
                    <span className="font-cabinet font-bold text-sm text-navy">
                      {intern?.full_name ?? "Intern"}
                    </span>
                    {intern && (
                      <span className="font-cabin text-xs text-slate-500">
                        · {TRACK_LABELS[intern.track]}
                      </span>
                    )}
                    {intern && (
                      <span className="font-mulish text-xs text-slate-400 hidden md:inline">
                        ({intern.top_project.title})
                      </span>
                    )}
                  </div>
                </div>

                <span className={`font-cabin text-xs ${status.className}`}>
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
