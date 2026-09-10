import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrustStrip } from "@/components/TrustStrip";
import { Button } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ComplianceDisclaimer } from "@/components/ComplianceDisclaimer";
import { WhatComesNext } from "@/components/WhatComesNext";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Business Formalisation — Cameroon",
  description:
    "Clear, compliant corporate formation under OHADA standards — from trade name reservation to RCCM registration and Tax Identification (NIU).",
};

const trustStripItems = [
  {
    icon: "gavel",
    title: "OHADA & RCCM Compliant",
    badgeText: "17 Member States",
    badgeAccent: "teal" as const,
    description: "Strict adherence to the Uniform Act on General Commercial Law.",
  },
  {
    icon: "flight_takeoff",
    title: "Remote Diaspora Workflows",
    badgeText: "No Travel Required",
    badgeAccent: "sky" as const,
    description: "Bilingual consular power-of-attorney protocols for founders abroad.",
  },
  {
    icon: "verified_user",
    title: "Documented Step-by-Step",
    badgeText: "Auditable Trail",
    badgeAccent: "emerald" as const,
    description: "Court clerk stamps, notarial deposit receipts, and DGI NIU attestations.",
  },
];

const steps = [
  {
    number: "01",
    phase: "Phase One • Commercial Registry",
    reference: "TPI / CFCE Search",
    title: "Name Reservation & Availability Clearance",
    description:
      "Verification and legal clearance via the Greffe du Tribunal de Première Instance and CFCE search registry to prevent duplicate conflicts.",
    deliverable: "Attestation de Disponibilité",
    highlight: false,
  },
  {
    number: "02",
    phase: "Phase Two • Notarial Execution",
    reference: "OHADA Articles",
    title: "Statutes Drafting & Bank Capital Escrow",
    description:
      "Drafting notarized Articles of Association (Statuts) in conformity with OHADA corporate code and escrow deposit of minimum share capital.",
    deliverable: "Notarial Declaration (DNSV) & Bank Attestation",
    highlight: false,
  },
  {
    number: "03",
    phase: "Core Registry Milestone",
    reference: "Court Filing",
    title: "Official RCCM Registration & Court Deposit",
    description:
      "Formal court deposit at the Registre du Commerce et du Crédit Mobilier — legal birth of the corporate entity with a certified court seal and national registration number.",
    deliverable: "Certified RCCM Certificate & Registry Number",
    highlight: true,
  },
  {
    number: "04",
    phase: "Tax Administration",
    reference: "DGI System",
    title: "Tax Identification Number (NIU Matriculation)",
    description:
      "Enrollment on the Directorate General of Taxation (DGI) fiscal platform to assign your Numéro d'Identifiant Unique, required for bank account activation.",
    deliverable: "Attestation d'Immatriculation Fiscale (NIU)",
    highlight: false,
  },
  {
    number: "05",
    phase: "Municipal & Operational Opening",
    reference: "CFCE & Mairie",
    title: "CFCE Final Deposit & Municipal Notice",
    description:
      "Filing with the Centre de Formalités de Création d'Entreprises and municipal business tax (Patente) declaration allowing commercial opening.",
    deliverable: "Avis d'Imposition & Carte de Contribuable",
    highlight: false,
  },
];

const identityDocuments = [
  {
    strong: "Biometric ID:",
    text: "Valid National Identity Card (CNI) or biometric passport copies for all managing directors (Gérants).",
  },
  {
    strong: "Criminal Record Clearance:",
    text: "Casier Judiciaire (Bulletin N°3) dated within the last 3 months, or sworn affidavit for foreign non-residents.",
  },
  { strong: "Photographs:", text: "Two (2) recent passport-sized color photos of each declared legal representative." },
  { strong: "Civil Status:", text: "Proof of matrimonial property regime (if applicable under OHADA joint asset rules)." },
];

const entityDocuments = [
  {
    strong: "Trade Name Variants:",
    text: "Three (3) proposed commercial names in priority order for availability reservation at Greffe.",
  },
  {
    strong: "Registered Address (Siège Social):",
    text: "Commercial lease agreement, property deed, or formal business domiciliation contract.",
  },
  { strong: "Capital Allocation Table:", text: "Declared share capital structure and shareholder distribution percentage table." },
  { strong: "Commercial Purpose (Objet Social):", text: "Precision corporate activities aligned with OHADA classification codes." },
];

