import type { PersonaContent } from "@/components/who-we-serve/types";

/*
 * Content for /who-we-serve/businesses. Same second-person register as the
 * Individuals page, addressed to whoever is responsible for keeping an
 * organisation running and compliant. No diaspora story here — the closing
 * section is about how an engagement runs, which is the institutional buyer's
 * actual question.
 *
 * Every line below is either Uptech Consulting's own wording or copy already
 * approved elsewhere on the site (the homepage pillars, process and handover
 * lists, the Bridge section). Nothing is invented to fill a slot.
 */
export const businesses: PersonaContent = {
  slug: "businesses",
  breadcrumbLabel: "For Businesses & Institutions",
  breadcrumbTag: "Who We Serve · Businesses & Institutions",
  ctaLabel: "Talk to a consultant",

  hero: {
    eyebrow: "For Businesses & Institutions",
    headline: ["Run the technology.", "Keep it compliant.", "Without carrying every function."],
    lead:
      "Organisations come to Uptech Consulting for one of three reasons: the technology needs running by someone accountable, the company needs registering and keeping compliant in Cameroon or the United States, or a whole function needs taking off your hands. Usually it's the first two together.",
    // Names the paused pillars and states their status — nothing more. The
    // reason they are paused is a leadership matter and is not inferred here.
    note:
      "One thing to know before you go further: third-party recruitment, business process outsourcing, and general contracts & supplies are official parts of Uptech Consulting, but they are not on offer as standalone services right now.",
    situations: [
      "Technology that needs managing",
      "A company to register or keep compliant",
      "A function you'd rather not staff in-house",
    ],
    image: "it-advisory",
  },

  ways: {
    eyebrow: "Three ways we help",
    heading: "Tick what applies. One conversation scopes it.",
    intro:
      "The first two have their own pages. Select one to go straight there — or more than one, and we'll explain what happens next.",
    items: [
      {
        key: "operations",
        icon: "server",
        title: "Operations",
        scope: "IT Consulting & Outsourcing",
        description:
          "Databases, cloud migration, help desk operations, AI compliance and cyber security — advised, and then run by our professionals for as long as you need them.",
        href: "/services/it-consulting-outsourcing",
      },
      {
        key: "compliance",
        icon: "shield-check",
        title: "Compliance",
        scope: "Cameroon & United States",
        description:
          "Company registration, tax standing, CNPS declarations, ministry licensing and accreditation — managed as one accountable process instead of five separate errands.",
        href: "/services/business-formalisation-compliance",
      },
      {
        // Named honestly, not linked: CLAUDE.md Section 9 pauses both of these
        // pending a leadership session. A card that exists but leads nowhere
        // is more truthful than a card that is missing.
        key: "managed",
        icon: "users",
        title: "Managed Functions",
        scope: "Not currently offered",
        description:
          "Third-party recruitment, business process outsourcing, and general contracts & supplies. Real parts of the business — not on offer as standalone services yet, and we won't pretend otherwise.",
        status: "Recruitment & BPO in active development · General Contracts & Supplies not offered standalone",
      },
    ],
    multiNeedMessage:
      "More than one applies — which is usually how it goes: the technology and the compliance tend to arrive together. One conversation covers all of it.",
    noDestinationMessage:
      "Managed functions aren't offered as a standalone service right now. A conversation is still the right next step — we'll tell you plainly what we can take on today and what we can't.",
  },

  story: {
    eyebrow: "How an engagement runs",
    heading: "A written scope before anything is quoted. The documents in your hands at the end.",
    paragraphs: [
      "Every engagement starts the same way: we listen first, then identify the real technical, regulatory or human constraint — not the one in the brief. You receive a written scope naming owners, deadlines and the standard being worked to, before anything is quoted.",
      "Then we run the process, report transparently for as long as it lasts, and hand over systems and documentation your own team can keep running afterwards. Original certificates, filings and clearances are collected and handed to you — not held.",
      "Uptech Consulting is formalised in both Cameroon and the United States, so cross-border work stays inside one organisation that answers for it. RCCM standing, DGI filings and CNPS declarations can be kept current without a director flying home to sign paperwork.",
    ],
    pointsHeading: "What you are holding at handover",
    points: [
      "A written scope naming owners, deadlines and the standard being worked to",
      "Transparent progress reporting for as long as the engagement runs",
      "Original certificates, filings and clearances collected and handed to you",
      "Systems and documentation your own team can keep running afterwards",
    ],
    image: "cross-border-boardroom",
  },

  faq: [
    {
      question: "Can we engage you for advice only, without outsourcing anything?",
      answer:
        "Yes. Clients engage us for specialised guidance, outsource critical functions to our professionals, or use both together. The written scope states which it is, so there's no ambiguity about who is doing what.",
    },
    {
      question: "We're registered in Cameroon but our directors are abroad. Does that matter?",
      answer:
        "No — it's one of the situations the two-jurisdiction structure exists for. RCCM standing, DGI filings and CNPS declarations can be kept current without anyone flying home to sign paperwork. Which steps, if any, need a director physically present is confirmed in the scope: [PENDING: confirm with Uptech Consulting which filings require a director in person].",
    },
    {
      question: "Do you offer recruitment or BPO?",
      answer:
        "Third-Party Recruitment & BPO is an official Uptech Consulting service line and is in active development, but it is not on offer as a standalone service today. If staffing is part of a wider engagement, raise it in the conversation and we'll tell you plainly what we can take on now.",
    },
    {
      // Consultation-based by default (CLAUDE.md Section 6.6). Whether pricing
      // is ever published is an open leadership decision, so this answers
      // "how is it priced" without asserting a policy either way.
      question: "How is an engagement priced?",
      answer:
        "Every engagement is scoped in writing first, and the quote follows the scope — so what you're quoted is what was actually agreed to be done, not a package. Contact us for a quote.",
    },
  ],

  close: {
    heading: "Describe the operation. We'll scope it in writing.",
    body: "One conversation, one written scope — whether it's the technology, the compliance, or both.",
  },
};
