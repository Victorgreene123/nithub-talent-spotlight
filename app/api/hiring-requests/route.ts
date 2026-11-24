import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { apiError } from '@/lib/api-response';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory IP rate limiter: max 5 requests per 60 minutes per IP.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (ipHits.get(ip) ?? []).filter((ts) => ts > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

/**
 * POST /api/hiring-requests
 * Frontend (Victor) contract:
 * - Request JSON body:
 *   {
 *     company_name: string,
 *     contact_email: string,
 *     contact_phone?: string | null,
 *     engagement_type: string,
 *     notes: string,
 *     shortlisted_user_ids: string[], // 1 to 5 public intern UUIDs
 *     website?: string // optional honeypot field; if non-empty, silently ignored
 *   }
 * - Success (201): { id: string }
 * - Errors: 400 (validation), 429 (more than 5/hr per IP)
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return apiError(
        429,
        'RATE_LIMITED',
        'Too many hiring requests submitted from this IP. Please try again later.'
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid JSON request body');
    }

    // Honeypot check: if a bot fills a hidden field (e.g. `website`, `website_url`, or `company_website`),
    // silently discard without touching the database or sending email.
    const honeypot =
      typeof body.website === 'string'
        ? body.website.trim()
        : typeof body.website_url === 'string'
        ? body.website_url.trim()
        : '';
    if (honeypot.length > 0) {
      return NextResponse.json(
        { id: '00000000-0000-0000-0000-000000000000' },
        { status: 201 }
      );
    }

    const companyName = typeof body.company_name === 'string' ? body.company_name.trim() : '';
    const contactEmail = typeof body.contact_email === 'string' ? body.contact_email.trim() : '';
    const contactPhone =
      typeof body.contact_phone === 'string' && body.contact_phone.trim().length > 0
        ? body.contact_phone.trim()
        : null;
    const engagementType =
      typeof body.engagement_type === 'string' ? body.engagement_type.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const rawIds = Array.isArray(body.shortlisted_user_ids) ? body.shortlisted_user_ids : [];

    const fields: Record<string, string> = {};
    if (!companyName) fields.company_name = 'Company name is required';
    if (!contactEmail || !EMAIL_REGEX.test(contactEmail)) {
      fields.contact_email = 'Valid contact email is required';
    }
    if (!engagementType) fields.engagement_type = 'Engagement type is required';
    if (!notes) fields.notes = 'Job description / notes are required';

    const uniqueIds = Array.from(
      new Set(rawIds.filter((id): id is string => typeof id === 'string').map((id) => id.trim()))
    );

    if (
      rawIds.length === 0 ||
      uniqueIds.length !== rawIds.length ||
      uniqueIds.length < 1 ||
      uniqueIds.length > 5 ||
      !uniqueIds.every((id) => UUID_REGEX.test(id))
    ) {
      fields.shortlisted_user_ids = 'Select between 1 and 5 valid shortlisted interns';
    }

    if (Object.keys(fields).length > 0) {
      return apiError(400, 'VALIDATION_ERROR', 'Please fix the highlighted fields', fields);
    }

    // Uses service key server-side because anonymous visitors cannot read hiring_requests
    // and must have all shortlisted IDs verified against public profiles.
    const serviceSupabase = createServiceSupabaseClient();

    const { data: publicInterns, error: lookupError } = await serviceSupabase
      .from('public_talent')
      .select('id, full_name, track')
      .in('id', uniqueIds);

    if (lookupError) {
      console.error('POST /api/hiring-requests public_talent lookup error:', lookupError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to validate shortlisted interns');
    }

    const foundInterns = publicInterns ?? [];
    if (foundInterns.length !== uniqueIds.length) {
      return apiError(
        400,
        'VALIDATION_ERROR',
        'One or more shortlisted interns are invalid or not publicly available',
        { shortlisted_user_ids: 'All shortlisted profiles must be approved and public' }
      );
    }

    const { data: inserted, error: insertError } = await serviceSupabase
      .from('hiring_requests')
      .insert({
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        engagement_type: engagementType,
        notes,
        shortlisted_user_ids: uniqueIds,
        status: 'new',
        notified_at: null,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      console.error('POST /api/hiring-requests insert error:', insertError);
      return apiError(500, 'INTERNAL_ERROR', 'Failed to save hiring request');
    }

    const requestId: string = inserted.id;

    // Send email alert via Resend. If sending fails, keep the row with notified_at = null.
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_ALERT_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NitHub Talent Spotlight <onboarding@resend.dev>';
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, '');

    if (resendApiKey && adminEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const internLines = foundInterns
          .map((intern) => {
            const profileUrl = `${appUrl}/talent/${intern.id}`;
            return `- ${intern.full_name}${intern.track ? ` (${intern.track})` : ''}: ${profileUrl}`;
          })
          .join('\n');

        const adminRequestUrl = `${appUrl}/admin`;

        const textBody = [
          `New hiring request from ${companyName}`,
          '',
          `Company: ${companyName}`,
          `Contact Email: ${contactEmail}`,
          `Contact Phone: ${contactPhone ?? 'Not provided'}`,
          `Role / Engagement Type: ${engagementType}`,
          '',
          `Job Description / Notes:`,
          notes,
          '',
          `Shortlisted Interns (${foundInterns.length}):`,
          internLines,
          '',
          `View in Admin Dashboard: ${adminRequestUrl}`,
        ].join('\n');

        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: [adminEmail],
          subject: `New hiring request from ${companyName}`,
          text: textBody,
        });

        if (sendError) {
          console.error('POST /api/hiring-requests Resend error:', sendError);
        } else {
          const { error: notifyUpdateError } = await serviceSupabase
            .from('hiring_requests')
            .update({ notified_at: new Date().toISOString() })
            .eq('id', requestId);

          if (notifyUpdateError) {
            console.error('POST /api/hiring-requests notified_at update error:', notifyUpdateError);
          }
        }
      } catch (emailErr) {
        console.error('POST /api/hiring-requests email exception:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY or ADMIN_ALERT_EMAIL not configured; skipping email alert');
    }

    return NextResponse.json({ id: requestId }, { status: 201 });
  } catch (err) {
    console.error('POST /api/hiring-requests unexpected error:', err);
    return apiError(500, 'INTERNAL_ERROR', 'Unexpected error submitting hiring request');
  }
}