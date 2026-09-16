import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Uptech Consulting handles your personal data.",
};

const PendingBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300 align-middle">
    {children}
  </span>
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <main>
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Privacy Policy</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-3 mb-4">
              How We Handle Your Information
            </h1>

            {/*
             * PENDING: LEGAL REVIEW. Everything on this page describes our
             * best-effort, accurate understanding of what this website
             * actually does with the data it touches (verified against the
             * real form implementations in this codebase — see the "How
             * Your Information Reaches Us" section below), not invented
             * legal boilerplate. It has NOT been reviewed by legal counsel
             * and must not be treated as final. Do not remove this notice
             * or the inline [PENDING] markers below without that review.
             */}
            <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>This page is pending legal review.</strong> It accurately describes what
                this website currently does with your information, but the specific legal language,
                retention periods, and stated rights below have not yet been confirmed by Uptech
                Consulting&apos;s legal counsel. Treat the marked items as provisional.
              </p>
            </div>

            <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">What We Collect</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong>Contact and consultation requests:</strong> your name, email address,
                    phone/WhatsApp number, company or organization (if provided), the service
                    you&apos;re interested in, and the message you write.
                  </li>
                  <li>
                    <strong>Career applications:</strong> your name, contact details, and the
                    contents of your CV/resume and any other information you choose to include in
                    your application.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">How Your Information Reaches Us</h2>
                <p>
                  Most forms on this site — including the Book a Consultation form and Careers
                  applications — do not submit your information directly to our servers. Instead,
                  they prepare a pre-filled WhatsApp message or email addressed to Uptech
                  Consulting, which <strong>you send yourself</strong> from your own device using
                  your own WhatsApp or email application. Nothing is stored on our systems through
                  this website until that message reaches us through the channel you choose to send
                  it on.{" "}
                  <PendingBadge>PENDING: confirm this description stays accurate if a direct server-side submission is added later</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Why We Collect It</h2>
                <p>
                  We use the information you send us to respond to your inquiry, evaluate your
                  application against current or future roles, and contact you about relevant
                  opportunities or services. We do not sell your information.{" "}
                  <PendingBadge>PENDING: legal review of third-party sharing language</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Data Retention</h2>
                <p>
                  <PendingBadge>PENDING: confirm retention period with Uptech Consulting</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Your Rights</h2>
                <p>
                  Depending on where you&apos;re based, you may have rights over your personal
                  data under Cameroonian and/or US law.{" "}
                  <PendingBadge>PENDING: legal review of applicable rights and how to exercise them</PendingBadge>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy-950 mb-3">Contact Us</h2>
                <p>
                  Questions about this policy can be sent to{" "}
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