const personas = [
  {
    label: "Persona 01",
    title: "First-Time Entrepreneurs",
    roadblock:
      "\"Never created a company before. Intimidated by legal vocabulary, courthouse bureaucracy, and fear of irreversible registry mistakes.\"",
    reassurance:
      "Comprehensive turnkey onboarding. We prepare every legal line, verify names, and walk through capital structures in plain English or French.",
    entity: "SARL Unipersonnelle",
  },
  {
    label: "Persona 02",
    title: "Informally Operating Businesses",
    roadblock:
      "\"Generating revenue but operating under informal cash arrangements. Locked out of enterprise corporate tenders, bank credit, and vendor lists.\"",
    reassurance:
      "Clean institutional transition. We regularize historical standing, establish fresh compliant bank accounts, and configure official NIU documentation.",
    entity: "SARL Pluripersonnelle",
  },
  {
    label: "Persona 03",
    title: "Diaspora & Cross-Border Founders",
    roadblock:
      "\"Based in North America or Europe with capital to deploy, but unable to take two weeks off work to stand in ministerial queues.\"",
    reassurance:
      "100% proxy management via certified Notarial Power of Attorney. Scanned digital updates followed by physical delivery of sealed corporate records.",
    entity: "SARL with US Liaison Branch",
  },
];

const faqItems = [
  {
    question: "Can this process be executed 100% remotely if I live in North America or Europe?",
    answer:
      "Yes. Under Cameroon and OHADA notarial standards, a foreign or diaspora director may execute a dedicated Power of Attorney (Procuration Spéciale). When certified by a Cameroon diplomatic mission or a Hague Apostille notary in your jurisdiction, UCO's legal desk can deposit capital, execute notarial statutes, and sign registry court books on your behalf.",
  },
  {
    question: "What happens if my preferred trade name is already taken at the commercial registry?",
    answer:
      "Our intake protocol requires three (3) distinct name variants in order of priority. During Phase 1, our desk conducts an immediate database search at the Greffe / CFCE. If your primary choice conflicts with an existing entity, we pivot to your secondary approved name without halting the timeline.",
  },
  {
    question: "Do I need a commercial real estate lease in Cameroon, or can I use a domiciliation address?",
    answer:
      "A verified registered address (Siège Social) is legally mandatory for both the RCCM court deposit and DGI tax localization certificate. OHADA rules permit legal corporate domiciliation agreements (Contrat de Domiciliation) through authorized providers during your initial startup phase.",
  },
  {
    question:
      "What is the key legal difference between an Individual Business (Établissement) and a Private Limited Company (SARL)?",
    answer:
      "An Établissement (Sole Proprietorship) does not create a distinct legal person; your personal assets remain exposed to business liabilities. A SARL creates an autonomous corporate entity where liability is restricted to contributed share capital — recommended for cross-border contracts and institutional partnerships.",
  },
];

