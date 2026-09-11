import type { PersonaContent } from "@/components/who-we-serve/types";

/*
 * Content for /who-we-serve/individuals. Persona voice: second person,
 * direct — deliberately warmer than the institutional register on Who We
 * Are, which lists the same services as an organisational record.
 */
export const individuals: PersonaContent = {
  slug: "individuals",
  breadcrumbLabel: "For Individuals",
  breadcrumbTag: "Who We Serve · Individuals",
  ctaLabel: "Start the conversation",

  hero: {
    eyebrow: "For Individuals",
    headline: ["Build the career.", "Keep the taxes clean.", "Start the venture."],
    lead:
      "Three situations bring individuals to Uptech Consulting: you're an IT professional who wants the next role and someone actually working to get it; you have income to declare in Cameroon and want it done properly; or you're ready to register a business of your own. Sometimes it's all three.",
    note:
      "One thing to know before you go further: our career support is built for IT and tech roles specifically — a dedicated worker on your account, applying and following up with recruiters until you're placed. Personal tax and business formalisation are open to anyone.",
    situations: [
      "IT professional looking for the next role",
      "Income to declare in Cameroon",
      "A business of your own to register",
    ],
    image: "career-review",
  },

  ways: {
    eyebrow: "Three ways we help",
    heading: "Tick what applies. We'll take it from there.",
    intro:
      "Each of these has its own page. Select one to go straight there — or more than one, and we'll explain what happens next.",
    items: [
      {
        key: "career",
        icon: "briefcase",
        title: "Career Growth",
        scope: "IT & tech roles only",
        description:
          "A full-time worker dedicated to your account: your profile positioned, relevant postings applied to daily, interview preparation, and recruiter follow-up until you're placed.",
        href: "/services/career-marketing-placement",
      },
      {
        key: "tax",
        icon: "receipt",
        title: "Personal Tax",
        scope: "Cameroon",
        description:
          "Your personal income tax declarations in Cameroon, freelance or foreign income regularised, and your individual tax clearance issued — filed correctly and on time.",
        href: "/services/business-formalisation-compliance/tax-compliance-individuals-cameroon",
      },
      {
        // Links to Business Formalisation — Cameroon directly. The
        // ComplianceRouter on the hub page types Profile as
        // "business" | "individual" and sends every individual to personal
        // tax, so an individual formalising their own venture is invisible to
        // it. That inconsistency is flagged for a team decision (Shaniel) and
        // is deliberately not changed here; this card bypasses it.
        key: "venture",
        icon: "rocket",
        title: "Starting a Venture",
        scope: "Cameroon",
        description:
          "Registering your own business — notarial drafting, trade-registry certification and taxpayer ID run as one accountable process, whether you're in Buea or abroad.",
        href: "/services/business-formalisation-compliance/cameroon",
      },
    ],
    multiNeedMessage:
      "Sounds like more than one of these applies to you — that's normal, especially for clients living abroad. One conversation covers all of it.",
    noDestinationMessage:
      "This isn't offered as a standalone service right now. A conversation is still the right next step — we'll tell you plainly what we can take on today.",
  },

  story: {
    eyebrow: "Living abroad",
    heading: "Sorting this out from another country is exactly what the two-jurisdiction setup is for.",
    paragraphs: [
      "A situation we're built for: you're an IT professional based in the United States or Europe. You want a stronger position in the job market where you are. You still have income that needs declaring back home. And the business you keep meaning to register in Cameroon is still just an idea. Three needs, three offices, three sets of paperwork — and nobody on the ground you can hand it all to.",
      "Uptech Consulting is incorporated in both Cameroon and the United States so that one team can carry all of it: the career campaign, the personal tax file and the business registration — with a named person on your account, not a shared inbox.",
      "You don't have to know which service you need before you get in touch. Describe the situation; we'll tell you plainly what applies, what doesn't, and in what order.",
    ],
    pointsHeading: "What one conversation settles",
    points: [
      "Which of the three actually applies to you — and in what order",
      "What we need from you, and which steps need you in person",
      "A written scope before anything is quoted",
    ],
    image: "dedicated-advisor",
  },

  faq: [
    {
      question: "Is Career Marketing & Placement only for IT professionals?",
      answer:
        "Yes. It's the talent arm of our IT Consulting & Outsourcing practice, and the dedicated worker on your account follows postings in your area of IT specialty. If you work outside tech, we'll say so up front rather than take you on and under-deliver. Personal tax and business formalisation are open to anyone.",
    },
    {
      question: "Can I register a personal business if I don't live in Cameroon?",
      answer:
        "Yes — living abroad doesn't stop you engaging us, and it's one of the situations the cross-border structure exists for. Which steps can be completed on your behalf and which need you present is confirmed at scoping: [PENDING: confirm with Uptech Consulting which formalisation steps require the founder in person]. You'll have that in writing before anything begins.",
    },
    {
      question: "What if more than one of these applies to me?",
      answer:
        "That's common, and the cards above are built for it — tick everything that applies. One consultation covers all of it, and you get a single written scope that sequences the work sensibly, for example registering the business before setting up its tax standing.",
    },
    {
      question: "Do I need to know which service I need before I get in touch?",
      answer:
        "No. Describe your situation in your own words. Mapping it to what actually applies — and telling you what doesn't — is the first thing the conversation does.",
    },
  ],

  close: {
    heading: "Tell us the situation. We'll tell you what applies.",
    body: "One conversation, one written scope — whether it's one of the three above or all of them.",
  },
};
