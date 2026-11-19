"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  TalentDirectoryItem,
  TalentProfile,
  TRACK_LABELS,
} from "@/types/talent";
import { DirectoryNavbar } from "@/components/directory/DirectoryNavbar";
import { ShortlistDrawer } from "@/components/directory/ShortlistDrawer";
import { DirectoryFooter } from "@/components/directory/DirectoryFooter";
import { TalentCard } from "@/components/directory/TalentCard";
import { TalentProfileHeader } from "./TalentProfileHeader";
import { ProjectShowcaseCard } from "./ProjectShowcaseCard";

const SHORTLIST_STORAGE_KEY = "nithub_shortlist_ids";
const MAX_SHORTLIST = 5;

interface TalentProfileClientProps {
  profile: TalentProfile;
  allTalents: TalentDirectoryItem[];
}

export function TalentProfileClient({
  profile,
  allTalents,
}: TalentProfileClientProps) {
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const firstName = profile.full_name.split(" ")[0] ?? profile.full_name;

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setShortlistedIds(parsed.slice(0, MAX_SHORTLIST));
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  function saveShortlist(nextIds: string[]) {
    setShortlistedIds(nextIds);
    try {
      window.sessionStorage.setItem(
        SHORTLIST_STORAGE_KEY,
        JSON.stringify(nextIds)
      );
    } catch {
      // Ignore storage access errors
    }
  }

  function handleToggleShortlist(person: TalentDirectoryItem) {
    setLimitMessage(null);

    if (shortlistedIds.includes(person.id)) {
      saveShortlist(shortlistedIds.filter((id) => id !== person.id));
      return;
    }

    if (shortlistedIds.length >= MAX_SHORTLIST) {
      setLimitMessage(
        "You can shortlist up to 5 people per request. Remove someone from your shortlist to add another."
      );
      return;
    }

    saveShortlist([...shortlistedIds, person.id]);
  }

  function handleRemoveFromShortlist(id: string) {
    saveShortlist(shortlistedIds.filter((item) => item !== id));
  }

  function handleClearShortlist() {
    saveShortlist([]);
  }

  const shortlistedPeople = useMemo(() => {
    return shortlistedIds
      .map((id) => allTalents.find((t) => t.id === id))
      .filter((t): t is TalentDirectoryItem => Boolean(t));
  }, [shortlistedIds, allTalents]);

  const orderedProjects = useMemo(() => {
    return [...profile.projects].sort((a, b) => a.position - b.position);
  }, [profile.projects]);

  const otherTalents = useMemo(() => {
    return allTalents
      .filter((t) => t.id !== profile.id && t.is_verified)
      .slice(0, 3);
  }, [allTalents, profile.id]);

  const isCurrentProfileShortlisted = shortlistedIds.includes(profile.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-navy">
      <DirectoryNavbar
        shortlistCount={shortlistedPeople.length}
        onOpenShortlist={() => setIsDrawerOpen(true)}
      />

      <TalentProfileHeader
        profile={profile}
        isShortlisted={isCurrentProfileShortlisted}
        onToggleShortlist={() => handleToggleShortlist(profile)}
        onOpenShortlistDrawer={() => setIsDrawerOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-16">
        {/* Section 1: All Shipped Projects (1 to 3) */}
        <section>
          <div className="pb-6 border-b border-slate-200 mb-8">
            <h2 className="font-cabinet font-extrabold text-3xl sm:text-4xl leading-[1.14] tracking-tight text-navy">
              Projects built by{" "}
              <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
                {firstName}
              </span>
            </h2>
            <p className="mt-2.5 font-mulish text-base sm:text-lg text-slate-600">
              {orderedProjects.length}{" "}
              {orderedProjects.length === 1
                ? "project reviewed and verified"
                : "projects reviewed and verified"}{" "}
              by NitHub mentors
            </p>
          </div>

          <div className="space-y-8">
            {orderedProjects.map((project) => (
              <ProjectShowcaseCard
                key={project.id}
                project={project}
                authorName={profile.full_name}
              />
            ))}
          </div>
        </section>

        {/* Section 2: More Verified Talent */}
        {otherTalents.length > 0 && (
          <section className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
              <div>
                <h2 className="font-cabinet font-bold text-2xl sm:text-3xl text-navy tracking-tight">
                  Explore more talent from NitHub
                </h2>
                <p className="mt-1 font-mulish text-sm sm:text-base text-slate-600">
                  You can shortlist up to 5 people in a single introduction
                  request.
                </p>
              </div>

              <Link
                href="/directory"
                className="font-cabin text-sm font-semibold text-brand-green hover:underline underline-offset-4"
              >
                View all in directory →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherTalents.map((talent) => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  isShortlisted={shortlistedIds.includes(talent.id)}
                  onToggleShortlist={handleToggleShortlist}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <DirectoryFooter onOpenShortlist={() => setIsDrawerOpen(true)} />

      <ShortlistDrawer
        isOpen={isDrawerOpen}
        shortlistedPeople={shortlistedPeople}
        limitMessage={limitMessage}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        onRemovePerson={handleRemoveFromShortlist}
        onClearAll={handleClearShortlist}
        onDismissLimitMessage={() => setLimitMessage(null)}
      />
    </div>
  );
}
