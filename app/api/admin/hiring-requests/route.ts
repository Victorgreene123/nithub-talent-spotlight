import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError } from '@/lib/api-response';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/hiring-requests?page=1&page_size=20
 * Frontend (Victor) contract:
 * - Returns requests sorted newest first (created_at desc)
 * - Response: { data, page, page_size, total }
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('page_size');

    const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
    const pageSize = pageSizeParam ? Number.parseInt(pageSizeParam, 10) : 20;

    if (!Number.isInteger(page) || page < 1) {
      return apiError(400, 'VALIDATION_ERROR', 'page must be a positive integer', {
        page: 'Must be >= 1',
      });
    }
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      return apiError(400, 'VALIDATION_ERROR', 'page_size must be between 1 and 100', {
        page_size: 'Must be between 1 and 100',
      });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const serviceSupabase = createServiceSupabaseClient();

    const { data, error, count } = await serviceSupabase
      .from('hiring_requests')
      .select(
        'id, company_name, contact_email, contact_phone, engagement_type, notes, shortlisted_user_ids, status, notified_at, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('GET /api/admin/hiring-requests query error:', error);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to load hiring requests');
    }

    return NextResponse.json(
      {
        data: data ?? [],
        page,
        page_size: pageSize,
        total: count ?? 0,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('GET /api/admin/hiring-requests unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error loading hiring requests');
  }
}