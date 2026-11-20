import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/talent/[id]
 * Frontend (Victor) contract:
 * - Path param `id`: intern UUID
 * - Returns 200 with public profile fields + `projects` array sorted by `position` asc
 * - Returns 404 if unknown, unapproved, has no projects, or invalid ID
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || !UUID_REGEX.test(id)) {
      return apiError(404, 'NOT_FOUND', 'Talent profile not found');
    }

    const supabase = await createServerSupabaseClient();

    // `public_talent` already filters is_verified = true + >= 1 project and omits email/consented_at
    const { data: profile, error: profileError } = await supabase
      .from('public_talent')
      .select(
        'id, full_name, track, bio, cohort_year, availability_status, github_url, linkedin_url, x_url, avatar_url, is_verified, created_at, updated_at'
      )
      .eq('id', id)
      .maybeSingle();

    if (profileError) {
      console.error('GET /api/talent/[id] profile error:', profileError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load talent profile');
    }

    if (!profile) {
      return apiError(404, 'NOT_FOUND', 'Talent profile not found');
    }

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, tagline, tech_stack, live_url, repo_url, thumbnail_url, position')
      .eq('user_id', id)
      .order('position', { ascending: true });

    if (projectsError) {
      console.error('GET /api/talent/[id] projects error:', projectsError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load intern projects');
    }

    return NextResponse.json(
      {
        ...profile,
        projects: projects ?? [],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('GET /api/talent/[id] unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading talent profile');
  }
}