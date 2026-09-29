import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";
import { getNotifyRecipient, sendDigestEmail } from "@/lib/resend";
import { computeDigestCounts, digestHasContent, formatDigestText, type DigestLeadRow, type DigestPageRow } from "@/lib/admin/digest";
import type { Department, LeadStatus } from "@/lib/admin/types";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60 * 60_000;
const RATE_LIMIT_MAX = 6;

const DEPARTMENTS: Department[] = ["career-services-operations", "business-formalisation-compliance"];

/*
 * Turns the dashboard's own stale/due-soon/overdue signals (lib/admin/
 * insight.ts's logic, reused via lib/admin/digest.ts) into a scheduled
 * push instead of something staff only sees if they happen to open the
 * dashboard. Nothing in this codebase runs cron jobs — Hostinger's own
 * scheduler (or any external one, e.g. cron-job.org) should POST here once
 * a day with the shared secret header. Never called from the browser.
 *
 * Same secret-header pattern as app/api/onboarding-webhook/route.ts: this
 * table has no anon read policy, so a wrong or missing secret is the only
 * gate, and it reads through the service-role client on purpose.
 *
 * Sends nothing when there's nothing to report — a "0 stale leads" email
 * every morning trains staff to stop reading them, same reasoning
 * insight.ts's own doc comment already gives for hiding an empty feed
 * instead of showing an "all quiet" card.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const expectedSecret = process.env.DAILY_DIGEST_SECRET;
  if (!expectedSecret) {
    console.error("[daily-digest] DAILY_DIGEST_SECRET not set — refusing all requests.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }
  if (request.headers.get("x-digest-secret") !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServiceRoleClient();
  if (!supabase) {
    console.error("[daily-digest] Service role client not configured — refusing.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const [leadsResult, pagesResult] = await Promise.all([
    supabase.from("leads").select("department, status, created_at, first_contacted_at, status_changed_at").not("status", "in", "(won,lost)"),
    supabase.from("service_pages").select("department, last_reviewed_at, review_cadence_days, due_soon_days"),
  ]);

  if (leadsResult.error || pagesResult.error) {
    console.error("[daily-digest] Failed to load data:", leadsResult.error ?? pagesResult.error);
    return NextResponse.json({ error: "Failed to load data." }, { status: 500 });
  }

  const leads: DigestLeadRow[] = leadsResult.data.map((row) => ({
    department: row.department as Department | null,
    status: row.status as LeadStatus,
    createdAt: row.created_at,
    firstContactedAt: row.first_contacted_at,
    statusChangedAt: row.status_changed_at,
  }));
  const pages: DigestPageRow[] = pagesResult.data.map((row) => ({
    department: row.department as Department,
    lastReviewedAt: row.last_reviewed_at,
    reviewCadenceDays: row.review_cadence_days,
    dueSoonDays: row.due_soon_days,
  }));

  // Group by resolved recipient, not department, so two departments that
  // fall back to the same unconfigured shared inbox get one combined email
  // instead of two identical-looking ones landing back to back.
  const byRecipient = new Map<string, string[]>();
  for (const department of DEPARTMENTS) {
    const counts = computeDigestCounts(leads, pages, department);
    if (!digestHasContent(counts)) continue;
    const recipient = getNotifyRecipient(department);
    const section = formatDigestText(department, counts);
    byRecipient.set(recipient, [...(byRecipient.get(recipient) ?? []), section]);
  }

  const today = new Date().toISOString().slice(0, 10);
  const sent: string[] = [];
  for (const [recipient, sections] of byRecipient) {
    const ok = await sendDigestEmail(recipient, `Daily digest — ${today}`, sections.join("\n\n---\n\n"));
    if (ok) sent.push(recipient);
  }

  return NextResponse.json({ ok: true, sentTo: sent, skipped: byRecipient.size === 0 ? "nothing to report" : undefined });
}
