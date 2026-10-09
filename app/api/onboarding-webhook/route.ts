import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 20;
const MAX_TEXT_LENGTH = 2000;

/*
 * Where the Google Apps Script attached to the Profile Marketing client
 * onboarding form (an external Google Form, not part of this codebase)
 * sends every new response. Never called from the browser — Apps Script
 * runs server-side inside Google's own infrastructure and posts here
 * directly, so this route is gated by a shared secret rather than
 * Turnstile (which only makes sense for a real browser).
 *
 * Writes through the service role client, not the public anon key: this
 * table has no anon insert policy at all (supabase/022_onboarding_
 * submissions.sql) — the secret check here is the only gate, so getting it
 * wrong would mean anyone could post fake, or read back real, client data.
 * Keep ONBOARDING_WEBHOOK_SECRET out of git, same as every other key.
 */
function normalizeDate(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return trimmed;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
  }

  const expectedSecret = process.env.ONBOARDING_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("[onboarding-webhook] ONBOARDING_WEBHOOK_SECRET not set — refusing all submissions.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }
  if (request.headers.get("x-webhook-secret") !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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

  const {
    firstName, lastName, gender, contact, email, emailPassword,
    linkedinEmail, linkedinPassword, address, dateOfBirth, nationality,
    ethnicity, residencyStatus, securityClearance, preferredJobTitles,
    preferredJobLocation, expectedSalaryRange, resumeUrl, linkedinPhotoUrl,
    reference1, reference2, reference3, googleResponseEmail, submittedAt,
  } = body as Record<string, unknown>;

  function requiredText(value: unknown): value is string {
    return typeof value === "string" && value.trim() !== "" && value.length <= MAX_TEXT_LENGTH;
  }
  function optionalText(value: unknown): value is string | undefined {
    return value === undefined || value === null || (typeof value === "string" && value.length <= MAX_TEXT_LENGTH);
  }
  // Every reference field is free text on the form (one respondent literally
  // wrote "not sure" for an email) — never required, never format-checked.
  function referenceColumns(value: unknown, prefix: string): Record<string, string | null> {
    const ref = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
    const field = (key: string) => (typeof ref[key] === "string" && (ref[key] as string).length <= MAX_TEXT_LENGTH ? (ref[key] as string).trim() || null : null);
    return {
      [`${prefix}_name`]: field("name"),
      [`${prefix}_title_company`]: field("titleAndCompany"),
      [`${prefix}_relationship`]: field("relationship"),
      [`${prefix}_email`]: field("email"),
      [`${prefix}_phone`]: field("phone"),
    };
  }

  const requiredFields: Record<string, unknown> = {
    firstName, lastName, gender, contact, email, linkedinEmail, linkedinPassword,
    address, dateOfBirth, nationality, ethnicity, residencyStatus, securityClearance,
    preferredJobTitles, preferredJobLocation, expectedSalaryRange,
  };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!requiredText(value)) return NextResponse.json({ error: `Missing or invalid field: ${key}` }, { status: 400 });
  }
  if (!optionalText(emailPassword) || !optionalText(googleResponseEmail) || !optionalText(resumeUrl) || !optionalText(linkedinPhotoUrl)) {
    return NextResponse.json({ error: "Invalid optional field." }, { status: 400 });
  }

  const client = getSupabaseServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Server isn't configured to store submissions yet." }, { status: 500 });

  const { error } = await client.from("onboarding_submissions").insert({
    first_name: (firstName as string).trim(),
    last_name: (lastName as string).trim(),
    gender: (gender as string).trim(),
    contact: (contact as string).trim(),
    email: (email as string).trim(),
    email_password: typeof emailPassword === "string" && emailPassword.trim() !== "" ? emailPassword : null,
    linkedin_email: (linkedinEmail as string).trim(),
    linkedin_password: linkedinPassword as string,
    address: (address as string).trim(),
    date_of_birth: normalizeDate(dateOfBirth),
    nationality: (nationality as string).trim(),
    ethnicity: (ethnicity as string).trim(),
    residency_status: (residencyStatus as string).trim(),
    security_clearance: (securityClearance as string).trim(),
    preferred_job_titles: (preferredJobTitles as string).trim(),
    preferred_job_location: (preferredJobLocation as string).trim(),
    expected_salary_range: (expectedSalaryRange as string).trim(),
    resume_url: typeof resumeUrl === "string" && resumeUrl.trim() !== "" ? resumeUrl.trim() : null,
    linkedin_photo_url: typeof linkedinPhotoUrl === "string" && linkedinPhotoUrl.trim() !== "" ? linkedinPhotoUrl.trim() : null,
    ...referenceColumns(reference1, "reference1"),
    ...referenceColumns(reference2, "reference2"),
    ...referenceColumns(reference3, "reference3"),
    google_response_email: typeof googleResponseEmail === "string" && googleResponseEmail.trim() !== "" ? googleResponseEmail : null,
    submitted_at: typeof submittedAt === "string" && submittedAt.trim() !== "" ? submittedAt : new Date().toISOString(),
  });

  if (error) {
    console.error("[onboarding-webhook] Insert failed:", error.message);
    return NextResponse.json({ error: "Something went wrong saving the submission." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
