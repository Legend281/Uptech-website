# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences UCO serves simultaneously, each split across Cameroon and the US:

- **Individuals building careers** — job seekers needing career marketing/placement, personal tax and CNPS (social insurance) compliance, or business formalisation for their own ventures.
- **Businesses & institutions** in Cameroon and the US needing IT consulting/outsourcing, business formalisation and regulatory compliance, or (currently paused) recruitment/BPO support.

Country matters as much as audience type: Cameroon-facing and US-facing content differ materially (e.g. Business Formalisation Cameroon vs. Business Formalisation US are separate pages with separate procedures). Within the compliance audience, Tax Compliance for Individuals is a distinct personal-tax persona from the four business-facing compliance pages and must not reuse their framing.

## Product Purpose

UCO (Uptech Consulting & Outsourcing) is a technology-driven consulting, outsourcing, and business support company. It helps individuals build careers and helps businesses grow, through IT consulting, business formalisation/compliance, and recruitment/BPO services, operating as two real legal entities: a Cameroon S.A. (Buea) and a USA S-Corp (Stafford, Texas).

Success on this site is two-sided: converting a visitor into a consultation/intake lead on the page they land on, **and** correctly routing a zero-context visitor to the one right page out of many specialized service pages. The homepage in particular is judged on routing accuracy, not just on-page conversion.

## Positioning

**"The Bridge"** — UCO positions itself as the only company operating on both sides of the Cameroon–US relationship, serving people and businesses moving between the two. This is a structural claim, not a single-paragraph tagline: it should be felt through dual-entity framing, dual-office trust badges, and a visual Buea⇄Stafford bridge motif, not stated once and dropped.

## Operating Context

- **Lead flow:** contact/intake forms → Next.js API route → writes a Lead record into Supabase + Resend notification email. Leads must route to one of two department-specific admin paths — Career Services Operations vs. Business Formalisation & Compliance — by lead type (job-seeker vs. business). The Contact page build is currently blocked on finalizing this routing decision.
- **Admin dashboard** is custom-built in-house (not a third-party CMS), with an Administrator/Editor/Viewer role system and content types: Site Settings, Homepage, Service Pages (per template below), Team Members, Case Studies, Testimonials, FAQ Items, Job Postings (kept visibly distinct from client-facing Career Marketing content), and Leads.
- **Compliance pages** (Template C) carry a permanent "Last reviewed: [date]" flag because regulatory content can go legally stale in a way other pages don't — the admin schema needs a review-cadence field for these.
- **WhatsApp click-to-chat** is core infrastructure across the site, not decorative — styled only in WhatsApp Green.
- **Low-bandwidth mobile** is a real constraint for a meaningful share of the Cameroon audience — not a stylistic preference. Avoid heavy hero video, unoptimized large images, animation-heavy sections; use Next.js Image optimization by default.
- **Bilingual roadmap:** English at launch, French is phase 2. URL and content structure must stay French-ready from day one — no English-only assumptions baked into routing or components.

## Capabilities and Constraints

Three distinct page templates exist because different services create different buyer fears. They are not interchangeable — check which template a given service belongs to before building or restructuring its page:

- **Template A — Advisory/Menu** (IT Consulting & Outsourcing; future Recruitment & BPO): buyer fear is competence. Card grid of independent, separately-purchasable services. CTA: "Book a Consultation."
- **Template B — Campaign/Sequence** (Career Marketing & Placement): buyer fear is being ignored/going into a void. One continuous sequential campaign shown as a connected path (not a card grid; "what's included" and "process" are the same content, never split). CTA: "Start Your Career Campaign" (an intake action, not a booking action). Must use UCO's real stated operational fact verbatim where relevant: a dedicated full-time worker is assigned per account to track relevant postings and follow up with recruiters until the candidate is placed — do not paraphrase into generic "personalized support" language.
- **Template C — Regulatory/Procedure** (the 5 Business Formalisation & Compliance sub-pages): buyer fear is legal exposure from something done incorrectly. Documents/requirements checklist + step-by-step official procedure + realistic (not exact) timelines. Mandatory: a visible compliance disclaimer, a permanent "Last reviewed" date, and a "What Comes Next" section pointing to the specific next page in the compliance sequence (not a generic cross-link grid). Softer CTA order: "Get the Checklist" first, "Book a Consultation" second. 4 of 5 sub-pages are business-facing (Formalisation CM/US, Tax Compliance for Businesses, CNPS); Tax Compliance for Individuals is a different, personal-tax audience.

The Business Formalisation & Compliance **hub page** sits between the Services nav and the 5 Template C pages, and requires a guided 2-step router ("Business or Individual?" → "which specific need?") that resolves to the correct sub-page. This is required infrastructure, not optional — 5 pages cannot hang cleanly off one nav link.

