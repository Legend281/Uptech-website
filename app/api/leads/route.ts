import { NextRequest, NextResponse } from "next/server";
import { isServiceValue, serviceOptions } from "@/lib/serviceOptions";
import { deriveDepartment, deriveLeadType } from "@/lib/admin/leads";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/resend";

export const runtime = "nodejs";

/*
 * Best-effort in-memory rate limit — CLAUDE.md Section 7 requires "rate
 * limiting on the lead-capture API route." This is a real limiter, not
 * nothing, but it's per-server-instance memory: fine for a single Node
 * process (Hostinger, per CLAUDE.md's actual hosting choice), but it
 * resets on redeploy and won't coordinate across multiple instances. A
 * real multi-instance deployment would need a shared store (e.g. Upstash
 * Redis) instead — flagging that rather than pretending this is bulletproof.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 5;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  submissionsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

const MAX_TEXT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
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

  const { name, email, phone, company, service, language, message, consent } = body as Record<string, unknown>;

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
  if (company !== undefined && (typeof company !== "string" || company.length > MAX_TEXT_LENGTH)) {
    return NextResponse.json({ error: "Invalid company value." }, { status: 400 });
  }
  if (typeof service !== "string" || !isServiceValue(service)) {
    return NextResponse.json({ error: "A valid service selection is required." }, { status: 400 });
  }
  if (language !== "English" && language !== "French") {
    return NextResponse.json({ error: "A valid language selection is required." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim() === "" || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Privacy Policy consent is required." }, { status: 400 });
  }

  const department = deriveDepartment(service);
  const type = deriveLeadType(service);
  const consentAt = new Date().toISOString();

  const supabase = getSupabaseServerClient();
  const { error: insertError } = await supabase.from("leads").insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    company: typeof company === "string" && company.trim() !== "" ? company.trim() : null,
    service,
    type,
    department: department ?? null,
    // An ambiguous service (no derivable department) always lands in
    // needs-triage — never silently guessed. Mirrors LeadsProvider.addLead.
    status: department ? "new" : "needs-triage",
    source: "contact-form",
    language,
    message: message.trim(),
    consent_at: consentAt,
  });

  if (insertError) {
    console.error("[leads] Supabase insert failed:", insertError);
    return NextResponse.json({ error: "Something went wrong saving your message. Please try again." }, { status: 500 });
  }

  const serviceLabel = serviceOptions.find((option) => option.value === service)?.label ?? service;
  await notifyNewLead({ name: name.trim(), email: email.trim(), phone: phone.trim(), company: typeof company === "string" ? company.trim() : undefined, serviceLabel, language, message: message.trim() });

  return NextResponse.json({ ok: true }, { status: 201 });
}
