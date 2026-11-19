"use client";

import { TalentDirectoryItem } from "@/types/talent";
import { TalentCard } from "./TalentCard";

interface TalentGridProps {
  talents: TalentDirectoryItem[];
  shortlistedIds: string[];
  isLoading?: boolean;
  onToggleShortlist: (talent: TalentDirectoryItem) => void;
  onClearFilters: () => void;
}

export function TalentGrid({
  talents,
  shortlistedIds,
  isLoading = false,
  onToggleShortlist,
  onClearFilters,
}: TalentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/10] bg-slate-100" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-4/5" />
              <div className="pt-2 flex gap-2">
                <div className="h-5 w-16 bg-slate-100 rounded" />
                <div className="h-5 w-16 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (talents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 py-16 px-6 text-center max-w-lg mx-auto my-8">
        <h3 className="font-cabinet font-bold text-xl text-navy">
          No talent matches these exact filters
        </h3>
        <p className="mt-2 font-mulish text-sm text-slate-600">
          Try removing one of your skill or availability filters to see more
          people from our cohorts.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-navy text-white font-cabin text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {talents.map((talent) => (
        <TalentCard
          key={talent.id}
          talent={talent}
          isShortlisted={shortlistedIds.includes(talent.id)}
          onToggleShortlist={onToggleShortlist}
        />
      ))}
    </div>
  );
}
