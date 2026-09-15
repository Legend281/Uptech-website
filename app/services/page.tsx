import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images, type ImageKey } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description: "Everything Uptech Consulting offers — for careers and for business.",
};

const serviceCards: Array<{
  title: string;
  description: string;
  href: string;
  image: ImageKey;
}> = [
  {
    title: "IT Consulting & Outsourcing",
    description:
      "Managed IT support, cloud migration, database administration, and cybersecurity — advisory and hands-on delivery scoped to what you actually need.",
    href: "/services/it-consulting-outsourcing",
    image: "ops-center",
  },
  {
    title: "Business Formalisation & Compliance",
    description:
      "Cross-border entity formation and statutory compliance across Cameroon (OHADA) and US jurisdictions, guided to the exact pathway for your situation.",
    href: "/services/business-formalisation-compliance",
    image: "cross-border-boardroom",
  },
  {
    title: "Career Marketing & Placement",
    description:
      "A dedicated specialist manages your CV, LinkedIn, daily applications, and recruiter follow-up until you're placed in an IT role.",
    href: "/services/career-marketing-placement",
    image: "career-review",
  },
  {
    title: "Business Formalisation — Cameroon",
    description:
      "Clear, compliant corporate formation under OHADA standards — from trade name reservation to RCCM registration and Tax ID (NIU).",
    href: "/services/business-formalisation-compliance/cameroon",
    image: "cross-border-boardroom",
  },
  {
    title: "Business Formalisation — United States",
    description:
      "Formation of Delaware, Wyoming, Texas, or state-specific LLCs and C-Corps, including Registered Agent service and IRS EIN acquisition.",
    href: "/services/business-formalisation-compliance/united-states",
    image: "cross-border-boardroom",
  },
  {
    title: "Tax Compliance — Businesses (Cameroon)",
    description:
      "Monthly DGI declarations, statistical and tax filings (DSF), and Attestation de Non-Redevance clearance, on a predictable calendar.",
    href: "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
    image: "compliance-advisory",
  },
  {
    title: "Tax Compliance — Individuals (Cameroon)",
    description:
      "Personal income tax declarations (IRPP), foreign-income regularisation, and individual tax clearance for visa and banking needs.",
    href: "/services/business-formalisation-compliance/tax-compliance-individuals-cameroon",
    image: "compliance-advisory",
  },
  {
    title: "CNPS Compliance (Cameroon)",
    description:
      "Employer social insurance registration, monthly employee declarations, payroll withholding, and CNPS clearance certificates.",
    href: "/services/business-formalisation-compliance/cnps-compliance-cameroon",
    image: "dedicated-advisor",
  },
];

export default function ServicesHubPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <main>
        <section className="bg-navy-950 pt-20 pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Our Services
                <span className="text-teal-400">.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-5">
                At Uptech Consulting, our clients come first. We help individuals build careers
                and businesses grow through technology consulting, business formalisation,
                compliance, and career support — bridging the gap between strategy and execution
                across Cameroon and the United States.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
              {serviceCards.map((card) => (
                <Link key={card.href} href={card.href} className="group block">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={images[card.image].src}
                      alt={images[card.image].alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                      placeholder="blur"
                      blurDataURL={images[card.image].blurDataURL}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative -mt-10 mx-4 bg-white rounded-xl p-5 shadow-xl group-hover:shadow-2xl transition-shadow">
                    <h3 className="text-base font-bold text-navy-950 leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:gap-2 transition-all">
                      Read More
                      <MaterialIcon name="arrow_forward" className="text-[16px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
