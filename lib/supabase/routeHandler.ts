import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/*
 * Cookie-bound server client for Route Handlers that need to know WHO is
 * calling (not the plain anon client in server.ts, which is used by public
 * routes like /api/leads that don't check identity). Reads the session from
 * the request's own cookies — the same session middleware.ts already
 * validated — so a Route Handler can look up the caller's role before doing
 * anything privileged.
 */
export async function getSupabaseRouteHandlerClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Route Handlers here only ever read the caller's identity, never
        // refresh/mutate the session — nothing to write back.
      },
    },
  });
}
