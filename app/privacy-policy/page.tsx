import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Uptech Consulting handles your personal data.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Privacy Policy" }];

// Content below was last substantively rewritten on this date — kept
// factual and separate from the legal-review banner above, since "when did
// the text last change" and "has counsel signed off on it" are two
// different questions.
const LAST_UPDATED = "September 29, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Privacy Policy</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-3 mb-4">
              How We Handle Your Information
            </h1>

            {/*
             * PENDING: LEGAL REVIEW. The factual sections (what's collected,
             * how it reaches us, third parties, cookies, security) describe
             * our best-effort, accurate understanding of what Uptech
             * Consulting actually does — verified against the real form
             * implementations, database schema, and third-party integrations
             * in this codebase. The policy positions that follow (retention
             * windows, the rights we commit to honoring, the minimum age)
             * are reasonable, conventional defaults chosen on 2026-09-29 to
             * ship a complete page rather than blank placeholders — not yet
             * confirmed by legal counsel, and specifically NOT a claim that
             * Cameroonian/US law requires exactly this. Do not remove this
             * banner until a real legal review has actually happened.
             */}
            <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>This page is pending legal review.</strong> It accurately describes what
                Uptech Consulting currently does with your information. The retention periods, rights,
                and international-transfer language below are reasonable working defaults, not yet
                confirmed by Uptech Consulting&apos;s legal counsel — treat the whole page as
                provisional until that review happens.
              </p>
            </div>

            <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">What We Collect</h2>
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    <strong>Contact and consultation requests:</strong> your name, email address,
                    phone/WhatsApp number, company or organization (if provided), the service
                    you&apos;re interested in, and the message you write.
                  </li>
                  <li>
                    <strong>Career applications:</strong> your name, contact details, the role
                    you&apos;re applying for, any message you add, and the CV/resume file you upload
                    (PDF or Word document).
                  </li>
                  <li>
                    <strong>Career Marketing &amp; Placement client onboarding:</strong> if you
                    engage this paid service, you&apos;re asked to complete a separate, more detailed
                    intake form directly with our Career Services team (not one of the forms on this
                    website). Because a dedicated specialist manages your job search on your behalf —
                    submitting applications and following up with recruiters under your name — that
                    intake collects more than the forms above: your full identity and contact
                    details, date of birth, nationality, ethnicity, and residency/immigration status
                    (needed to match you accurately to eligible roles), security clearance status,
                    job preferences and salary expectations, your resume and LinkedIn profile,
                    professional references, and — because your specialist needs to actually operate
                    them on your behalf — sign-in details for the email, LinkedIn, and job-portal
                    accounts you choose to share for that purpose. See{" "}
                    <strong>How We Keep Information Secure</strong> below for how that access is
                    restricted internally.
                  </li>
                  <li>
                    <strong>Technical information:</strong> when you submit a form, our servers
                    record your IP address briefly, solely to enforce rate limits and verify you
                    aren&apos;t a bot (see below) — not to identify or track you.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">How Your Information Reaches Us</h2>
                <p>
                  The Book a Consultation form and career applications on this website submit your
                  information — and your CV/resume if you attach one — directly and securely (over
                  HTTPS) to our systems, so a specialist can respond or evaluate your application.
                  Both forms are protected by Cloudflare Turnstile bot-verification and are
                  rate-limited to prevent abuse. Career Marketing &amp; Placement onboarding
                  information is collected separately, directly by our Career Services team once you
                  engage that service — it does not pass through this website.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Why We Collect It</h2>
                <p>
                  We use the information you send us to respond to your inquiry, evaluate your
                  application against current or future roles, deliver the service you&apos;ve
                  engaged us for, and contact you about relevant opportunities or services. We do not
                  sell your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Third Parties We Work With</h2>
                <p className="mb-3">
                  We use a small number of service providers to run this website and deliver our
                  services. None of them are permitted to use your information for their own
                  purposes.
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Supabase</strong> — hosts the database and file storage where your submissions, resumes, and onboarding records are kept.</li>
                  <li><strong>Resend</strong> — delivers the email notification our team receives when you submit a form.</li>
                  <li><strong>Cloudflare Turnstile</strong> — verifies you&apos;re not a bot before a form submission is accepted.</li>
                  <li><strong>Sentry</strong> — used only to monitor and fix technical errors in our internal admin systems; it is not loaded on the public pages you browse, though our servers&apos; own error logs can incidentally include technical request details such as an IP address.</li>
                  <li><strong>WhatsApp (Meta):</strong> clicking a WhatsApp button on this site takes your conversation onto WhatsApp&apos;s own platform, governed by WhatsApp&apos;s privacy policy, not this one.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Cookies</h2>
                <p>
                  This website does not use advertising or analytics cookies to track you. Cloudflare
                  Turnstile may set a short-lived cookie as part of verifying you&apos;re not a bot
                  when you submit a form. Our staff-only admin dashboard uses a session cookie to keep
                  authorized staff logged in — this does not apply to visitors browsing the public
                  site.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">How We Keep Information Secure</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>All information travels over HTTPS.</li>
                  <li>Public forms are protected by bot-verification and rate limiting.</li>
                  <li>Internal access is role-based: only relevant staff can see the information you submit, and the most sensitive Career Marketing &amp; Placement onboarding records are restricted more tightly than any other internal records we keep, including to staff.</li>
                  <li>
                    If you&apos;re a Career Marketing &amp; Placement client, the account credentials
                    you share are stored as provided, so your dedicated specialist can actually use
                    them to submit applications and follow up on your behalf — this is a deliberate,
                    functional part of how that service works, not an oversight, and access to those
                    records is limited to authorized Career Services staff.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">International Data Transfers</h2>
                <p>
                  Uptech Consulting operates in both Cameroon and the United States, and the service
                  providers listed above host data on infrastructure that may be located outside the
                  country you&apos;re in. As a result, your information may be processed in a
                  different country from the one where you submitted it. Wherever it&apos;s processed,
                  we require the providers we work with to protect it with the same care described in
                  this policy, and we do not authorize any of them to use it for their own purposes.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Data Retention</h2>
                <p>
                  We keep contact requests and career applications for up to 24 months from your last
                  interaction with us, so a specialist can follow up if a relevant opportunity comes
                  up, and then delete them unless you&apos;ve become a client. If you engage a service
                  with us, we keep your records for as long as the engagement runs and for a further
                  period afterward to meet our own accounting and business record-keeping
                  obligations. You can ask us to delete your information sooner at any time — see
                  Your Rights below.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Your Rights</h2>
                <p className="mb-3">
                  Depending on where you&apos;re based, you may have additional rights over your
                  personal data under Cameroonian and/or US law. Regardless of location, Uptech
                  Consulting offers everyone the same baseline choices: you can ask us what
                  information we hold about you, ask us to correct anything that&apos;s inaccurate,
                  ask us to delete it, or ask us to stop contacting you about future opportunities or
                  services. To exercise any of these, email us at the address below — we&apos;ll
                  confirm your identity and respond within a reasonable time.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Children&apos;s Privacy</h2>
                <p>
                  This website and our services are intended for individuals who are at least 18
                  years old. We do not knowingly collect personal information from anyone under 18.
                  If you believe a minor has provided us information, contact us at the address below
                  and we will delete it.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Changes to This Policy</h2>
                <p>
                  We may update this policy as our services or practices change. The date below
                  reflects the last time this page&apos;s content was updated.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Contact Us</h2>
                <p>
                  Questions about this policy, or requests about your personal data, can be sent to{" "}
                  <a href="mailto:infos@uptechconsulting.com" className="text-blue-accent underline hover:text-blue-700">
                    infos@uptechconsulting.com
                  </a>
                  .
                </p>
              </section>

              <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
