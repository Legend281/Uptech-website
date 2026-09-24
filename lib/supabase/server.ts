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
