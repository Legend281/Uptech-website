import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Server-only. The service-role key bypasses row-level security, so this
 * file is imported only by API routes under app/api/admin, and every one of
 * them calls requireStaff() first. Never import it from a "use client" file.
 */
export function getSupabaseServiceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.local).");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type StaffCaller = { id: string; name: string; role: "administrator" | "editor" | "viewer"; department: string };

/**
 * Who is calling: checks the bearer token with Supabase Auth, then requires
 * an active staff profile. Returns the caller, or the error response to send.
 */
export async function requireStaff(request: NextRequest): Promise<StaffCaller | NextResponse> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const service = getSupabaseServiceClient();
  const { data: userData, error: userError } = await service.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: "Your sign-in has expired. Sign in again." }, { status: 401 });

  const { data: profile } = await service
    .from("staff_profiles")
    .select("id, name, role, department, active")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!profile || !profile.active) return NextResponse.json({ error: "This isn't an active staff account." }, { status: 403 });

  return { id: profile.id, name: profile.name, role: profile.role, department: profile.department };
}
