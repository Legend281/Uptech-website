import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabase/routeHandler";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ["administrator", "editor", "viewer"];
const VALID_DEPARTMENTS = ["career-services-operations", "business-formalisation-compliance"];
const VALID_LANGUAGES = ["English", "French"];

/*
 * Admin_Dashboard_Requirements.md Section 2: only an Administrator can
 * manage users. Enforced here, server-side, not just by hiding the nav link
 * (Section 9: "not just hidden UI ... blocked at the API level") — anyone
 * could otherwise POST here directly with a valid session and provision
 * themselves a colleague's access.
 *
 * Sends a real Supabase Auth invite (magic link, no password ever set or
 * seen by the admin) rather than generating a temporary password — the new
 * hire sets their own via /admin/set-password. Requires custom SMTP
 * configured in the Supabase dashboard (Authentication -> Emails -> SMTP)
 * for reliable delivery; Supabase's default built-in sender is a
 * few-emails-per-hour testing-only fallback.
 */
export async function POST(request: NextRequest) {
  const callerClient = await getSupabaseRouteHandlerClient();
  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: callerProfile, error: callerProfileError } = await callerClient.from("profiles").select("role").eq("id", caller.id).single();
  if (callerProfileError || callerProfile?.role !== "administrator") {
    return NextResponse.json({ error: "Only an Administrator can add staff accounts." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, role, department, avatarInitials, location, languages } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "" || name.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof role !== "string" || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "A valid role is required." }, { status: 400 });
  }
  if (typeof department !== "string" || !VALID_DEPARTMENTS.includes(department)) {
    return NextResponse.json({ error: "A valid department is required." }, { status: 400 });
  }
  if (typeof avatarInitials !== "string" || avatarInitials.trim() === "" || avatarInitials.length > 4) {
    return NextResponse.json({ error: "Initials are required (max 4 characters)." }, { status: 400 });
  }
  if (typeof location !== "string" || location.trim() === "") {
    return NextResponse.json({ error: "A location is required." }, { status: 400 });
  }
  if (!Array.isArray(languages) || languages.length === 0 || !languages.every((l) => VALID_LANGUAGES.includes(l))) {
    return NextResponse.json({ error: "At least one valid language is required." }, { status: 400 });
  }

  const serviceRoleClient = getSupabaseServiceRoleClient();
  if (!serviceRoleClient) {
    return NextResponse.json({ error: "Server isn't configured to create accounts yet (missing service role key)." }, { status: 500 });
  }

  const redirectTo = `${request.nextUrl.origin}/admin/set-password`;
  const { data: invited, error: inviteError } = await serviceRoleClient.auth.admin.inviteUserByEmail(email.trim(), { redirectTo });

  if (inviteError || !invited.user) {
    console.error("[admin/staff] Invite failed:", inviteError);
    const message = inviteError?.message.includes("already been registered") ? "That email already has an account." : "Couldn't send the invite. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { error: profileError } = await serviceRoleClient.from("profiles").insert({
    id: invited.user.id,
    name: name.trim(),
    role,
    department,
    avatar_initials: avatarInitials.trim().toUpperCase(),
    location: location.trim(),
    languages,
  });

  if (profileError) {
    console.error("[admin/staff] Profile insert failed after invite was already sent:", profileError);
    return NextResponse.json({ error: "Invite was sent, but saving their profile failed. Ask an Administrator to check the profiles table." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
