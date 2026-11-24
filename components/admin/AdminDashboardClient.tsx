"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminCandidateProfile,
  AdminHiringRequest,
  InternIntroductionRequest,
} from "@/types/talent";
import {
  INITIAL_ADMIN_PROFILES,
  INITIAL_ADMIN_REQUESTS,
} from "@/lib/mock-talent";
import { DirectoryFooter } from "@/components/directory/DirectoryFooter";
import { AdminNavbar } from "./AdminNavbar";
import { AdminForbiddenView } from "./AdminForbiddenView";
import { AdminProfileRow } from "./AdminProfileRow";
import { AdminRequestRow } from "./AdminRequestRow";
import { AdminRequestSlideOver } from "./AdminRequestSlideOver";

type AdminMainTab = "profiles" | "requests";
type ProfileStatusFilter = "pending" | "approved";

const INTERN_INTROS_STORAGE_KEY = "nithub_intern_intros";
const AUTH_ROLE_STORAGE_KEY = "nithub_auth_role";

export function AdminDashboardClient() {
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(true);
  const [mainTab, setMainTab] = useState<AdminMainTab>("profiles");
  const [profileStatusFilter, setProfileStatusFilter] =
    useState<ProfileStatusFilter>("pending");

  useEffect(() => {
    try {
      const savedRole = window.sessionStorage.getItem(AUTH_ROLE_STORAGE_KEY);
      if (savedRole === "intern") {
        setIsAuthorizedAdmin(false);
      } else if (savedRole === "admin") {
        setIsAuthorizedAdmin(true);
      }
    } catch {
      // Ignore storage error
    }

    async function loadLiveAdminData() {
      try {
        const [profilesRes, requestsRes] = await Promise.all([
          fetch("/api/admin/profiles"),
          fetch("/api/admin/hiring-requests?page=1&page_size=50"),
        ]);

        if (profilesRes.status === 403) {
          setIsAuthorizedAdmin(false);
          return;
        }

        if (profilesRes.ok) {
          const json = await profilesRes.json();
          if (Array.isArray(json?.data) && json.data.length > 0) {
            const mapped: AdminCandidateProfile[] = json.data.map(
              (u: Record<string, unknown>, idx: number) => {
                const projs = Array.isArray(u.projects) ? u.projects : [];
                return {
                  id: String(u.id),
                  full_name: String(u.full_name ?? "Intern"),
                  email: String(u.email ?? ""),
                  phone: "",
                  avatar_url: (u.avatar_url as string | null) ?? null,
                  track: ((u.track as string) || "fullstack") as AdminCandidateProfile["track"],
                  availability_status: ((u.availability_status as string) ||
                    "available_now") as AdminCandidateProfile["availability_status"],
                  cohort_year: Number(u.cohort_year ?? 2025),
                  is_verified: Boolean(u.is_verified),
                  consented_at: (u.consented_at as string | null) ?? null,
                  bio: String(u.bio ?? ""),
                  github_url: (u.github_url as string | null) ?? null,
                  linkedin_url: (u.linkedin_url as string | null) ?? null,
                  x_url: (u.x_url as string | null) ?? null,
                  top_project: projs[0] ?? INITIAL_ADMIN_PROFILES[0].top_project,
                  projects: projs,
                  submitted_at_label: u.created_at
                    ? `Submitted ${new Date(String(u.created_at)).toLocaleDateString()}`
                    : "Submitted recently",
                  submitted_order: idx + 1,
                };
              }
            );
            setProfiles(mapped);
          }
        }

        if (requestsRes.ok) {
          const json = await requestsRes.json();
          if (Array.isArray(json?.data) && json.data.length > 0) {
            const mappedReqs: AdminHiringRequest[] = json.data.map(
              (r: Record<string, unknown>, idx: number) => {
                const ids = Array.isArray(r.shortlisted_user_ids)
                  ? (r.shortlisted_user_ids as string[])
                  : [];
                return {
                  id: String(r.id),
                  company_name: String(r.company_name ?? ""),
                  contact_email: String(r.contact_email ?? ""),
                  contact_phone: (r.contact_phone as string | undefined) ?? undefined,
                  engagement_type: String(r.engagement_type ?? "Full-time role"),
                  notes: String(r.notes ?? ""),
                  created_at_label: r.created_at
                    ? new Date(String(r.created_at)).toLocaleDateString()
                    : "Recently",
                  created_order: 100 - idx,
                  notified_at: (r.notified_at as string | null) ?? null,
                  candidates: ids.map((internId) => ({
                    intern_id: internId,
                    forward_status: "not_sent" as const,
                  })),
                };
              }
            );
            setRequests(mappedReqs);
          }
        }
      } catch {
        // Keep initial seed data when offline or before Supabase is configured
      }
    }

    loadLiveAdminData();
  }, []);

  function handleSetRole(isAdmin: boolean) {
    setIsAuthorizedAdmin(isAdmin);
    try {
      window.sessionStorage.setItem(
        AUTH_ROLE_STORAGE_KEY,
        isAdmin ? "admin" : "intern"
      );
    } catch {
      // Ignore storage error
    }
  }

  const [profiles, setProfiles] = useState<AdminCandidateProfile[]>(
    INITIAL_ADMIN_PROFILES
  );
  const [requests, setRequests] = useState<AdminHiringRequest[]>(
    INITIAL_ADMIN_REQUESTS
  );
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(null);

  function showNotice(msg: string) {
    setNoticeBanner(msg);
    setTimeout(() => {
      setNoticeBanner((prev) => (prev === msg ? null : prev));
    }, 4000);
  }

  // Pending profiles sorted OLDEST FIRST (lower submitted_order first)
  const pendingProfiles = useMemo(() => {
    return profiles
      .filter((p) => !p.is_verified)
      .sort((a, b) => a.submitted_order - b.submitted_order);
  }, [profiles]);

  // Approved profiles
  const approvedProfiles = useMemo(() => {
    return profiles.filter((p) => p.is_verified);
  }, [profiles]);

  // Hiring requests sorted NEWEST FIRST (higher created_order first)
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => b.created_order - a.created_order);
  }, [requests]);

  const profilesMap = useMemo(() => {
    const map: Record<string, AdminCandidateProfile> = {};
    profiles.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [profiles]);

  const activeRequest = useMemo(() => {
    if (!activeRequestId) return null;
    return requests.find((r) => r.id === activeRequestId) ?? null;
  }, [activeRequestId, requests]);

  async function handleToggleApprove(id: string, nextVerified: boolean) {
    const target = profilesMap[id];
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              is_verified: nextVerified,
              submitted_at_label: nextVerified
                ? "Approved just now"
                : "Moved back to pending",
            }
          : p
      )
    );

    try {
      await fetch(`/api/admin/profiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified: nextVerified }),
      });
    } catch {
      // Ignore network errors in local demo mode
    }

    if (target) {
      showNotice(
        nextVerified
          ? `${target.full_name}’s profile is now approved and live in the Talent Directory.`
          : `${target.full_name}’s profile has been unapproved and hidden from the public directory.`
      );
    }
  }

  function pushToInternWorkspaceIfAdeola(
    req: AdminHiringRequest,
    internId: string,
    specificNote?: string
  ) {
    // Sync with Adeola's sessionStorage introductions so testing /admin -> /dashboard works live
    if (internId !== "b1a7e8c0-1111-4f2b-9a10-000000000001") return;
    try {
      const saved = window.sessionStorage.getItem(INTERN_INTROS_STORAGE_KEY);
      const list: InternIntroductionRequest[] = saved ? JSON.parse(saved) : [];
      const alreadyExists = list.some(
        (item) =>
          item.company_name.toLowerCase() === req.company_name.toLowerCase()
      );
      if (!alreadyExists) {
        const created: InternIntroductionRequest = {
          id: `intro-${req.id}`,
          company_name: req.company_name,
          engagement_type: req.engagement_type,
          role_notes: req.notes,
          specific_note: specificNote,
          sent_by_admin_at: "Just now",
          consent_status: "pending",
        };
        window.sessionStorage.setItem(
          INTERN_INTROS_STORAGE_KEY,
          JSON.stringify([created, ...list])
        );
      }
    } catch {
      // Ignore storage error
    }
  }

  function handleForwardToIntern(requestId: string, internId: string) {
    const req = requests.find((r) => r.id === requestId);
    const intern = profilesMap[internId];

    setRequests((prev) =>
      prev.map((r) =>
        r.id !== requestId
          ? r
          : {
              ...r,
              candidates: r.candidates.map((c) => {
                if (c.intern_id === internId && c.forward_status === "not_sent") {
                  if (req) {
                    pushToInternWorkspaceIfAdeola(req, internId, c.specific_note);
                  }
                  return {
                    ...c,
                    forward_status: "pending_consent",
                    forwarded_at: "Just now",
                  };
                }
                return c;
              }),
            }
      )
    );

    if (intern && req) {
      showNotice(
        `Forwarded ${req.company_name}’s introduction request to ${intern.full_name}’s workspace.`
      );
    }
  }

  function handleForwardAllInRequest(requestId: string) {
    const req = requests.find((r) => r.id === requestId);

    setRequests((prev) =>
      prev.map((r) =>
        r.id !== requestId
          ? r
          : {
              ...r,
              candidates: r.candidates.map((c) => {
                if (c.forward_status === "not_sent") {
                  if (req) {
                    pushToInternWorkspaceIfAdeola(
                      req,
                      c.intern_id,
                      c.specific_note
                    );
                  }
                  return {
                    ...c,
                    forward_status: "pending_consent",
                    forwarded_at: "Just now",
                  };
                }
                return c;
              }),
            }
      )
    );

    if (req) {
      showNotice(
        `Forwarded ${req.company_name}’s introduction request to all shortlisted interns.`
      );
    }
  }

  function handleSimulateInternAccept(requestId: string, internId: string) {
    const intern = profilesMap[internId];
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== requestId
          ? r
          : {
              ...r,
              candidates: r.candidates.map((c) =>
                c.intern_id === internId
                  ? {
                      ...c,
                      forward_status: "accepted",
                      responded_at: "Accepted just now",
                    }
                  : c
              ),
            }
      )
    );

    if (intern) {
      showNotice(
        `${intern.full_name} accepted the introduction and shared their contact details.`
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-navy">
      <AdminNavbar
        isAuthorizedAdmin={isAuthorizedAdmin}
        onToggleRoleTest={handleSetRole}
      />

      {!isAuthorizedAdmin ? (
        <AdminForbiddenView onRestoreAdmin={() => handleSetRole(true)} />
      ) : (
        <>
          {/* Admin Header & Main Tabs */}
          <section className="bg-white border-b border-slate-200 pt-8 sm:pt-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7">
                <div>
                  <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
                    NitHub Placement &amp; Directory Admin
                  </p>
                  <h1 className="mt-1 font-cabinet font-extrabold text-3xl sm:text-4xl text-navy tracking-tight">
                    Review profiles &amp;{" "}
                    <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
                      hiring requests
                    </span>
                    .
                  </h1>
                  <p className="mt-2 font-mulish text-sm sm:text-base text-slate-600 max-w-2xl">
                    Verify intern projects before they go live in the directory,
                    and forward employer introduction requests to shortlisted
                    candidates.
                  </p>
                </div>
              </div>

              {/* Primary Workspace Tabs */}
              <div
                className="flex items-center gap-6 border-t border-slate-100 pt-1"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mainTab === "profiles"}
                  onClick={() => setMainTab("profiles")}
                  className={`py-3.5 px-2 font-cabin text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    mainTab === "profiles"
                      ? "border-brand-green text-brand-green"
                      : "border-transparent text-slate-600 hover:text-navy"
                  }`}
                >
                  Profile Approvals ({pendingProfiles.length} pending)
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={mainTab === "requests"}
                  onClick={() => setMainTab("requests")}
                  className={`py-3.5 px-2 font-cabin text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    mainTab === "requests"
                      ? "border-brand-green text-brand-green"
                      : "border-transparent text-slate-600 hover:text-navy"
                  }`}
                >
                  Employer Hiring Requests ({sortedRequests.length})
                </button>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-6">
            {noticeBanner && (
              <div
                role="status"
                className="p-4 rounded-xl bg-navy text-white flex items-center justify-between gap-4 shadow-md animate-modal-up"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-green text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <p className="font-mulish text-xs sm:text-sm">
                    {noticeBanner}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNoticeBanner(null)}
                  className="font-cabin text-xs text-slate-300 hover:text-white cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {mainTab === "profiles" ? (
              /* TAB 1: Profile Approvals */
              <div className="space-y-6">
                {/* Sub-Filter Bar: Pending (Oldest First) vs Approved */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileStatusFilter("pending")}
                      className={`px-4 py-2 rounded-xl font-cabin text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        profileStatusFilter === "pending"
                          ? "bg-brand-green text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:text-navy"
                      }`}
                    >
                      Pending Review ({pendingProfiles.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileStatusFilter("approved")}
                      className={`px-4 py-2 rounded-xl font-cabin text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        profileStatusFilter === "approved"
                          ? "bg-brand-green text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:text-navy"
                      }`}
                    >
                      Approved &amp; Live ({approvedProfiles.length})
                    </button>
                  </div>

                  <p className="font-mulish text-xs text-slate-500">
                    {profileStatusFilter === "pending"
                      ? "Sorted oldest first so interns waiting the longest are reviewed first."
                      : "Approved profiles are immediately public in the Talent Directory."}
                  </p>
                </div>

                {profileStatusFilter === "pending" ? (
                  pendingProfiles.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
                      <h3 className="font-cabinet font-bold text-xl text-navy">
                        All pending profiles have been reviewed!
                      </h3>
                      <p className="font-mulish text-sm text-slate-500">
                        There are no interns waiting in the approval queue right
                        now.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {pendingProfiles.map((profile, idx) => (
                        <AdminProfileRow
                          key={profile.id}
                          profile={profile}
                          isOldestPending={idx === 0}
                          onToggleApprove={handleToggleApprove}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-5">
                    {approvedProfiles.map((profile) => (
                      <AdminProfileRow
                        key={profile.id}
                        profile={profile}
                        onToggleApprove={handleToggleApprove}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* TAB 2: Employer Hiring Requests (Newest First) */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="font-cabinet font-bold text-xl text-navy">
                      Incoming Employer Requests ({sortedRequests.length})
                    </h2>
                    <p className="font-mulish text-xs text-slate-500">
                      Sorted newest first · Click any request to open the
                      slide-over drawer and forward introductions to interns.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedRequests.map((req) => (
                    <AdminRequestRow
                      key={req.id}
                      request={req}
                      profilesMap={profilesMap}
                      onOpenRequest={(r) => setActiveRequestId(r.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Request Detail Slide-Over Drawer */}
          <AdminRequestSlideOver
            request={activeRequest}
            profilesMap={profilesMap}
            onClose={() => setActiveRequestId(null)}
            onForwardToIntern={handleForwardToIntern}
            onForwardAllInRequest={handleForwardAllInRequest}
            onSimulateInternAccept={handleSimulateInternAccept}
          />
        </>
      )}

      <DirectoryFooter />
    </div>
  );
}
