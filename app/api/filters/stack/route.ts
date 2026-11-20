import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/filters/stack
 * Frontend (Victor) contract:
 * - Returns { stacks: string[] } sorted alphabetically (deduplicated lowercase tags from public profiles only)
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: publicProfiles, error: talentError } = await supabase
      .from('public_talent')
      .select('id');

    if (talentError) {
      console.error('GET /api/filters/stack public_talent error:', talentError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load stack filters');
    }

    const publicIds = (publicProfiles ?? []).map((row) => row.id);
    if (publicIds.length === 0) {
      return NextResponse.json({ stacks: [] }, { status: 200 });
    }

    const { data: projectRows, error: projectsError } = await supabase
      .from('projects')
      .select('tech_stack')
      .in('user_id', publicIds);

    if (projectsError) {
      console.error('GET /api/filters/stack projects error:', projectsError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load project tech stacks');
    }

    const uniqueTags = new Set<string>();
    for (const row of projectRows ?? []) {
      for (const tag of row.tech_stack ?? []) {
        const cleaned = String(tag).trim().toLowerCase();
        if (cleaned) uniqueTags.add(cleaned);
      }
    }

    const stacks = Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ stacks }, { status: 200 });
  } catch (err) {
    console.error('GET /api/filters/stack unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading stack filters');
  }
}