import { Resend } from "resend";

const NOTIFY_TO = "infos@uptechconsulting.com";
const NOTIFY_FROM = "Uptech Consulting Website <onboarding@resend.dev>";

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
  language: "English" | "French";
  message: string;
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
      to: NOTIFY_TO,
      subject: `New lead: ${params.name} — ${params.serviceLabel}`,
      text: [
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Phone / WhatsApp: ${params.phone}`,
        `Company: ${params.company || "—"}`,
        `Interested in: ${params.serviceLabel}`,
        `Preferred language: ${params.language}`,
        "",
        params.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[leads] Resend notification failed (the lead was still saved to Supabase):", error);
  }
}
