import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const VALID_TRACKS = new Set([
  'frontend',
  'backend',
  'fullstack',
  'uiux',
  'aiml',
  'mobile',
  'hardware',
  'pm',
]);
const VALID_AVAILABILITY = new Set(['available_now', 'open_to_gigs', 'in_cohort']);

type PublicTalentRow = {
  id: string;
  full_name: string;
  account_role: string;
  track: string | null;
  bio: string | null;
  cohort_year: number | null;
  availability_status: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  tagline: string;
  tech_stack: string[];
  live_url: string;
  repo_url: string;
  thumbnail_url: string | null;
  position: number;
};

/**
 * GET /api/talent
 * Frontend (Victor) contract:
 * - Repeatable query params: ?role=...&role=...&stack=...&availability=...
 * - Pagination query params: ?page=1&page_size=12
 * - Within one filter = OR; across filters = AND. `stack` matches if ANY project has that tag.
 * - Returns: { data: TalentCardItem[], page: number, total: number }
 */

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Repeatable params (?role=frontend&role=backend or comma-separated fallback)
        const rawRoles = searchParams.getAll('role').flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
        const rawStacks = searchParams.getAll('stack').flatMap((v) => v.split(',')).map((v) => v.trim().toLowerCase()).filter(Boolean);
        const rawAvailability = searchParams.getAll('availability').flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);

        // Validate enum values if provided
        for (const r of rawRoles) {
            if (!VALID_TRACKS.has(r)) {
                return apiError(400, 'VALIDATION_ERROR', `Invalid role filter: ${r}`, { role: 'Unsupported track value' });
            }
        }
        for (const a of rawAvailability) {
            if (!VALID_AVAILABILITY.has(a)) {
                return apiError(400, 'VALIDATION_ERROR', `Invalid availability filter: ${a}`, { availability: 'Unsupported availability value' });
            }
        }

        const pageParam = searchParams.get('page');
        const pageSizeParam = searchParams.get('page_size');

        const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
        const pageSize = pageSizeParam ? Number.parseInt(pageSizeParam, 10) : 12;

        if (!Number.isInteger(page) || page < 1) {
            return apiError(400, 'VALIDATION_ERROR', 'page must be a positive integer', { page: 'Must be >= 1' });
        }
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) {
            return apiError(400, 'VALIDATION_ERROR', 'page_size must be between 1 and 50', { page_size: 'Must be between 1 and 50' });
        }

        const supabase = await createServerSupabaseClient();

        // Query public_talent view (already enforces is_verified = true, >= 1 project, and hides email/consented_at)
        let talentQuery = supabase
            .from('public_talent')
            .select('*')
            .order('created_at', { ascending: false });

        if (rawRoles.length > 0) {
            talentQuery = talentQuery.in('track', rawRoles);
        }
        if (rawAvailability.length > 0) {
            talentQuery = talentQuery.in('availability_status', rawAvailability);
        }

        const { data: talentRows, error: talentError } = await talentQuery;
        if (talentError) {
            console.error('GET /api/talent public_talent error:', talentError);
            return apiError(500, 'INTERNAL_ERROR', 'Failed to load talent directory');
        }

        const profiles = (talentRows ?? []) as PublicTalentRow[];
        if (profiles.length === 0) {
            return NextResponse.json({ data: [], page, total: 0 }, { status: 200 });
        }

        const profileIds = profiles.map((p) => p.id);

        // Fetch projects for matching profiles so we can:
        // filter by `stack` (matching if ANY project of that intern contains any requested tag)
        // attach `top_project` (position === 1)
        const { data: projectRows, error: projectError } = await supabase
            .from('projects')
            .select('id, user_id, title, tagline, tech_stack, live_url, repo_url, thumbnail_url, position')
            .in('user_id', profileIds)
            .order('position', { ascending: true });

        if (projectError) {
            console.error('GET /api/talent projects error:', projectError);
            return apiError(500, 'INTERNAL_ERROR', 'Failed to load intern projects');
        }

        const projectsByUser = new Map<string, ProjectRow[]>();
        for (const proj of (projectRows ?? []) as ProjectRow[]) {
            const list = projectsByUser.get(proj.user_id) ?? [];
            list.push(proj);
            projectsByUser.set(proj.user_id, list);
        }

        // Apply `stack` filter (OR across requested stack tags; matches if ANY of the intern's projects has a tag)
        const filteredProfiles =
        rawStacks.length === 0
            ? profiles
            : profiles.filter((profile) => {
                const userProjects = projectsByUser.get(profile.id) ?? [];
                return userProjects.some((proj) =>
                (proj.tech_stack ?? []).some((tag) => rawStacks.includes(tag.toLowerCase()))
                );
            });

        const total = filteredProfiles.length;
        const startIndex = (page - 1) * pageSize;
        const pagedProfiles = filteredProfiles.slice(startIndex, startIndex + pageSize);

        const data = pagedProfiles.map((profile) => {
            const userProjects = projectsByUser.get(profile.id) ?? [];
            const topProj = userProjects.find((p) => p.position === 1) ?? userProjects[0] ?? null;

            return {
                id: profile.id,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                track: profile.track,
                availability_status: profile.availability_status,
                cohort_year: profile.cohort_year,
                is_verified: profile.is_verified,
                top_project: topProj
                    ? {
                        id: topProj.id,
                        title: topProj.title,
                        tagline: topProj.tagline,
                        tech_stack: topProj.tech_stack,
                        live_url: topProj.live_url,
                        repo_url: topProj.repo_url,
                        thumbnail_url: topProj.thumbnail_url,
                        }
                    : null,
            };
        });

        return NextResponse.json({ data, page, total }, { status: 200 });
    } catch (error) {
        console.error('GET /api/talent unexpected error', error);
        return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading talent');
    }
}