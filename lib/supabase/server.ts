import { createClient } from "@supabase/supabase-js";

/*
 * Server-only client, used from API routes — never imported into a "use
 * client" component. Uses the anon key deliberately, not a service-role
 * key: the leads table's RLS policy (supabase/001_leads_table.sql) allows
 * that key to INSERT only, which is exactly the privilege this app needs
 * and no more.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set (see .env.local).");
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/*
 * Elevated, server-only client — used for exactly one privileged operation
 * today: generating a short-lived signed URL for a just-uploaded resume
 * (app/api/apply/route.ts), since the anon key can only INSERT into the
 * resumes bucket, not read it back (see supabase/002_leads_applications.sql).
 * Never imported into a "use client" file; never used for anything the anon
 * client can already do. Returns null (rather than throwing) when the key
 * isn't set yet, so a submission still succeeds — the resume is saved
 * either way, and its signed link is just skipped from the notification
 * email, the same graceful-degradation posture lib/resend.ts already uses
 * for a missing RESEND_API_KEY.
 */
export function getSupabaseServiceRoleClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn("[supabase] SUPABASE_SERVICE_ROLE_KEY not set — skipping resume signed-URL generation.");
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
