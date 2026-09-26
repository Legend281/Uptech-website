"use client";

import { createBrowserClient } from "@supabase/ssr";

/*
 * The one Supabase client every admin client component uses — auth session,
 * leads reads/writes, staff profile reads, resume downloads. createBrowserClient
 * (not the plain supabase-js createClient lib/supabase/server.ts's anon
 * client uses) also mirrors the session into a cookie, which is what lets
 * middleware.ts read it on the next request to gate /admin routes.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set (see .env.local).");
  }

  return createBrowserClient(url, anonKey);
}
