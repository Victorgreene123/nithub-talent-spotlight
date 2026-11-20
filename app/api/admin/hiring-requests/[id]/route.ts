import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-response';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/admin/hiring-requests/[id]
 * Frontend (Victor) contract:
 * - Path param `id`: hiring request UUID
 * - Returns request detail + `shortlisted_interns`: [{ id, full_name, track, profile_url }]
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await context.params;
    if (!id || !UUID_REGEX.test(id)) {
      return apiError(404, 'NOT_FOUND', 'Hiring request not found');
    }

    const serviceSupabase = createServiceSupabaseClient();

    const { data: requestRow, error: requestError } = await serviceSupabase
      .from('hiring_requests')
      .select(
        'id, company_name, contact_email, contact_phone, engagement_type, notes, shortlisted_user_ids, status, notified_at, created_at'
      )
      .eq('id', id)
      .maybeSingle();

    if (requestError) {
      console.error('GET /api/admin/hiring-requests/[id] query error:', requestError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load hiring request');
    }

    if (!requestRow) {
      return apiError(404, 'NOT_FOUND', 'Hiring request not found');
    }

    const ids: string[] = Array.isArray(requestRow.shortlisted_user_ids)
      ? requestRow.shortlisted_user_ids
      : [];

    let internsById = new Map<string, { id: string; full_name: string; track: string | null }>();
    if (ids.length > 0) {
      const { data: usersData, error: usersError } = await serviceSupabase
        .from('users')
        .select('id, full_name, track')
        .in('id', ids);

      if (usersError) {
        console.error('GET /api/admin/hiring-requests/[id] users error:', usersError);
        return apiError(500, 'INTERNAL_ERROR', 'Failed to resolve shortlisted interns');
      }

      internsById = new Map(
        (usersData ?? []).map((u) => [u.id, { id: u.id, full_name: u.full_name, track: u.track }])
      );
    }

    const shortlistedInterns = ids.map((internId) => {
      const match = internsById.get(internId);
      return {
        id: internId,
        full_name: match?.full_name ?? 'Unknown Intern',
        track: match?.track ?? null,
        profile_url: `/talent/${internId}`,
      };
    });

    return NextResponse.json(
      {
        ...requestRow,
        shortlisted_interns: shortlistedInterns,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('GET /api/admin/hiring-requests/[id] unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading hiring request detail');
  }
}