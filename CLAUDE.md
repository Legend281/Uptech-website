# UCO Website — Project Context for Claude Code

**Revision note:** This file was corrected after a source-accuracy review against UCO's own official company documents caught real drift between earlier assumptions and the company's actual facts. Section 11 documents exactly what changed and why. Treat this version as authoritative over any earlier version.

You are building the website for **Uptech Consulting**, a technology-driven consulting, outsourcing, and business support company. Read this entire file before writing any code. This is not a generic template site — it is a real company deliverable with a locked design system, a specific page architecture, and real content rules that must be followed exactly.

---

## 1. Company Context

- **Official name:** Uptech Consulting & Outsourcing Cameroon
- **Official written short form: "Uptech Consulting"** — NOT "UCO." "UCO" is a circular monogram used inside the logo mark only; it is not the company's written name and must never appear as if it were, in any visible page copy (headings, body text, footer, form confirmations, error states, etc.).
  - **Exception:** "UCO" may continue to be used informally in internal project management artifacts (this file, the project brief, team chat) as shorthand — that convention is already established with the team and is fine to keep internally. The rule only applies to text a website visitor will actually read.
- **Legal entities:** Cameroon S.A. (Buea) + USA S-Corp (Stafford, Texas) — formalized specifically "to maintain seamless cross-border compliance and support international operations." This is a **capability claim**, not a market-exclusivity claim — see Section 6 for why that distinction matters.
- **Languages:** English and French are BOTH official languages for internal systems, records, SOPs, and customer deliverables per the company's own documents. Do not treat French as a "nice-to-have phase 2" internally when writing content structure — build bilingual-ready architecture from day one even if French UI copy ships later.
- **What Uptech Consulting does:** Helps individuals build careers and helps businesses grow through IT consulting, business formalisation/compliance, recruitment/BPO, and general contracts & supplies — operating across both Cameroon and the US.
- **Real logo asset:** A real logo file has been supplied by the client (circular "uco" monogram + "UPTECH CONSULTING & OUTSOURCING" wordmark, teal-to-blue gradient). **Use this exact file everywhere a logo appears. Do not use an invented or placeholder logo mark.** If you find a placeholder logo anywhere in the current build, replace it with the real asset immediately — this is a straightforward asset bug, not a design decision.
- **Positioning ("strategy → execution"):** The company's real differentiator, in its own words: "Many people know what they want to achieve. Very few know how." They don't just advise — they execute: advise → recruit → screen → interview → prepare documents → onboard. This should shape copy on every service page, not just the homepage.
- **Philosophy — real, not just a slogan:** The company's internal documents state staff are expected to operate such that "individual efforts only succeed when they are executed through the repeatable, documented systems established by the organization." This is the real source behind the "Documented systems, not individual heroics" positioning already used in the design — keep using it, it's accurate, not invented marketing language.
- **"The Bridge" narrative — keep the concept, drop the superlative.** Cross-border dual-jurisdiction framing is a real, accurate, defensible part of the company's identity. However, do NOT publish "the only company operating on both sides of the Cameroon–US relationship" or any similar exclusivity claim — this is unverifiable, was not stated by the company itself, and may not even be true given researched competitors who also operate cross-border. Use grounded language instead: e.g., "One team, two jurisdictions" or "Structured to operate seamlessly across Cameroon and the United States" — state the real capability, not a competitive superlative.

### Company Facts — Quick Reference (to prevent future drift)
- **Mission (full, accurate text):** "To empower businesses, institutions, and individuals by delivering technology, workforce, compliance, career development, and business support solutions that simplify operations, strengthen capacity, and drive sustainable growth." Do not truncate this to just the back half ("simplify operations, strengthen capacity...") — the "empower... by delivering" framing at the front is the actual point.
- **Vision:** "To be a trusted global partner in consulting, outsourcing, and business support solutions."
- **Core Values (exact labels):**
  1. Integrity — "How we behave"
  2. Professionalism — "The standard we maintain"
  3. Commitment — "How we serve"
  4. Innovation — **"How we solve problems and improve"** (not just "How we improve" — the full label includes "solve problems")

