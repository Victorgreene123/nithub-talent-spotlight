import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-response';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * PATCH /api/admin/profiles/[id]
 * Frontend (Victor) contract:
 * - Path param `id`: intern user UUID
 * - Request JSON body: { is_verified: boolean }
 * - Returns 200 with updated profile fields
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await context.params;
    if (!id || !UUID_REGEX.test(id)) {
      return apiError(404, 'NOT_FOUND', 'Profile not found');
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid JSON request body');
    }

    if (typeof body.is_verified !== 'boolean') {
      return apiError(
        400,
        'VALIDATION_ERROR',
        'is_verified must be a boolean',
        { is_verified: 'Expected boolean (true or false)' }
      );
    }

    const serviceSupabase = createServiceSupabaseClient();

    const { data: updated, error: updateError } = await serviceSupabase
      .from('users')
      .update({ is_verified: body.is_verified })
      .eq('id', id)
      .select(
        'id, full_name, email, account_role, track, bio, cohort_year, availability_status, is_verified, updated_at'
      )
      .maybeSingle();

    if (updateError) {
      console.error('PATCH /api/admin/profiles/[id] update error:', updateError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to update profile approval status');
    }

    if (!updated) {
      return apiError(404, 'NOT_FOUND', 'Profile not found');
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/admin/profiles/[id] unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error updating profile');
  }
}