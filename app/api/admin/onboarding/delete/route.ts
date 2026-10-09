import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabase/routeHandler";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing submission ID." }, { status: 400 });
  }

  const serviceClient = getSupabaseServiceRoleClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Service role client not configured." }, { status: 500 });
  }

  // 1. Fetch the submission to get its case_number before deletion
  const { data: targetSubmission, error: fetchError } = await serviceClient
    .from("onboarding_submissions")
    .select("id, case_number")
    .eq("id", body.id)
    .single();

  if (fetchError || !targetSubmission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const deletedCaseNumber = targetSubmission.case_number;

  // 2. Delete the submission
  const { error: deleteError } = await serviceClient
    .from("onboarding_submissions")
    .delete()
    .eq("id", body.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // 3. Decrement all remaining case numbers higher than the deleted case number
  try {
    const { data: higherRows } = await serviceClient
      .from("onboarding_submissions")
      .select("id, case_number")
      .gt("case_number", deletedCaseNumber)
      .order("case_number", { ascending: true });

    if (higherRows && higherRows.length > 0) {
      for (const row of higherRows) {
        await serviceClient
          .from("onboarding_submissions")
          .update({ case_number: row.case_number - 1 })
          .eq("id", row.id);
      }
    }
  } catch (err) {
    console.warn("[onboarding] Case resequence note (may need migration 033):", err);
  }

  return NextResponse.json({ ok: true, deletedCaseNumber });
}