export default function BusinessFormalisationCameroonPage() {
  return (
    <>
      <Header activeService="business-formalisation" />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
          { label: "Cameroon" },
        ]}
        tag="SUB-SERVICE 01/05 • RCCM & OHADA UNIFORM ACT"
      />

      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 overflow-hidden pt-14 pb-28 lg:pt-20 lg:pb-36 border-b border-slate-800/80">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover object-right opacity-35 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-7 h-[2px] bg-teal-400 inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    CAMEROON JURISDICTION • OHADA UNIFORM ACT
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                  Formalise your business in Cameroon,{" "}
                  <span className="gradient-teal-blue-text">without the guesswork.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                  Clear, compliant corporate formation under OHADA standards. From trade name
                  reservation and notarial statutes to RCCM court registration and Tax
                  Identification (NIU) — executed with procedural certainty for domestic operators
                  and diaspora founders.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    href="#registration-checklist"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                  >
                    Get Registration Checklist
                  </Button>
                  <WhatsAppButton phone="237600000000" label="Chat on WhatsApp Legal Desk" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-gradient-to-b from-white/15 to-white/5 p-1 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                  <div className="relative rounded-xl overflow-hidden bg-navy-800">
                    <Image
                      src={images["cross-border-boardroom"].src}
                      alt={images["cross-border-boardroom"].alt}
                      width={images["cross-border-boardroom"].width}
                      height={images["cross-border-boardroom"].height}
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      placeholder="blur"
                      blurDataURL={images["cross-border-boardroom"].blurDataURL}
                      className="w-full h-64 object-cover object-left group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md bg-navy-950/80 border border-teal-400/40 text-[11px] font-bold text-teal-300 uppercase tracking-wider backdrop-blur-md">
                        Statutory Reference
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-mono text-white/90">
                        OHADA Art. 313+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustStrip items={trustStripItems} />

        {/* Registration cadence */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28 bg-navy-950 text-white p-7 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-400 text-xs font-bold tracking-wider uppercase mb-3">
                    Statutory Roadmap
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-3">
                    The Official Registration Cadence
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    A transparent walkthrough of the statutory milestones under Cameroon commercial
                    law and OHADA standards, fully guided from Buea and Douala.
                  </p>
                  <div className="bg-white/5 border border-dashed border-amber-400/40 p-4 rounded-xl">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <MaterialIcon name="schedule" className="text-[16px]" />
                        Turnaround Duration
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded uppercase">
                        [PENDING: confirm with UCO]
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">
                      Standard benchmarks generally span <strong className="text-white">2 to 4 business weeks</strong> depending
                      on regional court chamber schedules (Buea, Douala, Yaoundé) and bank escrow clearances.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col pl-2 md:pl-6 relative">
                <div className="absolute left-6 md:left-10 top-6 bottom-8 w-0.5 bg-gradient-to-b from-teal-400 via-blue-accent to-slate-300" />
                {steps.map((step) => (
                  <div key={step.number} className="relative flex items-start gap-5 pb-8 last:pb-0 group">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-extrabold text-sm md:text-base shrink-0 z-10 group-hover:scale-105 transition-transform ${
                        step.highlight
                          ? "bg-blue-accent border-2 border-white text-white shadow-xl shadow-blue-500/40"
                          : "bg-navy-950 border-2 border-teal-400 text-teal-400 shadow-lg"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl p-5 md:p-6 transition-all ${
                        step.highlight
                          ? "bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-accent/30 shadow-md"
                          : "bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-500/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            step.highlight
                              ? "text-blue-accent bg-blue-100 border-transparent"
                              : "text-teal-700 bg-teal-50 border-teal-100"
                          }`}
                        >
                          {step.phase}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-semibold">{step.reference}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-navy-950 mb-1.5">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                        <MaterialIcon name="verified" className="text-emerald-600 text-[16px]" />
                        <span>
                          Statutory Deliverable: <strong className="text-slate-900">{step.deliverable}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Documents checklist */}
        <section id="registration-checklist" className="py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">REQUIRED DOSSIER BREAKDOWN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                Statutory Requirements Checklist
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Gather these elements prior to formal notary execution to avoid administrative
                rejections at the Greffe or DGI.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-accent flex items-center justify-center">
                      <MaterialIcon name="badge" className="text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy-950">1. Personal Identity Dossier</h3>
                      <span className="text-xs text-slate-500">For all declared managing directors &amp; shareholders</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-3 text-sm text-slate-600">
                    {identityDocuments.map((doc) => (
                      <li key={doc.strong} className="flex items-start gap-3">
                        <MaterialIcon name="check_circle" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">{doc.strong}</strong> {doc.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <MaterialIcon name="corporate_fare" className="text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy-950">2. Entity &amp; Operational Structure</h3>
                      <span className="text-xs text-slate-500">Commercial objectives and registered head office</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-3 text-sm text-slate-600">
                    {entityDocuments.map((doc) => (
                      <li key={doc.strong} className="flex items-start gap-3">
                        <MaterialIcon name="check_circle" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">{doc.strong}</strong> {doc.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-navy-950 text-white rounded-2xl p-7 border border-slate-800 shadow-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wider uppercase mb-4">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      3. Remote Diaspora Protocol
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-2">Foreign Residency &amp; Remote Proxy</h3>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                      Founders residing in North America, the UK, France, or across Europe can
                      incorporate without traveling to Cameroon:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <MaterialIcon name="vpn_key" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Special Power of Attorney</span>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            A dedicated Procuration Notariée drafted by UCO delegating signature and filing powers.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <MaterialIcon name="public" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Consular Attestation or Apostille</span>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            Executed at your nearest Cameroon Embassy/Consulate or via Hague Apostille notary.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <MaterialIcon name="local_shipping" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Digital Dispatch + Courier</span>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            Immediate digital scanning followed by registered courier dispatch of sealed originals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 mt-5 border-t border-white/10">
                    <a
                      href="https://wa.me/237600000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
                    >
                      Ask Legal Desk
                      <MaterialIcon name="arrow_forward" className="text-[14px]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-white border border-dashed border-amber-400/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                  <MaterialIcon name="receipt_long" className="text-[24px]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Official Registry &amp; Notarial Tariffs</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-300">
                      [PENDING: confirm with UCO]
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                    Direct disbursements comprise RCCM court stamps, Greffe deposits, notarial
                    statute registration dues, and regional fiscal stamp sheets. Consult your UCO
                    desk for the official schedule.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/237600000000"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-accent hover:text-blue-700 whitespace-nowrap bg-blue-50 px-4 py-2 rounded-lg border border-blue-100"
              >
                Request Fee Breakdown via WhatsApp
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
              </a>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">TAILORED GUIDANCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
                Structured for Your Exact Stage
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <div
                  key={persona.title}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-teal-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-blue-accent" />
                  <div className="pt-1">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block mb-3">
                      {persona.label}
                    </span>
                    <h3 className="text-lg font-bold text-navy-950 mb-3">{persona.title}</h3>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/60 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                        Common Roadblock
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed italic">{persona.roadblock}</p>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <MaterialIcon name="task_alt" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-slate-900">The Reassurance:</strong> {persona.reassurance}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Recommended entity:</span>
                    <span className="font-bold text-slate-800">{persona.entity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="relative py-24 bg-navy-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-teal-400/30 text-teal-400 text-xs font-bold tracking-wider uppercase mb-3">
                The Strategic Comparison
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                The Cost of <span className="gradient-teal-blue-text">Doing It Alone</span>
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Weighing the compounding friction of unguided public filings against a structured,
                guided legal cadence.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-2xl bg-white/[0.04] border border-rose-500/30 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-400">Unassisted Route</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">Self-Filing &amp; Fragmented Assistance</h3>
                    </div>
                    <MaterialIcon name="warning" className="text-rose-400 text-[32px]" />
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-300 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Fragmented Agency Visits:</strong> Repeated in-person queues across courts, notary offices, DGI centers, and municipal desks.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Statute Rejections:</strong> Risk of dossier refusal by greffiers due to non-compliant OHADA clauses.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Indefinite Delays:</strong> Stalled files between ministerial chambers with little timeline transparency.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="close" className="text-rose-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Hidden Friction Costs:</strong> Unbudgeted transport, duplicate stamp purchases, and lost commercial momentum.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200 font-medium flex items-center justify-between">
                  <span>Outcome: stalled capital and operational vulnerability while filings sit unresolved.</span>
                  <MaterialIcon name="error" className="text-rose-400 text-[18px]" />
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border-2 border-teal-400/50 p-6 md:p-8 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">The UCO Standard</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">Guided Procedural Cadence</h3>
                    </div>
                    <MaterialIcon name="verified" className="text-teal-400 text-[32px]" />
                  </div>
                  <ul className="flex flex-col gap-4 text-sm text-slate-200 mb-8">
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Single Digital Onboarding:</strong> Complete one structured checklist; our legal desk assembles and vets every statutory dossier.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Vetted OHADA Statutes:</strong> Precision legal drafting reviewed by experienced corporate counsel to minimize court rejections.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Predictable Milestone Auditing:</strong> Physical court receipts, verified registry numbers, and active DGI NIU tracking.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="text-teal-400 text-[20px] shrink-0 mt-0.5" />
                      <span>
                        <strong>Full Diaspora Representation:</strong> Remote consular execution without leaving your desk abroad.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-400/40 text-xs text-teal-300 font-medium flex items-center justify-between">
                  <span>Outcome: clean corporate standing ready for commercial trade &amp; banking.</span>
                  <MaterialIcon name="check" className="text-teal-400 text-[18px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">FREQUENTLY ADDRESSED INQUIRIES</span>
                <span className="w-7 h-[2px] bg-teal-500 inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Practical Legal &amp; Procedural Answers
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <ComplianceDisclaimer
          lastReviewed="[PENDING: confirm review date with UCO]"
          extraNote="Statutory fees, court stamp duty requirements, and municipal tariffs are subject to legislative modification by MINFI and the Ministry of Justice."
        />

        <WhatComesNext
          title="Next: Tax Compliance for Businesses — Cameroon"
          description="Once formalised, your entity enters an ongoing monthly filing cadence with the DGI — corporate income tax, statistical declarations, and tax clearance."
          href="/services/business-formalisation-compliance/tax-compliance-businesses-cameroon"
          linkLabel="View Tax Compliance"
        />

        {/* Final CTA */}
        <section className="relative py-24 bg-navy-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images["cross-border-boardroom"].src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images["cross-border-boardroom"].blurDataURL}
              className="object-cover opacity-25 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-navy-950/80" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-teal-400/40 text-teal-400 text-xs font-bold tracking-widest uppercase mb-4">
              Begin Your Formalisation
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight mb-4">
              Ready to establish your Cameroon <span className="gradient-teal-blue-text">corporate standing?</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Download the statutory checklist or connect immediately with our bilingual legal
              desk in Buea to verify your company name availability.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="#registration-checklist"
                icon={<MaterialIcon name="checklist" className="text-[18px]" />}
              >
                Download Pre-Registration Checklist
              </Button>
              <WhatsAppButton phone="237600000000" label="Discuss via WhatsApp Legal Desk" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
