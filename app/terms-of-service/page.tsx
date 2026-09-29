import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Uptech Consulting website.",
  alternates: { canonical: `${SITE_URL}/terms-of-service` },
};

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Terms of Service" }];

// Content below was last substantively rewritten on this date — kept
// factual and separate from the legal-review banner above, since "when did
// the text last change" and "has counsel signed off on it" are two
// different questions.
const LAST_UPDATED = "September 29, 2026";

const PendingBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300 align-middle">
    {children}
  </span>
);

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main>
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Terms of Service</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-3 mb-4">
              Terms of Service
            </h1>

            {/*
             * PENDING: LEGAL REVIEW. Content below is a substantially
             * complete, good-faith draft grounded in what this site and
             * Uptech Consulting's services actually do (verified against
             * the real form implementations and the Career Marketing &
             * Placement onboarding flow in this codebase). Standard,
             * non-jurisdiction-specific boilerplate (acceptable use, IP
             * ownership, a generic liability disclaimer) is drafted in
             * full; anything that requires an actual legal decision this
             * session has no authority to make — which law governs these
             * terms, dispute venue/process — is explicitly marked pending
             * rather than invented. Do not treat any of this as final or
             * remove the pending markers without real legal review.
             */}
            <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>This page is pending legal review.</strong> It is a substantially complete
                draft, not yet confirmed by Uptech Consulting&apos;s legal counsel — treat the marked
                items as provisional and everything else as a good-faith draft, not final terms.
              </p>
            </div>

            <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Acceptance of Terms</h2>
                <p>
                  By accessing or using this website, you agree to these Terms of Service. If you do
                  not agree, please do not use this site.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Use of This Site</h2>
                <p className="mb-3">
                  This website is provided to share information about Uptech Consulting&apos;s
                  services, publish career opportunities, and let visitors reach out for a
                  consultation or job application. When using it, you agree not to:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>submit false, misleading, or fraudulent information through any form on this site;</li>
                  <li>attempt to disrupt, overload, or gain unauthorized access to this site or the systems behind it;</li>
                  <li>scrape, systematically extract, or republish content from this site without our permission;</li>
                  <li>use this site to submit or transmit unlawful, harmful, or infringing content.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Accounts You Give Us Access To</h2>
                <p>
                  If you engage Career Marketing &amp; Placement, you may choose to share sign-in
                  details for email, LinkedIn, or job-portal accounts so your dedicated specialist can
                  submit applications and follow up on your behalf. By sharing those details, you
                  confirm you have the right to do so and authorize Uptech Consulting to access and
                  use those accounts solely to perform the service you&apos;ve engaged us for. You may
                  revoke that access at any time — for example, by changing the password — and should
                  tell us if you do, so we know to stop.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">No Guarantee of Outcome</h2>
                <p>
                  Engaging with a service described on this site (including Career Marketing &amp;
                  Placement or a career application) does not guarantee a specific outcome, such as
                  job placement, interview results, or approval of a business filing. We commit to the
                  work described for each service, not to a result outside our control.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Intellectual Property</h2>
                <p>
                  The text, graphics, logo, and design of this website belong to, or are licensed to,
                  Uptech Consulting. You may view and print pages for your own personal, non-commercial
                  reference. You may not reproduce, republish, or use them for any other purpose
                  without our written permission.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">What You Submit to Us</h2>
                <p>
                  When you submit a message, application, resume, or other content through this site,
                  you confirm it&apos;s accurate and that you have the right to share it — including
                  any reference contact details you provide. If you give a testimonial, we only
                  publish it publicly once you&apos;ve confirmed your consent, as recorded by our
                  team.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Third-Party Links</h2>
                <p>
                  This site links to third-party platforms such as WhatsApp. We don&apos;t control
                  those platforms, and your use of them is governed by their own terms, not these.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Disclaimer &amp; Limitation of Liability</h2>
                <p>
                  This website and its content are provided &quot;as is,&quot; without warranty of any
                  kind, including that it will be uninterrupted or error-free. To the maximum extent
                  permitted by applicable law, Uptech Consulting is not liable for indirect,
                  incidental, or consequential damages arising from your use of this site.{" "}
                  <PendingBadge>PENDING: legal review of the exact liability language and any caps</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Governing Law &amp; Disputes</h2>
                <p>
                  Uptech Consulting operates as a Cameroon S.A. and a US S-Corp.{" "}
                  <PendingBadge>PENDING: confirm which jurisdiction&apos;s law governs these terms and how disputes are resolved</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Termination</h2>
                <p>
                  We may suspend or end a client engagement or your access to a service if these
                  terms are breached or a service is misused. Ending an engagement doesn&apos;t change
                  how information already collected is handled — that&apos;s governed by our{" "}
                  <a href="/privacy-policy" className="text-blue-accent underline hover:text-blue-700">
                    Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Changes to These Terms</h2>
                <p>
                  We may update these terms as our services change. Continued use of this site after
                  an update means you accept the revised terms. The date below reflects the last time
                  this page&apos;s content was updated.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Contact Us</h2>
                <p>
                  Questions about these terms can be sent to{" "}
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