---

## 2. Tech Stack (FINAL — do not deviate without being told)

| Layer | Choice |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Hosting | Hostinger (Node.js/Next.js hosting) |
| Admin/CMS | **Custom-built in-house dashboard** — NOT a third-party CMS. This was a deliberate decision after evaluating and rejecting Sanity. |
| Database | **Supabase (Postgres)** — chosen for built-in Auth + File Storage, accepted as a conscious third-party dependency trade-off |
| Auth | Supabase Auth |
| File/image storage | Supabase Storage |
| Forms/Email | **Resend** — contact form → Next.js API route → writes lead into Supabase as a "Lead" record + sends notification via Resend |
| Bot protection | Cloudflare Turnstile or hCaptcha (implement on all public forms) |
| CDN/Security | Cloudflare in front of Hostinger (recommended) |

Do not introduce MySQL, Sanity, Prisma, or NextAuth — these were evaluated and explicitly superseded during planning.

---

## 3. Design System — "Transatlantic Corporate Trust"

A full `DESIGN.md` file exists with the complete token set (colors, typography, spacing, elevation, shape rules, component specs). **Load and follow it exactly — do not invent new colors, fonts, or spacing values.** Key tokens, for quick reference:

- **Colors:** Navy Primary `#0B192C`, Navy Secondary `#1E3E62` (headers/footers/dark sections) · Electric Blue `#0066FF`, Sky Precision `#0284C7` (primary CTAs/interactive states) · Amber `#F59E0B` (trust badges/certifications ONLY — never decorative) · Surface neutrals `#F8FAFC` / `#F1F5F9` / `#FFFFFF` · WhatsApp Green `#25D366` (WhatsApp CTA ONLY)
- **Typography:** Plus Jakarta Sans (headings, tight tracking `-0.01em` to `-0.03em`) + Inter (body/utility text)
- **Layout:** 12-column grid, max-width 1280px, 24px desktop gutters, rounded-lg cards, hairline borders (`1px solid #E2E8F0`), soft ambient shadows — no flat, borderless cards
- **Signature component:** Dual-Split Hero — two columns (Individual/Career vs. Enterprise/Business), converging visually; becomes a segmented switcher on mobile

**Build a shared component library first** — header/nav, footer, breadcrumb, primary/secondary/WhatsApp buttons, trust-badge component, FAQ accordion. Every page below reuses these exactly. Do not rebuild these per page.

---

## 4. Site Architecture — Page Types (THIS IS CRITICAL — READ CAREFULLY)

This site is not one template repeated with different words. There are **three distinct page templates**, because different services create different buyer fears. Using the wrong template on the wrong page is a real mistake, not a style choice.

### Template A — Advisory/Menu
**Used for:** IT Consulting & Outsourcing (and future: Recruitment & BPO, once unpaused)
**Buyer's fear:** "Will this be done competently?"
**Shape:** Card grid of independent, separately-purchasable services. "What's Included" is a menu — visitor picks what they need.
**CTA:** "Book a Consultation"

