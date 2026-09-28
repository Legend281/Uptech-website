import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabase/routeHandler";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/*
 * Per-account staff actions (resend invite, delete). Split from
 * app/api/admin/staff/route.ts (create) because both actions below need to
 * look up an existing account by id first, and DELETE has a real
 * confirmation flow in the UI that a POST-to-the-collection route doesn't
 * suit as cleanly.
 *
 * Both actions require the same "caller is an active Administrator" check
 * as the create route, enforced here server-side — not just hidden UI, per
 * Admin_Dashboard_Requirements.md Section 9.
 */
async function requireAdminCaller(): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const callerClient = await getSupabaseRouteHandlerClient();
  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();

  if (!caller) return { ok: false, status: 401, error: "Not signed in." };

  const { data: callerProfile, error: callerProfileError } = await callerClient
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (callerProfileError || callerProfile?.role !== "administrator") {
    return { ok: false, status: 403, error: "Only an Administrator can manage staff accounts." };
  }
  return { ok: true };
}

/*
 * Resend an invite/set-password link to an account that was already
 * created but never finished signing in (a dead first link, a typo'd
 * personal device, etc.) — the same mechanism "Forgot password?" on the
 * login page already uses (resetPasswordForEmail), just triggered by an
 * Administrator on someone else's behalf instead of the person themselves.
 * profiles has no email column by design (003_staff_auth.sql) — the
 * service-role client looks it up from auth.users directly.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminCaller();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  const serviceRoleClient = getSupabaseServiceRoleClient();
  if (!serviceRoleClient) {
    return NextResponse.json({ error: "Server isn't configured to resend invites yet (missing service role key)." }, { status: 500 });
  }

  const { data: userData, error: userError } = await serviceRoleClient.auth.admin.getUserById(id);
  if (userError || !userData.user?.email) {
    return NextResponse.json({ error: "Couldn't find that account's email." }, { status: 404 });
  }

  const redirectTo = `${request.nextUrl.origin}/admin/set-password`;
  const { error: resendError } = await serviceRoleClient.auth.resetPasswordForEmail(userData.user.email, { redirectTo });
  if (resendError) {
    console.error("[admin/staff] Resend failed:", resendError);
    return NextResponse.json({ error: "Couldn't send the link. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

/*
 * Permanently deletes the account — the real Supabase Auth user, not just
 * the profiles row. profiles.id references auth.users(id) on delete
 * cascade (003_staff_auth.sql), so the profile disappears automatically.
 * Every other table that points at a staff id (service_pages, leads via a
 * plain text column, additional_services, onboarding_submissions, settings)
 * either has no real foreign key or uses "on delete set null" — nothing
 * else breaks, it just stops resolving to a name.
 *
 * Deliberately separate from Deactivate (StaffProvider.updateUser): that
 * stays the default for a real former colleague, since it keeps their name
 * on past leads/reviews. This is for the cases Deactivate doesn't fit —
 * a mistaken invite, a duplicate, a test account — where there's nothing
 * worth keeping a record of.
 */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminCaller();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const callerClient = await getSupabaseRouteHandlerClient();
  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();

  const { id } = await params;

  if (caller?.id === id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const serviceRoleClient = getSupabaseServiceRoleClient();
  if (!serviceRoleClient) {
    return NextResponse.json({ error: "Server isn't configured to delete accounts yet (missing service role key)." }, { status: 500 });
  }

  const { data: target, error: targetError } = await serviceRoleClient.from("profiles").select("role, active").eq("id", id).single();
  if (targetError || !target) {
    return NextResponse.json({ error: "That account no longer exists." }, { status: 404 });
  }

  if (target.role === "administrator" && target.active !== false) {
    const { count, error: countError } = await serviceRoleClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "administrator")
      .neq("active", false)
      .neq("id", id);
    if (countError || !count) {
      return NextResponse.json({ error: "This is the last active Administrator. Make someone else an Administrator first." }, { status: 400 });
    }
  }

  const { error: deleteError } = await serviceRoleClient.auth.admin.deleteUser(id);
  if (deleteError) {
    console.error("[admin/staff] Delete failed:", deleteError);
    return NextResponse.json({ error: "Couldn't delete the account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
