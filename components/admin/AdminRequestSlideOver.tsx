"use client";

import Link from "next/link";
import {
  AdminCandidateProfile,
  AdminHiringRequest,
  TRACK_LABELS,
} from "@/types/talent";

interface AdminRequestSlideOverProps {
  request: AdminHiringRequest | null;
  profilesMap: Record<string, AdminCandidateProfile>;
  onClose: () => void;
  onForwardToIntern: (requestId: string, internId: string) => void;
  onForwardAllInRequest: (requestId: string) => void;
  onSimulateInternAccept: (requestId: string, internId: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminRequestSlideOver({
  request,
  profilesMap,
  onClose,
  onForwardToIntern,
  onForwardAllInRequest,
  onSimulateInternAccept,
}: AdminRequestSlideOverProps) {
  if (!request) return null;

  const unforwardedCount = request.candidates.filter(
    (c) => c.forward_status === "not_sent"
  ).length;

  function buildIntroMailto(intern: AdminCandidateProfile) {
    if (!request) return "#";
    const subject = encodeURIComponent(
      `NitHub Talent Introduction: ${intern.full_name} ↔ ${request.company_name}`
    );
    const body = encodeURIComponent(
      `Hello ${request.company_name} team and ${intern.full_name},\n\n` +
        `I’m connecting you following ${request.company_name}’s request through NitHub Talent Spotlight for a ${request.engagement_type.toLowerCase()}.\n\n` +
        `${intern.full_name} (${TRACK_LABELS[intern.track]}) has reviewed your role overview and confirmed interest in speaking with your team.\n\n` +
        `• ${intern.full_name}'s Email: ${intern.email}\n` +
        `• ${intern.full_name}'s Phone: ${intern.phone}\n` +
        `• NitHub Profile: https://nithub-talent.example.com/talent/${intern.id}\n\n` +
        `I’ll leave you both to coordinate a convenient time for an introductory chat.\n\n` +
        `Best regards,\nNitHub Placement Team\nUniversity of Lagos`
    );
    return `mailto:${request.contact_email},${intern.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-slideover-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-navy/50 backdrop-blur-[1px] transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between">
          {/* Slide-Over Header (Deep Navy #0D1836) */}
          <div className="bg-navy text-white px-6 py-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-cabin text-xs font-semibold text-brand-green-light">
                {request.engagement_type} · Received {request.created_at_label}
              </p>

              <h2
                id="request-slideover-title"
                className="mt-1 font-cabinet font-extrabold text-2xl text-white tracking-tight"
              >
                {request.company_name}
              </h2>

              <p className="mt-1 font-cabin text-xs text-slate-300">
                {request.contact_email}
                {request.contact_phone ? ` · ${request.contact_phone}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close request details"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Slide-Over Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {!request.notified_at && (
              <p className="font-mulish text-xs text-amber-800 border-l-2 border-amber-500 pl-3 py-1">
                Note: The automated email alert did not deliver (`notified_at`
                is null), though this request was saved safely.
              </p>
            )}

            {/* Employer Role Description */}
            <div className="pb-5 border-b border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-cabin text-xs font-semibold text-slate-400">
                  About the role
                </span>
                <a
                  href={`mailto:${request.contact_email}`}
                  className="font-cabin text-xs font-semibold text-brand-green hover:underline underline-offset-4"
                >
                  Email employer ↗
                </a>
              </div>
              <p className="font-mulish text-sm text-navy leading-relaxed">
                {request.notes}
              </p>
            </div>

            {/* Shortlisted Interns List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-cabinet font-bold text-lg text-navy">
                    Shortlisted Candidates ({request.candidates.length})
                  </h3>
                  <p className="font-mulish text-xs text-slate-500">
                    Forward the request to each intern’s workspace to collect
                    their consent before sharing contact details.
                  </p>
                </div>

                {unforwardedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onForwardAllInRequest(request.id)}
                    className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shrink-0"
                  >
                    Forward to all ({unforwardedCount}) →
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {request.candidates.map((cand) => {
                  const intern = profilesMap[cand.intern_id];
                  if (!intern) return null;

                  const firstName =
                    intern.full_name.split(" ")[0] ?? intern.full_name;

                  return (
                    <div key={cand.intern_id} className="py-5 space-y-3.5">
                      {/* Top Row: Intern Identity & Profile Link */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-navy text-white font-cabinet font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(intern.full_name)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/talent/${intern.id}`}
                              className="font-cabinet font-bold text-base text-navy hover:text-brand-green transition-colors block truncate"
                            >
                              {intern.full_name}
                            </Link>
                            <p className="font-cabin text-xs text-slate-500 truncate">
                              <span className="text-brand-green font-semibold">
                                {TRACK_LABELS[intern.track]}
                              </span>{" "}
                              · {intern.top_project.title}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/talent/${intern.id}`}
                          className="font-cabin text-xs font-semibold text-slate-500 hover:text-brand-green shrink-0"
                        >
                          Profile ↗
                        </Link>
                      </div>

                      {/* Employer's Specific 1-Line Note for this Intern */}
                      {cand.specific_note && (
                        <p className="font-mulish text-xs text-slate-600 border-l-2 border-slate-300 pl-3 py-0.5">
                          <span className="text-slate-400">
                            Employer note:{" "}
                          </span>
                          “{cand.specific_note}”
                        </p>
                      )}

                      {/* Status & Action Block */}
                      <div className="pt-1">
                        {cand.forward_status === "not_sent" && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="font-mulish text-xs text-slate-400">
                              Not yet forwarded to {firstName}’s workspace
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onForwardToIntern(request.id, intern.id)
                              }
                              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shrink-0"
                            >
                              Forward to {firstName} →
                            </button>
                          </div>
                        )}

                        {cand.forward_status === "pending_consent" && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="font-cabin text-xs text-slate-600">
                              Waiting for {firstName}’s consent{" "}
                              <span className="text-slate-400">
                                · Sent {cand.forwarded_at || "today"}
                              </span>
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                onSimulateInternAccept(request.id, intern.id)
                              }
                              className="self-start sm:self-auto font-cabin text-xs font-semibold text-brand-green hover:underline underline-offset-4 cursor-pointer shrink-0"
                            >
                              Simulate {firstName} accepting →
                            </button>
                          </div>
                        )}

                        {cand.forward_status === "accepted" && (
                          <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 font-cabin text-xs">
                              <span className="text-brand-green font-semibold">
                                {firstName} accepted &amp; shared contact ✓
                              </span>
                              <span className="text-slate-400">
                                {intern.email} · {intern.phone}
                              </span>
                            </div>

                            <a
                              href={buildIntroMailto(intern)}
                              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-brand-green text-white font-cabin text-xs font-semibold hover:bg-brand-green/90 transition-colors"
                            >
                              Send Intro Email Connecting Both Parties ↗
                            </a>
                          </div>
                        )}

                        {cand.forward_status === "declined" && (
                          <div className="font-mulish text-xs text-slate-500">
                            <span className="font-cabin font-semibold text-slate-600">
                              Declined by {firstName}
                            </span>
                            {cand.decline_reason
                              ? ` — “${cand.decline_reason}”`
                              : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Slide-Over Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-navy text-white font-cabin text-xs font-semibold hover:bg-navy/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
