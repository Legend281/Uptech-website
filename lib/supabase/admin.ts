import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Server-only caller check for app/api/admin routes. Deliberately uses the
 * caller's OWN session (their bearer token + the anon key), never the
 * service-role key: it can only see what that person could see anyway,
 * which is their own row in public.profiles (supabase/003_staff_auth.sql).
 */

export type StaffCaller = { id: string; name: string; role: "administrator" | "editor" | "viewer"; department: string };

/**
 * Who is calling: checks the bearer token with Supabase Auth, then requires
 * an active staff profile. Returns the caller, or the error response to send.
 */
export async function requireStaff(request: NextRequest): Promise<StaffCaller | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ error: "The server isn't configured for Supabase." }, { status: 500 });

  const asCaller = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userError } = await asCaller.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: "Your sign-in has expired. Sign in again." }, { status: 401 });

  const { data: profile } = await asCaller
    .from("profiles")
    .select("id, name, role, department, active")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!profile || profile.active === false) return NextResponse.json({ error: "This isn't an active staff account." }, { status: 403 });

  return { id: profile.id, name: profile.name, role: profile.role, department: profile.department };
}