### Template B — Campaign/Sequence
**Used for:** Career Marketing & Placement
**Official org position:** This is technically a sub-service of IT Consulting & Outsourcing (the company's own service directory nests it there — it is the talent/staffing arm of the IT practice specifically, not a general career service). Its own materials say "helps IT people get dream jobs," "dream IT related jobs," and describe the dedicated worker following "any job posted related to your area of specialty" — this service is scoped to **IT/tech roles specifically.**
**Build decision (recommended, pending final team confirmation):** Build this as a clean top-level page — URL `/services/career-marketing-placement`, top-level nav entry — because it is being actively marketed and prioritized as UCO's flagship current offering while IT Consulting itself sits paused. To stay honest about the real structure without making it load-bearing, include a small kicker line on the page (e.g., "Part of Uptech Consulting's IT Consulting & Outsourcing practice"). **Confirm this approach with Shaniel/leadership before treating it as final** — the alternative is nesting it properly under IT Consulting in the URL/breadcrumb (`/services/it-consulting-outsourcing/career-marketing-placement`), which is more organizationally accurate but less aligned with how it's currently being pushed to market.
**Buyer's fear:** "Is anyone actually going to fight for me, or does this go into a void?"
**Shape:** NOT a card grid. One continuous, sequential campaign shown as a connected path/timeline (Profile Audit → LinkedIn/Portal Setup → Daily Applications → Interview Prep → Ongoing Recruiter Follow-Up). Do NOT split "what's included" and "process" into two sections — they are the same content here.
**CTA:** "Start Your Career Campaign" (an intake action) — NOT "Book a Consultation."
**Personas — MUST be IT-specific, not generic job seekers:** recent IT graduates, experienced IT professionals re-entering the market, diaspora IT professionals seeking placement while relocating or based abroad.
**Tone:** Warm, personal, relentless-on-your-behalf. Use UCO's real stated language: *"We dedicate a full-time worker to your account whose job is to make sure you never miss a relevant posting, and follow up with recruiters until you're placed."* This is a real operational fact from the company's own materials — do not paraphrase it into generic "personalized support" language.

### Template C — Regulatory/Procedure
**Used for:** Business Formalisation & Compliance (5 sub-pages: Business Formalisation Cameroon, Business Formalisation US, Tax Compliance for Businesses Cameroon, Tax Compliance for Individuals Cameroon, CNPS Compliance Cameroon)
**Buyer's fear:** "Will this be done correctly, and will I get in legal trouble if it isn't?"
**Shape:** Documents & Requirements checklist + step-by-step official procedure + realistic (not exact) timelines. Softer CTA sequencing: "Get the Checklist" first, "Book a Consultation" second.
**Mandatory elements not present in Templates A/B:**
- Visible compliance disclaimer: *"This information is general guidance. Requirements may change — confirm current details with your Uptech Consulting consultant."*
- **"Last reviewed: [DATE]"** displayed permanently on the page (this content can go legally stale — needs a review-cadence flag in the admin dashboard)
- A "What Comes Next" section pointing to the logical next page in the compliance sequence (e.g., Formalisation → Tax Compliance → CNPS), not a generic cross-link grid
**Sub-audience split within Template C:** 4 of the 5 pages are business-facing (Formalisation CM/US, Tax Compliance for Businesses, CNPS); **Tax Compliance for Individuals is a different audience (personal tax)** and must NOT reuse business-facing framing or personas.
**Public-vs-proprietary content rule (applies ONLY to Template C, but good practice everywhere):** publish official/public procedural steps and client-facing document requirements freely. NEVER publish UCO's internal negotiation tactics, specific government-office relationships, or exact fee/pricing figures — mark these `[PENDING]` if real data hasn't been supplied yet, rather than inventing plausible-looking numbers.

### The Hub Page (Business Formalisation & Compliance overview)
Sits between the Services nav and the 5 Template C pages. Contains a **guided 2-step router** ("Business or Individual?" → "Which specific need?") that resolves to the correct sub-page — this is required infrastructure, not optional, since 5 pages cannot all hang off one nav link cleanly.

---

## 5. Full Page Inventory & Status

| Page | Template | Status |
|---|---|---|
| Homepage | Special (see below) | Designed — needs "the only company" claim removed (Section 1) and any placeholder logo swapped for the real asset |
| IT Consulting & Outsourcing | A — Advisory/Menu | Designed & coded (`code.html` exists) — ⚠️ built before re-prioritization; confirm with team whether to hold or proceed |
| Career Marketing & Placement | B — Campaign/Sequence | **Designed — PRIORITY 1, build first.** Confirm nesting/URL decision (Section 4) with team; scope content to IT roles specifically |
| Business Formalisation & Compliance (hub) | Router/hub | Designed |
| Business Formalisation — Cameroon | C — Regulatory/Procedure | Designed |
| Tax Compliance for Businesses — Cameroon | C — Regulatory/Procedure | Designed |
| Business Formalisation — US | C — Regulatory/Procedure | Not yet designed |
| Tax Compliance for Individuals — Cameroon | C — Regulatory/Procedure (different audience) | Not yet designed |
| CNPS Compliance for Businesses — Cameroon | C — Regulatory/Procedure | Not yet designed |
| Recruitment & BPO | A — Advisory/Menu (likely) | **PAUSED** — pending leadership's dedicated structure session. Open question for that session: should this be fully hidden from nav, or show a "coming soon" state so visitors searching for it aren't met with nothing? Do not decide this unilaterally. |
| General Contracts and Supplies | Unclear — not yet scoped | **Confirmed as a real, official 4th service pillar** (was previously and incorrectly treated as non-existent). Not currently being pushed by Marketing & Ops. Bundle into the same future structure session as Recruitment & BPO — do not build without further direction. |
| About | — | Not yet designed |
| Contact | — | Not yet designed — blocked on form-routing decision (who receives job-seeker vs. business leads) |
| Careers at UCO | — | Confirmed in scope (company hires externally) — needs real job postings before build |
| Case Studies | — | Contingent on real client story availability |

**Homepage's special role:** unlike every other page (which can go deep on one audience/topic), the homepage must work for a zero-context visitor and serve both audiences (career-seekers and businesses) simultaneously. Its success condition includes correctly routing a visitor elsewhere, not just converting on-page. Structure: Split Hero → Guided Router → Trust Strip → "Meet Your Dedicated Person" → The Bridge (visual, Buea⇄Stafford) → Services Grid → "Do the Math" comparator → Real Results (merged testimonial+outcome) → FAQ → Final CTA Band → Footer.

**Build order:** Career Marketing & Placement first (explicit leadership priority), then the 5 Business Formalisation & Compliance pages + hub. Do not start Recruitment & BPO, General Contracts & Supplies, or expand IT Consulting further without explicit confirmation.

---

## 6. Non-Negotiable Content & Naming Rules

1. **Public-facing copy uses "Uptech Consulting," never "UCO."** ("UCO" is fine in internal project docs only — see Section 1.)
2. **Canonical service name is "Career Marketing & Placement"** — not "Career & Profile Marketing" or any other variant. Use this exact name in nav, cross-links, page titles, and breadcrumbs everywhere.
3. **Never publish unverifiable superlatives or exclusivity claims** (e.g., "the only company that..."). State real, specific capabilities instead. This applies to the dual-jurisdiction/"Bridge" narrative specifically — see Section 1.
4. **Never fabricate statistics or certifications.** No invented SLA percentages, uptime numbers, or compliance certifications that aren't real and confirmed. If a real number doesn't exist yet, use a qualitative badge (e.g., "24/7 Support Availability") or mark it `[PENDING: confirm with UCO]` — visually distinct (dashed border/muted tone) so it's obvious this needs real data before launch.
5. **Testimonials/case studies:** placeholder-safe structure everywhere (design the section to still feel substantial with 1-2 examples), do not populate with invented quotes.
6. **Pricing:** default to "Contact us for a quote" / consultation-based CTAs unless told UCO has decided to publish pricing.
7. **Competitor names are never published anywhere on the site.** All competitor research is internal strategy only.
8. **WhatsApp click-to-chat is core infrastructure**, not a decorative nice-to-have — include it prominently across pages, styled only in WhatsApp Green.
9. **Mobile/low-bandwidth performance is a real constraint, not a preference.** Avoid heavy hero video, unoptimized large images, and animation-heavy sections. Use Next.js Image optimization by default.
10. **Use the real supplied logo file everywhere** — never an invented placeholder mark (see Section 1).

---

## 7. Security Requirements (apply from the start, not as a later pass)

- All Supabase/Resend API keys in server-side environment variables only — never client-side, never committed to git
- HTTPS/HSTS enforced sitewide
- Security headers via Next.js config (CSP, X-Frame-Options, Strict-Transport-Security)
- Server-side input validation on all forms, not just client-side
- Rate limiting on the lead-capture API route
- Bot protection (Turnstile/hCaptcha) on all public forms
- Principle of least privilege in the admin dashboard's role system (Administrator / Editor / Viewer)
- A visible Privacy Policy and Terms of Service are required before collecting any personal data (resumes, business registration details) — this is a real legal requirement given cross-border data collection (US + Cameroon), not decoration

If the Claude Code `security-guidance` plugin is installed, keep it enabled throughout this build.

---

## 8. Admin Dashboard — What It Needs to Support

Custom-built (not a CMS product). Two department-specific access paths after login: **Career Services Operations** and **Business Formalisation & Compliance**. Content types needed: Site Settings, Homepage content, Service Pages (per template type above), Team Members, Case Studies, Testimonials, FAQ Items, Job Postings (Careers at UCO — kept visibly distinct from client-facing Career Marketing content), Leads (from the contact/intake forms, routed by type). Compliance pages (Template C) need a **review-cadence/"last reviewed" flag** in the admin schema, since their content can go legally stale in a way other pages don't.

---

## 9. What NOT To Do

- Do not build Recruitment & BPO or General Contracts & Supplies, or restructure IT Consulting's nav placement — all are paused pending a leadership session
- Do not invent Cameroonian or US regulatory procedure details from general knowledge — use only what's explicitly supplied as real content; mark unknowns `[PENDING]`
- Do not treat the three page templates as interchangeable — check which template a given service belongs to before generating its structure
- Do not silently fill `[PENDING]` placeholders with plausible-looking fake data to make a page "look done"
- Do not use MySQL, Sanity, Prisma, or NextAuth — superseded decisions
- Do not write "UCO" into any visible page copy — use "Uptech Consulting"
- Do not publish exclusivity/superlative claims not stated by the company itself

---

## 10. Immediate Task

Build the **Career Marketing & Placement** page (Template B) first, using the shared component library (header/nav/footer/breadcrumb/buttons) as the foundation. Reference `DESIGN.md` for exact tokens. Scope all persona/content language to IT/tech roles specifically (Section 4). Ask for real content (hero copy, trust-strip facts, FAQ questions, testimonials/pricing stance) if it hasn't been supplied yet — do not invent it.

---

## 11. Correction Log — What Changed From the Previous Version, and Why

A source-accuracy review against UCO's own official company documents (the "Understanding Uptech Consulting" guide and the formal corporate overview) found the following drift, now corrected above:

| Issue | Was | Corrected to |
|---|---|---|
| Company short form | "UCO" used in visible page copy (44 instances) | "Uptech Consulting" in all public copy; "UCO" retained only as internal project shorthand |
| Service pillar count | 3 pillars assumed, General Contracts & Supplies omitted entirely | 4 official pillars; General Contracts & Supplies acknowledged as real, bundled into the paused-services future session |
| Career Marketing placement | Treated as a flat top-level pillar with no reference to its real org position | Acknowledged as officially nested under IT Consulting, IT-specific in scope; build decision made explicit and flagged for team confirmation rather than assumed |
| Homepage mission copy | Truncated to back half of the real mission statement | Restored full accurate text |
| Core Value 04 label | "How we improve" | "How we solve problems and improve" |
| "Only company" claim | Stated as the core strategic throughline | Removed as an unverifiable superlative; replaced with grounded dual-jurisdiction capability language |
| Logo | Placeholder/invented mark reportedly in use on built pages | Real supplied logo file required everywhere |

This log exists so the team can see exactly what was fixed and verify it against the source documents themselves rather than taking it on faith — consistent with the company's own stated principle that individual work only holds up when it runs through a documented, repeatable system, not memory or assumption.
