"use client";

import { useEffect, useState } from "react";
import {
  AvailabilityStatus,
  InternAccountProfile,
  InternIntroductionRequest,
  TalentProject,
} from "@/types/talent";
import {
  INITIAL_INTERN_INTRODUCTIONS,
  INITIAL_NEW_INTERN,
  INITIAL_RETURNING_INTERN,
} from "@/lib/mock-talent";
import { DirectoryFooter } from "@/components/directory/DirectoryFooter";
import { InternNavbar } from "./InternNavbar";
import { DashboardTab, ProfileStatusHeader } from "./ProfileStatusHeader";
import { IntroductionsTab } from "./IntroductionsTab";
import { ProjectsManagerTab } from "./ProjectsManagerTab";
import { ProfileEditorTab } from "./ProfileEditorTab";

const INTERN_MODE_STORAGE_KEY = "nithub_intern_demo_mode";
const INTERN_RETURNING_STORAGE_KEY = "nithub_intern_profile_returning";
const INTERN_NEW_STORAGE_KEY = "nithub_intern_profile_new";
const INTERN_INTROS_STORAGE_KEY = "nithub_intern_intros";

export function InternDashboardClient() {
  const [demoMode, setDemoMode] = useState<"returning" | "new">("returning");
  const [activeTab, setActiveTab] = useState<DashboardTab>("introductions");

  const [returningProfile, setReturningProfile] =
    useState<InternAccountProfile>(INITIAL_RETURNING_INTERN);
  const [newProfile, setNewProfile] =
    useState<InternAccountProfile>(INITIAL_NEW_INTERN);
  const [introductions, setIntroductions] = useState<
    InternIntroductionRequest[]
  >(INITIAL_INTERN_INTRODUCTIONS);

  useEffect(() => {
    try {
      const savedMode = window.sessionStorage.getItem(INTERN_MODE_STORAGE_KEY);
      if (savedMode === "new" || savedMode === "returning") {
        setDemoMode(savedMode);
        if (savedMode === "new") {
          setActiveTab("profile");
        }
      }

      const savedReturning = window.sessionStorage.getItem(
        INTERN_RETURNING_STORAGE_KEY
      );
      if (savedReturning) {
        setReturningProfile(JSON.parse(savedReturning));
      }

      const savedNew = window.sessionStorage.getItem(INTERN_NEW_STORAGE_KEY);
      if (savedNew) {
        setNewProfile(JSON.parse(savedNew));
      }

      const savedIntros = window.sessionStorage.getItem(
        INTERN_INTROS_STORAGE_KEY
      );
      if (savedIntros) {
        setIntroductions(JSON.parse(savedIntros));
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const currentProfile =
    demoMode === "returning" ? returningProfile : newProfile;
  const currentIntros = demoMode === "returning" ? introductions : [];

  function updateCurrentProfile(nextProfile: InternAccountProfile) {
    if (demoMode === "returning") {
      setReturningProfile(nextProfile);
      try {
        window.sessionStorage.setItem(
          INTERN_RETURNING_STORAGE_KEY,
          JSON.stringify(nextProfile)
        );
      } catch {
        // Ignore storage error
      }
    } else {
      setNewProfile(nextProfile);
      try {
        window.sessionStorage.setItem(
          INTERN_NEW_STORAGE_KEY,
          JSON.stringify(nextProfile)
        );
      } catch {
        // Ignore storage error
      }
    }
  }

  function handleSwitchDemoMode(mode: "returning" | "new") {
    setDemoMode(mode);
    try {
      window.sessionStorage.setItem(INTERN_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage error
    }
    if (mode === "new" && newProfile.projects.length === 0) {
      setActiveTab("profile");
    } else {
      setActiveTab("introductions");
    }
  }

  function handleUpdateAvailability(status: AvailabilityStatus) {
    updateCurrentProfile({
      ...currentProfile,
      availability_status: status,
    });
  }

  function handleSaveProfile(updated: Partial<InternAccountProfile>) {
    updateCurrentProfile({
      ...currentProfile,
      ...updated,
    });
  }

  function handleSaveProject(
    projectData: Omit<TalentProject, "id" | "position">,
    editingId?: string
  ) {
    let nextProjects: TalentProject[];

    if (editingId) {
      nextProjects = currentProfile.projects.map((p) =>
        p.id === editingId ? { ...p, ...projectData } : p
      );
    } else {
      if (currentProfile.projects.length >= 3) return;
      const nextPosition = (currentProfile.projects.length + 1) as 1 | 2 | 3;
      const created: TalentProject = {
        ...projectData,
        id: `proj-${currentProfile.projects.length + 1}-${titleSlug(
          projectData.title
        )}`,
        position: nextPosition,
      };
      nextProjects = [...currentProfile.projects, created];
    }

    const sorted = [...nextProjects].sort((a, b) => a.position - b.position);
    updateCurrentProfile({
      ...currentProfile,
      projects: sorted,
      top_project: sorted[0] ?? currentProfile.top_project,
    });
  }

  function handleDeleteProject(id: string) {
    const remaining = currentProfile.projects
      .filter((p) => p.id !== id)
      .sort((a, b) => a.position - b.position)
      .map((p, idx) => ({
        ...p,
        position: (idx + 1) as 1 | 2 | 3,
      }));

    updateCurrentProfile({
      ...currentProfile,
      projects: remaining,
      top_project: remaining[0] ?? currentProfile.top_project,
    });
  }

  function handleMakeFeatured(id: string) {
    const target = currentProfile.projects.find((p) => p.id === id);
    if (!target) return;

    const others = currentProfile.projects
      .filter((p) => p.id !== id)
      .sort((a, b) => a.position - b.position);

    const reordered: TalentProject[] = [target, ...others].map((p, idx) => ({
      ...p,
      position: (idx + 1) as 1 | 2 | 3,
    }));

    updateCurrentProfile({
      ...currentProfile,
      projects: reordered,
      top_project: reordered[0],
    });
  }

  function handleAcceptIntro(id: string) {
    const next = introductions.map((item) =>
      item.id === id
        ? {
            ...item,
            consent_status: "accepted" as const,
            responded_at: "Accepted today",
          }
        : item
    );
    setIntroductions(next);
    try {
      window.sessionStorage.setItem(
        INTERN_INTROS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // Ignore storage error
    }
  }

  function handleDeclineIntro(id: string, reason?: string) {
    const next = introductions.map((item) =>
      item.id === id
        ? {
            ...item,
            consent_status: "declined" as const,
            decline_reason: reason,
            responded_at: "Declined today",
          }
        : item
    );
    setIntroductions(next);
    try {
      window.sessionStorage.setItem(
        INTERN_INTROS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // Ignore storage error
    }
  }

  const pendingIntrosCount = currentIntros.filter(
    (i) => i.consent_status === "pending"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-navy">
      <InternNavbar
        fullName={currentProfile.full_name}
        demoMode={demoMode}
        onSwitchDemoMode={handleSwitchDemoMode}
      />

      <ProfileStatusHeader
        profile={currentProfile}
        activeTab={activeTab}
        pendingIntrosCount={pendingIntrosCount}
        onSelectTab={setActiveTab}
        onUpdateAvailability={handleUpdateAvailability}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        {activeTab === "introductions" && (
          <IntroductionsTab
            introductions={currentIntros}
            internEmail={currentProfile.email}
            internPhone={currentProfile.phone}
            onAcceptIntro={handleAcceptIntro}
            onDeclineIntro={handleDeclineIntro}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsManagerTab
            projects={currentProfile.projects}
            authorName={currentProfile.full_name}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onMakeFeatured={handleMakeFeatured}
          />
        )}

        {activeTab === "profile" && (
          <ProfileEditorTab
            key={demoMode}
            profile={currentProfile}
            onSaveProfile={handleSaveProfile}
            onGoToProjects={() => setActiveTab("projects")}
          />
        )}
      </main>

      <DirectoryFooter />
    </div>
  );
}

function titleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 20);
}
