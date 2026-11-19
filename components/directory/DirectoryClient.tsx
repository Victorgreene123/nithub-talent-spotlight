"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AvailabilityStatus,
  TalentDirectoryItem,
  Track,
} from "@/types/talent";
import { DirectoryNavbar } from "./DirectoryNavbar";
import { DirectoryHeader } from "./DirectoryHeader";
import { FilterBar } from "./FilterBar";
import { TalentGrid } from "./TalentGrid";
import { ShortlistDrawer } from "./ShortlistDrawer";
import { DirectoryFooter } from "./DirectoryFooter";

const SHORTLIST_STORAGE_KEY = "nithub_shortlist_ids";
const MAX_SHORTLIST = 5;

const VALID_ROLES: Track[] = [
  "frontend",
  "backend",
  "fullstack",
  "uiux",
  "aiml",
  "mobile",
  "hardware",
  "pm",
];

const VALID_AVAILABILITIES: AvailabilityStatus[] = [
  "available_now",
  "open_to_gigs",
  "in_cohort",
];

interface DirectoryClientProps {
  initialTalents: TalentDirectoryItem[];
  availableStackTags: string[];
}

export function DirectoryClient({
  initialTalents,
  availableStackTags,
}: DirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filters from URL query parameters
  const selectedRoles = useMemo(() => {
    const raw = searchParams.getAll("role");
    return raw.filter((r): r is Track => VALID_ROLES.includes(r as Track));
  }, [searchParams]);

  const selectedStacks = useMemo(() => {
    return searchParams.getAll("stack").filter(Boolean);
  }, [searchParams]);

  const selectedAvailabilities = useMemo(() => {
    const raw = searchParams.getAll("availability");
    return raw.filter((a): a is AvailabilityStatus =>
      VALID_AVAILABILITIES.includes(a as AvailabilityStatus)
    );
  }, [searchParams]);

  // Shortlist state persisted in sessionStorage
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

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

  function updateUrlParams(
    roles: Track[],
    stacks: string[],
    availabilities: AvailabilityStatus[]
  ) {
    const params = new URLSearchParams();
    roles.forEach((r) => params.append("role", r));
    stacks.forEach((s) => params.append("stack", s));
    availabilities.forEach((a) => params.append("availability", a));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleToggleRole(role: Track) {
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    updateUrlParams(next, selectedStacks, selectedAvailabilities);
  }

  function handleToggleStack(stack: string) {
    const exists = selectedStacks.some(
      (s) => s.toLowerCase() === stack.toLowerCase()
    );
    const next = exists
      ? selectedStacks.filter((s) => s.toLowerCase() !== stack.toLowerCase())
      : [...selectedStacks, stack];
    updateUrlParams(selectedRoles, next, selectedAvailabilities);
  }

  function handleToggleAvailability(availability: AvailabilityStatus) {
    const next = selectedAvailabilities.includes(availability)
      ? selectedAvailabilities.filter((a) => a !== availability)
      : [...selectedAvailabilities, availability];
    updateUrlParams(selectedRoles, selectedStacks, next);
  }

  function handleClearAllFilters() {
    updateUrlParams([], [], []);
  }

  // Filter logic: Within one filter category = OR; across categories = AND
  const filteredTalents = useMemo(() => {
    return initialTalents.filter((person) => {
      if (!person.is_verified) return false;

      const roleMatches =
        selectedRoles.length === 0 || selectedRoles.includes(person.track);

      const availabilityMatches =
        selectedAvailabilities.length === 0 ||
        selectedAvailabilities.includes(person.availability_status);

      const stackMatches =
        selectedStacks.length === 0 ||
        selectedStacks.some((selectedTag) =>
          person.top_project.tech_stack.some(
            (projectTag) =>
              projectTag.toLowerCase() === selectedTag.toLowerCase()
          )
        );

      return roleMatches && availabilityMatches && stackMatches;
    });
  }, [
    initialTalents,
    selectedRoles,
    selectedAvailabilities,
    selectedStacks,
  ]);

  const shortlistedPeople = useMemo(() => {
    return shortlistedIds
      .map((id) => initialTalents.find((t) => t.id === id))
      .filter((t): t is TalentDirectoryItem => Boolean(t));
  }, [shortlistedIds, initialTalents]);

  function handleToggleShortlist(talent: TalentDirectoryItem) {
    setLimitMessage(null);

    if (shortlistedIds.includes(talent.id)) {
      saveShortlist(shortlistedIds.filter((id) => id !== talent.id));
      return;
    }

    if (shortlistedIds.length >= MAX_SHORTLIST) {
      setLimitMessage(
        "You can shortlist up to 5 people per request. Remove someone from your shortlist to add another."
      );
      return;
    }

    saveShortlist([...shortlistedIds, talent.id]);
  }

  function handleRemoveFromShortlist(id: string) {
    saveShortlist(shortlistedIds.filter((item) => item !== id));
  }

  function handleClearShortlist() {
    saveShortlist([]);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-navy">
      <DirectoryNavbar
        shortlistCount={shortlistedPeople.length}
        onOpenShortlist={() => setIsDrawerOpen(true)}
      />

      <DirectoryHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20">
        <FilterBar
          selectedRoles={selectedRoles}
          selectedStacks={selectedStacks}
          selectedAvailabilities={selectedAvailabilities}
          availableStackTags={availableStackTags}
          totalResults={filteredTalents.length}
          onApplyFilters={updateUrlParams}
          onToggleRole={handleToggleRole}
          onToggleStack={handleToggleStack}
          onToggleAvailability={handleToggleAvailability}
          onClearAll={handleClearAllFilters}
        />

        <TalentGrid
          talents={filteredTalents}
          shortlistedIds={shortlistedIds}
          onToggleShortlist={handleToggleShortlist}
          onClearFilters={handleClearAllFilters}
        />
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
