import { Resend } from "resend";
import type { Department } from "@/lib/admin/types";

const NOTIFY_TO_FALLBACK = "infos@uptechconsulting.com";
const NOTIFY_FROM = "Uptech Consulting Website <onboarding@resend.dev>";

/*
 * Department → dedicated inbox, so a career application and a business
 * lead stop landing in the exact same shared inbox. Env-var driven, same
 * optional-with-graceful-fallback posture as every other key in this file:
 * a department without its own address configured (or an ambiguous lead
 * with no department at all) falls back to NOTIFY_EMAIL_DEFAULT, or the
 * hardcoded shared address if that isn't set either. Nothing breaks if
 * these are never configured — behavior is identical to before this
 * existed.
 */
const DEPARTMENT_NOTIFY_ENV: Record<Department, string> = {
  "career-services-operations": "NOTIFY_EMAIL_CAREER_SERVICES",
  "business-formalisation-compliance": "NOTIFY_EMAIL_BUSINESS_FORMALISATION",
};

export function getNotifyRecipient(department?: Department | null): string {
  if (department) {
    const configured = process.env[DEPARTMENT_NOTIFY_ENV[department]];
    if (configured) return configured;
  }
  return process.env.NOTIFY_EMAIL_DEFAULT || NOTIFY_TO_FALLBACK;
}

/*
 * Best-effort email notification alongside the real database write — per
 * Admin_Dashboard_Requirements.md Section 3.11, the Supabase insert must
 * not be lost even if this fails, so a missing key or a send error is
 * logged and swallowed here rather than thrown. The lead is already saved
 * by the time this runs; email is a notification, not the record of truth.
 *
 * NOTIFY_FROM uses Resend's own shared onboarding@resend.dev sender,
 * which works with zero setup — swap this for a verified
 * @uptechconsulting.com address once that domain is verified in Resend.
 */
export async function notifyNewLead(params: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceLabel: string;
  message: string;
  department?: Department | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[leads] RESEND_API_KEY not set — skipping email notification (the lead was still saved).");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: NOTIFY_FROM,
      to: getNotifyRecipient(params.department),
      subject: `New lead: ${params.name} — ${params.serviceLabel}`,
      text: [
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Phone / WhatsApp: ${params.phone}`,
        `Company: ${params.company || "—"}`,
        `Interested in: ${params.serviceLabel}`,
        "",
        params.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[leads] Resend notification failed (the lead was still saved to Supabase):", error);
  }
}

/*
 * Same best-effort posture as notifyNewLead. resumeSignedUrl is the one
 * place a staff member can actually reach the uploaded file today — the
 * admin dashboard can't read the leads table back yet (see Lead.resumeUrl's
 * comment), so until real staff auth exists, this email IS the applicant
 * pipeline, not just a notification of one.
 */
export async function notifyNewApplication(params: {
  name: string;
  email: string;
  phone: string;
  roleTitle?: string;
  message?: string;
  resumeSignedUrl?: string;
  department?: Department | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[apply] RESEND_API_KEY not set — skipping email notification (the application was still saved).");
    return;
  }

  const roleLine = params.roleTitle ? `Applying for: ${params.roleTitle}` : "General application (no specific open role selected)";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: NOTIFY_FROM,
      to: getNotifyRecipient(params.department),
      subject: `New application: ${params.name}${params.roleTitle ? ` — ${params.roleTitle}` : ""}`,
      text: [
        roleLine,
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Phone / WhatsApp: ${params.phone}`,
        "",
        params.message?.trim() ? params.message : "(no additional message)",
        "",
        params.resumeSignedUrl
          ? `Resume (link expires in 7 days): ${params.resumeSignedUrl}`
          : "Resume was uploaded, but a signed download link couldn't be generated — check the resumes bucket directly in Supabase Storage.",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[apply] Resend notification failed (the application was still saved):", error);
  }
}

/**
 * Sends one daily-digest email to a resolved recipient (already computed by
 * the caller — this function doesn't know about departments, just sends
 * what it's given). Same best-effort posture as the two notify functions:
 * a missing key or send error is logged and swallowed, never thrown, since
 * this always runs from a scheduled job with nobody watching for a thrown
 * error to surface.
 */
export async function sendDigestEmail(to: string, subject: string, body: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[digest] RESEND_API_KEY not set — skipping digest email.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: NOTIFY_FROM, to, subject, text: body });
    return true;
  } catch (error) {
    console.error("[digest] Resend send failed:", error);
    return false;
  }
}
