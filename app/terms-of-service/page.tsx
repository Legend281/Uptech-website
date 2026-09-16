import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Uptech Consulting website.",
};

const PendingBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300 align-middle">
    {children}
  </span>
);

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

      <main>
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Terms of Service</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-3 mb-4">
              Terms of Service
            </h1>

            {/*
             * PENDING: LEGAL REVIEW. This page did not exist before this
             * pass — added only because a Privacy-Policy-linked page needs
             * a Terms counterpart per Fix 1. Content here is a reasonable,
             * generic placeholder structure only, deliberately without
             * specific legal claims (governing jurisdiction, liability
             * caps, dispute process) this session has no authority to
             * invent. Do not treat any of this as final or remove the
             * pending markers without real legal review.
             */}
            <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>This page is pending legal review.</strong> It has not yet been drafted or
                confirmed by Uptech Consulting&apos;s legal counsel — treat everything below as a
                placeholder structure, not final terms.
              </p>
            </div>

            <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Acceptance of Terms</h2>
                <p>
                  By using this website, you agree to these Terms of Service.{" "}
                  <PendingBadge>PENDING: legal review</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Use of This Site</h2>
                <p>
                  This website is provided to share information about Uptech Consulting&apos;s
                  services, publish career opportunities, and let visitors reach out for a
                  consultation or job application.{" "}
                  <PendingBadge>PENDING: legal review of acceptable-use terms</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">No Guarantee of Outcome</h2>
                <p>
                  Engaging with a service described on this site (including Career Marketing &amp;
                  Placement or a career application) does not guarantee a specific outcome, such as
                  job placement or interview results.{" "}
                  <PendingBadge>PENDING: legal review of exact language</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Intellectual Property</h2>
                <p>
                  <PendingBadge>PENDING: legal review</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Limitation of Liability</h2>
                <p>
                  <PendingBadge>PENDING: legal review</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Governing Law</h2>
                <p>
                  Uptech Consulting operates as a Cameroon S.A. and a US S-Corp.{" "}
                  <PendingBadge>PENDING: confirm which jurisdiction&apos;s law governs these terms</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Changes to These Terms</h2>
                <p>
                  <PendingBadge>PENDING: legal review</PendingBadge>
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
                Last updated: <PendingBadge>PENDING</PendingBadge>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