**Public-vs-proprietary content rule** (mandatory on Template C, good practice everywhere): publish official/public procedural steps and client-facing document requirements freely. Never publish UCO's internal negotiation tactics, specific government-office relationships, or exact fee/pricing figures — mark these `[PENDING]` if real data hasn't been supplied, rather than inventing plausible numbers.

**Fixed tech stack:** Next.js + Tailwind CSS, Hostinger (Node.js) hosting, custom in-house admin dashboard (not a CMS product), Supabase (Postgres, Auth, Storage), Resend for forms/email, Cloudflare Turnstile/hCaptcha on all public forms, Cloudflare CDN in front of Hostinger. Do not introduce MySQL, Sanity, Prisma, or NextAuth — these were evaluated and explicitly superseded.

**Explicitly paused/out of scope:** Recruitment & BPO is designed as Template A (likely) but paused pending a leadership structure session — do not build it or place it in nav. "General Contracts & Supplies" has no page, content, or mention anywhere in spec — omit from nav/footer even though some legacy mockups show it.

**Never fabricate:** statistics, SLA/uptime numbers, certifications, testimonial quotes, or case-study metrics that aren't real and confirmed. Use a qualitative badge (e.g. "24/7 Support Availability") or `[PENDING: confirm with UCO]`, visually distinct (dashed border/muted tone), instead. Pricing defaults to "Contact us for a quote" / consultation-based CTAs unless UCO explicitly decides to publish pricing. Competitor names are never published anywhere on the site — competitor research is internal strategy only.

## Brand Commitments

- Name: **Uptech Consulting & Outsourcing**, short form **UCO**.
- Canonical service name is **"Career Marketing & Placement"** exactly — not "Career & Profile Marketing" or any variant — in nav, cross-links, titles, and breadcrumbs everywhere (some legacy mockup footers use the wrong variant; correct it when found).
- Legal entities and offices: Cameroon S.A. (Buea, Cameroon) + USA S-Corp (Stafford, Texas, USA) — both are real and should be represented as such (e.g. dual trust badges), not as a single generic "global" claim.
- WhatsApp click-to-chat styled only in WhatsApp Green (`#25D366`) — never repurpose that color for anything else.
- "The Bridge" (Cameroon⇄US) is a binding positioning commitment that should recur structurally across pages, not just appear once on the homepage.

## Evidence on Hand

- Approved Stitch mockups exist for 7 pages (homepage, IT Consulting, Career Marketing, Compliance Hub, Business Formalisation Cameroon, Tax Compliance for Businesses Cameroon, plus a homepage variant) at `stitch_uptech_consulting_homepage_redesign/` in this repo — treated as the working reference for header/breadcrumb/footer/button styling, not something to redesign from scratch. `home_executive_polish/code.html` is canonical for the homepage; `exact_rebuild/code.html` is a superseded earlier draft of the same page.
- A DESIGN.md exists at `stitch_uptech_consulting_homepage_redesign/transatlantic_corporate_trust/DESIGN.md`. Its typography/spacing/shape/elevation sections apply as-is; its color section is superseded — the canonical palette is the teal/cyan tokens actually used across 6 of the 7 approved mockups (recorded in this repo's CLAUDE.md, resolved 2026-09-09), not DESIGN.md's original hex values.
- **No real testimonials, case studies, stats, certifications, or pricing figures exist yet** (confirmed with the team 2026-09-10 — still the case, keep placeholder-safe). Several legacy Stitch mockups contain invented testimonial quotes and metric figures (e.g. a "Marc K." testimonial, homepage "completed engagement" stat cards) — these are layout placeholders only and must never be carried into the real build as real content. Design testimonial/case-study sections to still feel substantial with only 1-2 real examples once real ones are supplied.
- Real UCO operational fact, safe to use verbatim in Career Marketing copy: UCO dedicates a full-time worker to each account whose job is to make sure the candidate never misses a relevant posting, and to follow up with recruiters until the candidate is placed.
- No formal accessibility standard has been set by the team (confirmed 2026-09-10) — build to good semantic-HTML/contrast practice, not a specific compliance level.

## Product Principles

1. **Three buyer fears, three templates.** Never force Advisory/Menu, Campaign/Sequence, or Regulatory/Procedure content into the wrong shape — confirm which template a service belongs to before generating its structure.
2. **The Bridge is structural, not decorative.** Cameroon and US presence should be visible in trust badges, dual-entity framing, and page routing — not just claimed once in a hero line.
3. **Never invent to look finished.** Unsupplied stats, testimonials, pricing, or regulatory specifics get `[PENDING]`, never a plausible-looking placeholder number.
4. **Low-bandwidth Cameroon mobile is a real constraint.** Default to lightweight, image-optimized, low-animation sections rather than heavy hero video or motion.
5. **Compliance content carries real legal risk.** Template C pages always carry the disclaimer and "Last reviewed" date, and UCO's proprietary operational detail (negotiation tactics, specific office relationships, real fees) never gets published — mark it `[PENDING]` instead.
