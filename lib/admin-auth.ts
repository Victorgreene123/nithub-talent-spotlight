import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/supabase/server';

const DEFAULT_ADMIN_DOMAINS = ['nithub.unilag.edu.ng', 'nithub.ng'];

export type RequireAdminResult =
  | {
      ok: true;
      user: {
        id: string;
        email: string;
      };
    }
  | {
      ok: false;
      response: NextResponse;
    };

function getAllowedAdminDomains(): string[] {
  const raw = process.env.NITHUB_ADMIN_DOMAINS || process.env.ADMIN_EMAIL_DOMAIN;
  if (!raw) return DEFAULT_ADMIN_DOMAINS;
  const parsed = raw
    .split(',')
    .map((d) => d.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean);
  return parsed.length > 0 ? parsed : DEFAULT_ADMIN_DOMAINS;
}

function isAllowedAdminEmail(email: string): boolean {
  const lower = email.trim().toLowerCase();
  const domain = lower.split('@')[1] ?? '';
  return getAllowedAdminDomains().includes(domain);
}

/**
 * Verifies the request comes from a signed-in user with a confirmed email
 * matching the NitHub domain AND `account_role === 'admin'` in the `users` table.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        response: apiError(401, 'UNAUTHORIZED', 'Authentication required'),
      };
    }

    const email = user.email?.trim().toLowerCase() ?? '';
    const isEmailConfirmed = Boolean(
      user.email_confirmed_at || (user as { confirmed_at?: string }).confirmed_at
    );

    if (!email || !isEmailConfirmed || !isAllowedAdminEmail(email)) {
      return {
        ok: false,
        response: apiError(
          403,
          'FORBIDDEN',
          'Admin access requires a confirmed NitHub domain email address'
        ),
      };
    }

    const serviceSupabase = createServiceSupabaseClient();
    const { data: userRow, error: roleError } = await serviceSupabase
      .from('users')
      .select('id, account_role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleError) {
      console.error('requireAdmin users lookup error:', roleError);
      return {
        ok: false,
        response: apiError(500, 'INTERNAL_ERROR', 'Failed to verify admin role'),
      };
    }

    if (!userRow || userRow.account_role !== 'admin') {
      return {
        ok: false,
        response: apiError(403, 'FORBIDDEN', 'Admin privileges required'),
      };
    }

    return {
      ok: true,
      user: {
        id: user.id,
        email,
      },
    };
  } catch (err) {
    console.error('requireAdmin unexpected error:', err);
    return {
      ok: false,
      response: apiError(500, 'INTERNAL_ERROR', 'Failed to verify authentication'),
    };
  }
}
