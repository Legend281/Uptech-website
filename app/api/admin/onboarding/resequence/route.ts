import { NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabase/routeHandler";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const callerClient = await getSupabaseRouteHandlerClient();
  const {
    data: { user: caller },
  } = await callerClient.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: callerProfile, error: callerProfileError } = await callerClient
    .from("profiles")
    .select("role, department")
    .eq("id", caller.id)
    .single();

  const isEligible =
    !callerProfileError &&
    (callerProfile?.role === "administrator" ||
      (callerProfile?.role === "editor" && callerProfile?.department === "career-services-operations"));

  if (!isEligible) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const serviceClient = getSupabaseServiceRoleClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Service role client not configured." }, { status: 500 });
  }

  // First try the database RPC function if migration 033 has been applied
  const { error: rpcError } = await serviceClient.rpc("resequence_all_onboarding_cases");
  if (!rpcError) {
    return NextResponse.json({ ok: true, method: "rpc" });
  }

  // Fallback: manually fetch and update row by row
  const { data: rows, error: fetchError } = await serviceClient
    .from("onboarding_submissions")
    .select("id, case_number")
    .order("submitted_at", { ascending: true })
    .order("created_at", { ascending: true })
    .order("case_number", { ascending: true });

  if (fetchError || !rows || rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const minCase = Math.min(...rows.map((r) => r.case_number));
  let curr = minCase;
  let updatedCount = 0;

  for (const row of rows) {
    if (row.case_number !== curr) {
      const { error: updateError } = await serviceClient
        .from("onboarding_submissions")
        .update({ case_number: curr })
        .eq("id", row.id);

      if (updateError) {
        console.warn("[onboarding] Direct update error (needs migration 033):", updateError.message);
        return NextResponse.json(
          {
            error:
              "Database requires migration 033: run supabase/033_resequence_onboarding_case_numbers.sql in Supabase SQL editor to enable case renumbering.",
          },
          { status: 400 }
        );
      }
      updatedCount++;
    }
    curr++;
  }

  return NextResponse.json({ ok: true, updatedCount });
}
