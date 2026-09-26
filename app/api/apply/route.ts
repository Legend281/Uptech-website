import { NextRequest, NextResponse } from "next/server";
import { deriveDepartment, deriveLeadType } from "@/lib/admin/leads";
import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { notifyNewApplication } from "@/lib/resend";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 5;

const MAX_TEXT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-100);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const roleTitle = formData.get("roleTitle");
  const message = formData.get("message");
  const language = formData.get("language");
  const consent = formData.get("consent");
  const turnstileToken = formData.get("turnstileToken");
  const resume = formData.get("resume");

  // Server-side validation — CLAUDE.md Section 7: never trust client-side checks alone.
  if (typeof name !== "string" || name.trim() === "" || name.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof phone !== "string" || phone.trim() === "" || phone.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
  }
  if (roleTitle !== null && (typeof roleTitle !== "string" || roleTitle.length > MAX_TEXT_LENGTH)) {
    return NextResponse.json({ error: "Invalid role value." }, { status: 400 });
  }
  if (message !== null && (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH)) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }
  if (language !== "English" && language !== "French") {
    return NextResponse.json({ error: "A valid language selection is required." }, { status: 400 });
  }
  if (consent !== "true") {
    return NextResponse.json({ error: "Privacy Policy consent is required." }, { status: 400 });
  }
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ error: "Resume must be under 5MB." }, { status: 400 });
  }
  if (!ALLOWED_RESUME_TYPES.has(resume.type)) {
    return NextResponse.json({ error: "Resume must be a PDF or Word document." }, { status: 400 });
  }

  const turnstileResult = await verifyTurnstile(typeof turnstileToken === "string" ? turnstileToken : null, ip);
  if (!turnstileResult.ok) {
    return NextResponse.json({ error: "Bot verification failed. Please try again." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const resumePath = `${crypto.randomUUID()}-${sanitizeFilename(resume.name)}`;
  const { error: uploadError } = await supabase.storage.from("resumes").upload(resumePath, resume, {
    contentType: resume.type,
    upsert: false,
  });
  if (uploadError) {
    console.error("[apply] Resume upload failed:", uploadError);
    return NextResponse.json({ error: "Something went wrong uploading your resume. Please try again." }, { status: 500 });
  }

  // A job application is a Lead — Admin_Dashboard_Requirements.md Section
  // 3.11: "The same applies to CV submissions." service is fixed to
  // career-marketing since that's the only service value that routes to
  // Career Services Operations (deriveDepartment), which is the department
  // that actually owns "Careers page job postings, related leads."
  const service = "career-marketing" as const;
  const department = deriveDepartment(service);
  const type = deriveLeadType(service);
  const consentAt = new Date().toISOString();
  const roleLine = roleTitle ? `Applying for: ${roleTitle}` : "General application (no specific open role selected).";
  const fullMessage = [roleLine, typeof message === "string" && message.trim() !== "" ? message.trim() : null].filter(Boolean).join("\n\n");

  const { error: insertError } = await supabase.from("leads").insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    service,
    type,
    department: department ?? null,
    status: department ? "new" : "needs-triage",
    source: "careers-apply",
    language,
    message: fullMessage,
    resume_url: resumePath,
    consent_at: consentAt,
  });

  if (insertError) {
    console.error("[apply] Supabase insert failed:", insertError);
    return NextResponse.json({ error: "Something went wrong saving your application. Please try again." }, { status: 500 });
  }

  let resumeSignedUrl: string | undefined;
  const serviceRoleClient = getSupabaseServiceRoleClient();
  if (serviceRoleClient) {
    const { data, error } = await serviceRoleClient.storage.from("resumes").createSignedUrl(resumePath, SIGNED_URL_TTL_SECONDS);
    if (error) {
      console.error("[apply] Signed URL generation failed (the resume is still saved):", error);
    } else {
      resumeSignedUrl = data.signedUrl;
    }
  }

  await notifyNewApplication({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    roleTitle: typeof roleTitle === "string" ? roleTitle : undefined,
    message: typeof message === "string" ? message : undefined,
    language,
    resumeSignedUrl,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
