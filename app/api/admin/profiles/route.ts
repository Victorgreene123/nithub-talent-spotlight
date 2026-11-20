import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-response';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/profiles?status=pending|approved
 * Frontend (Victor) contract:
 * - Query `status`: optional ('pending' -> is_verified = false; 'approved' -> is_verified = true; omitted -> all)
 * - Pending profiles are returned oldest first (created_at asc)
 * - Auth: requires confirmed admin session (401 if signed out, 403 if non-admin)
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    if (statusParam && statusParam !== 'pending' && statusParam !== 'approved') {
      return apiError(
        400,
        'VALIDATION_ERROR',
        'status must be either "pending" or "approved"',
        { status: 'Expected "pending" or "approved"' }
      );
    }

    const serviceSupabase = createServiceSupabaseClient();

    let query = serviceSupabase
      .from('users')
      .select(
        'id, full_name, email, account_role, track, bio, cohort_year, availability_status, github_url, linkedin_url, x_url, avatar_url, is_verified, consented_at, created_at, updated_at'
      );

    if (statusParam === 'pending') {
      query = query.eq('is_verified', false).order('created_at', { ascending: true });
    } else if (statusParam === 'approved') {
      query = query.eq('is_verified', true).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: true });
    }

    const { data: profiles, error: profilesError } = await query;
    if (profilesError) {
      console.error('GET /api/admin/profiles query error:', profilesError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load profiles');
    }

    const userList = profiles ?? [];
    if (userList.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const userIds = userList.map((u) => u.id);
    const { data: projects, error: projectsError } = await serviceSupabase
      .from('projects')
      .select('id, user_id, title, tagline, tech_stack, live_url, repo_url, thumbnail_url, position')
      .in('user_id', userIds)
      .order('position', { ascending: true });

    if (projectsError) {
      console.error('GET /api/admin/profiles projects error:', projectsError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load profile projects');
    }

    const projectsByUser = new Map<string, typeof projects>();
    for (const proj of projects ?? []) {
      const arr = projectsByUser.get(proj.user_id) ?? [];
      arr.push(proj);
      projectsByUser.set(proj.user_id, arr);
    }

    const enriched = userList.map((u) => ({
      ...u,
      projects: projectsByUser.get(u.id) ?? [],
    }));

    return NextResponse.json({ data: enriched }, { status: 200 });
  } catch (err) {
    console.error('GET /api/admin/profiles unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading admin profiles');
  }
}