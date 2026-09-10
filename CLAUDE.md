# UCO Website — Project Context for Claude Code

You are building the website for **Uptech Consulting & Outsourcing (UCO)**, a technology-driven consulting, outsourcing, and business support company. Read this entire file before writing any code. This is not a generic template site — it is a real company deliverable with a locked design system, a specific page architecture, and real content rules that must be followed exactly.

---

## 1. Company Context

- **Company:** Uptech Consulting & Outsourcing (short form: UCO)
- **Legal entities:** Cameroon S.A. + USA S-Corp
- **Offices:** Buea, Cameroon + Stafford, Texas, USA
- **Languages:** English (launch) + French (phase 2 — build URL/content structure French-ready from day one, do not hardcode English-only assumptions)
- **What UCO does:** Helps individuals build careers and helps businesses grow through IT consulting, business formalisation/compliance, and recruitment/BPO services, operating across both Cameroon and the US.
- **Core positioning throughline: "The Bridge"** — UCO is the only company operating on both sides of the Cameroon–US relationship. This should be felt across the site, not just stated once.

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

Do not introduce MySQL, Sanity, Prisma, or NextAuth — these were evaluated and explicitly superseded during planning. If you're unsure why, assume Supabase's built-in Auth/Storage already covers that need.

---

## 3. Design System — "Transatlantic Corporate Trust"

> **2026-09-09 resolution:** `stitch_uptech_consulting_homepage_redesign/transatlantic_corporate_trust/DESIGN.md` exists but its prose color section (and this file's original quick-reference table) do NOT match what was actually built across 6 of the 7 approved Stitch mockups (Career Marketing, Compliance Hub, Business Formalisation–Cameroon, homepage ×2, IT Consulting). Only the Tax Compliance–Businesses mockup uses DESIGN.md's literal tokens. Decision: **the mockups' actual teal/cyan palette is canonical.** The table below reflects that decision, not DESIGN.md's original hex values. Typography, spacing, shape, and elevation rules from DESIGN.md are unaffected and still apply.

**Canonical color tokens (from the approved mockups' Tailwind config):**

| Token | Value | Use |
|---|---|---|
| `navy-950` | `#070e1b` | Deepest backgrounds (footer, deep hero base) |
| `navy-900` | `#0b1528` | Header, dark section backgrounds |
| `navy-850` | `#0f1d36` | Hover states on dark surfaces |
| `navy-800` | `#152544` | Elevated dark panels |
| `navy-700` | `#1e335a` | Borders/dividers on dark surfaces |
| `navy-600` | `#2d4b80` | Lightest navy, rarely used |
| `cyanAccent` | `#2DD4BF` | Primary accent — icons, eyebrows, borders, badges |
| `blueAccent` | `#2563EB` | Secondary accent — links, hover states |
| `uco-blue` | `#0066FF` | Alt accent, used sparingly |
| `uco-blue-hover` | `#0052CC` | Hover state for `uco-blue` |
| `uco-cyan` | `#38BDF8` | Gradient partner color |
| `uco-green` (WhatsApp) | `#25D366` | **WhatsApp CTAs only** — unchanged from original spec |
| Gradient (CTA fills) | `linear-gradient(135deg, #00d2b4 0%, #0080ff 100%)` | Primary buttons (`.gradient-teal-blue`) |
| Gradient (text highlight) | `linear-gradient(135deg, #2DD4BF 0%, #38BDF8 100%)` | Headline accent text (`.gradient-teal-blue-text`) |
| Surface neutrals | `#F9FAFC` / `#F8FAFC` / `#F1F5F9` / `#FFFFFF` | Light-section backgrounds, cards |

Amber is **not** part of the canonical palette (unused across all approved mockups). Trust badges use whatever accent fits contextually — teal, sky, or emerald — not a single reserved "trust color."

A full `DESIGN.md` file exists with the complete token set (typography, spacing, elevation, shape rules, component specs) at `stitch_uptech_consulting_homepage_redesign/transatlantic_corporate_trust/DESIGN.md`. **Follow its typography/spacing/shape/elevation sections exactly** — only its color section is superseded by the table above. Key tokens, for quick reference:

- **Typography:** Plus Jakarta Sans (headings, tight tracking `-0.01em` to `-0.03em`) + Inter (body/utility text)
- **Layout:** 12-column grid, max-width 1280px, 24px desktop gutters, rounded-lg cards, hairline borders (`1px solid #E2E8F0`), soft ambient shadows — no flat, borderless cards
- **Signature component:** Dual-Split Hero — two columns (Individual/Career vs. Enterprise/Business), converging visually; becomes a segmented switcher on mobile

**Build a shared component library first** — header/nav, footer, breadcrumb, primary/secondary/WhatsApp buttons, trust-badge component, FAQ accordion. Every page below reuses these exactly. Do not rebuild these per page.

Reference implementation for the component library: the Stitch mockups in `stitch_uptech_consulting_homepage_redesign/` share an (almost) identical header, breadcrumb bar, footer, and button styles across all 7 `code.html` files — treat those as the working reference, not something to redesign from scratch. `home_executive_polish/code.html` is the canonical homepage (its header/footer are explicitly referenced as the source of truth in the IT Consulting mockup's own code comments); `exact_rebuild/code.html` is a superseded earlier draft of the same page — do not build from it.

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
**Buyer's fear:** "Is anyone actually going to fight for me, or does this go into a void?"
**Shape:** NOT a card grid. One continuous, sequential campaign shown as a connected path/timeline (Profile Audit → LinkedIn/Portal Setup → Daily Applications → Interview Prep → Ongoing Recruiter Follow-Up). Do NOT split "what's included" and "process" into two sections — they are the same content here.
**CTA:** "Start Your Career Campaign" (an intake action) — NOT "Book a Consultation."
**Tone:** Warm, personal, relentless-on-your-behalf. Use UCO's real stated language: *"We dedicate a full-time worker to your account whose job is to make sure you never miss a relevant posting, and follow up with recruiters until you're placed."* This is a real operational fact from UCO's own materials — do not paraphrase it into generic "personalized support" language.

### Template C — Regulatory/Procedure
**Used for:** Business Formalisation & Compliance (5 sub-pages: Business Formalisation Cameroon, Business Formalisation US, Tax Compliance for Businesses Cameroon, Tax Compliance for Individuals Cameroon, CNPS Compliance Cameroon)
**Buyer's fear:** "Will this be done correctly, and will I get in legal trouble if it isn't?"
**Shape:** Documents & Requirements checklist + step-by-step official procedure + realistic (not exact) timelines. Softer CTA sequencing: "Get the Checklist" first, "Book a Consultation" second.
**Mandatory elements not present in Templates A/B:**
- Visible compliance disclaimer: *"This information is general guidance. Requirements may change — confirm current details with your UCO consultant."*
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
| Homepage | Special (see below) | Designed — see `home_executive_polish/code.html` |
| IT Consulting & Outsourcing | A — Advisory/Menu | Designed & coded (`code.html` exists) — ⚠️ built before re-prioritization; confirm with team whether to hold or proceed |
| Career Marketing & Placement | B — Campaign/Sequence | **Designed — PRIORITY 1, build first** |
| Business Formalisation & Compliance (hub) | Router/hub | Designed |
| Business Formalisation — Cameroon | C — Regulatory/Procedure | Designed |
| Tax Compliance for Businesses — Cameroon | C — Regulatory/Procedure | Designed |
| Business Formalisation — US | C — Regulatory/Procedure | Not yet designed |
| Tax Compliance for Individuals — Cameroon | C — Regulatory/Procedure (different audience) | Not yet designed |
| CNPS Compliance for Businesses — Cameroon | C — Regulatory/Procedure | Not yet designed |
| Recruitment & BPO | A — Advisory/Menu (likely) | **PAUSED** — pending leadership's dedicated structure session. Do not build or place in nav yet. |
| About | — | Not yet designed |
| Contact | — | Not yet designed — blocked on form-routing decision (who receives job-seeker vs. business leads) |
| Careers at UCO | — | Confirmed in scope (UCO hires externally) — needs real job postings before build |
| Case Studies | — | Contingent on real client story availability |

**Homepage's special role:** unlike every other page (which can go deep on one audience/topic), the homepage must work for a zero-context visitor and serve both audiences (career-seekers and businesses) simultaneously. Its success condition includes correctly routing a visitor elsewhere, not just converting on-page. Structure: Split Hero → Guided Router → Trust Strip → "Meet Your Dedicated Person" → The Bridge (visual, Buea⇄Stafford) → Services Grid → "Do the Math" comparator → Real Results (merged testimonial+outcome) → FAQ → Final CTA Band → Footer.

**Build order:** Career Marketing & Placement first (explicit leadership priority), then the 5 Business Formalisation & Compliance pages + hub. Do not start Recruitment & BPO or expand IT Consulting further without explicit confirmation.

---

## 6. Non-Negotiable Content & Naming Rules

1. **Canonical service name is "Career Marketing & Placement"** — not "Career & Profile Marketing" or any other variant. Use this exact name in nav, cross-links, page titles, and breadcrumbs everywhere. (Note: some Stitch mockup footers say "Career & Profile Marketing" — this is a mockup error, not a spec change. Correct it when building.)
2. **Never fabricate statistics or certifications.** No invented SLA percentages, uptime numbers, or compliance certifications that aren't real and confirmed. If a real number doesn't exist yet, use a qualitative badge (e.g., "24/7 Support Availability") or mark it `[PENDING: confirm with UCO]` — visually distinct (dashed border/muted tone) so it's obvious this needs real data before launch. (Note: several Stitch mockups contain invented testimonial numbers and case-metric figures — e.g. the Career Marketing page's "Marc K." testimonial and the homepage's "completed engagement" stat cards. These are layout placeholders only; do not carry the invented numbers/quotes into the real build.)
3. **Testimonials/case studies:** placeholder-safe structure everywhere (design the section to still feel substantial with 1-2 examples), do not populate with invented quotes.
4. **Pricing:** default to "Contact us for a quote" / consultation-based CTAs unless told UCO has decided to publish pricing.
5. **Competitor names are never published anywhere on the site.** All competitor research is internal strategy only.
6. **WhatsApp click-to-chat is core infrastructure**, not a decorative nice-to-have — include it prominently across pages, styled only in WhatsApp Green.
7. **Mobile/low-bandwidth performance is a real constraint, not a preference.** A meaningful share of UCO's Cameroon audience is on slower mobile connections. Avoid heavy hero video, unoptimized large images, and animation-heavy sections. Use Next.js Image optimization by default.

---

## 7. Security Requirements (apply from the start, not as a later pass)

- All Supabase/Resend API keys in server-side environment variables only — never client-side, never committed to git
- HTTPS/HSTS enforced sitewide
- Security headers via Next.js config (CSP, X-Frame-Options, Strict-Transport-Security)
  - **2026-09-10 finding:** a bare `script-src 'self'` blocks the App Router's own inline RSC bootstrap scripts and renders **every page blank in production**. This shipped undetected because verification had only ever run against `npm run dev`, whose CSP includes `'unsafe-inline'`. **Always verify against `npm run build && npx next start`, not the dev server.** Current CSP allows `'unsafe-inline'` for `script-src` only, to keep pages statically prerendered (a per-request nonce would force dynamic rendering and cost the edge-cacheable HTML that Section 6.7's low-bandwidth audience depends on). See the comment block in `next.config.mjs`. **Revisit and switch to nonce-based CSP when the lead-capture form and admin dashboard land** — that is when user-supplied content starts being rendered.
- Server-side input validation on all forms, not just client-side
- Rate limiting on the lead-capture API route
- Bot protection (Turnstile/hCaptcha) on all public forms
- Principle of least privilege in the admin dashboard's role system (Administrator / Editor / Viewer)
- A visible Privacy Policy and Terms of Service are required before collecting any personal data (resumes, business registration details) — this is a real legal requirement given cross-border data collection (US + Cameroon), not decoration

The Claude Code `security-guidance` plugin is installed (project-scoped, `.claude/settings.json`) — keep it enabled throughout this build. Note: it needs this directory to be a git repository for its deeper review layers to run; run `git init` before relying on those layers.

---

## 8. Admin Dashboard — What It Needs to Support

Custom-built (not a CMS product). Two department-specific access paths after login: **Career Services Operations** and **Business Formalisation & Compliance**. Content types needed: Site Settings, Homepage content, Service Pages (per template type above), Team Members, Case Studies, Testimonials, FAQ Items, Job Postings (Careers at UCO — kept visibly distinct from client-facing Career Marketing content), Leads (from the contact/intake forms, routed by type). Compliance pages (Template C) need a **review-cadence/"last reviewed" flag** in the admin schema, since their content can go legally stale in a way other pages don't.

---

## 9. What NOT To Do

- Do not build Recruitment & BPO or restructure IT Consulting's nav placement — both are paused pending a leadership session
- Do not invent Cameroonian or US regulatory procedure details from general knowledge — use only what's explicitly supplied as real content; mark unknowns `[PENDING]`
- Do not treat the three page templates as interchangeable — check which template a given service belongs to before generating its structure
- Do not silently fill `[PENDING]` placeholders with plausible-looking fake data to make a page "look done"
- Do not use MySQL, Sanity, Prisma, or NextAuth — superseded decisions
- Do not add "Recruitment & BPO" or "General Contracts & Supplies" to the real nav/footer, even though several Stitch mockups show them as live links — Recruitment & BPO is explicitly paused, and General Contracts & Supplies has no page, content, or mention anywhere in this spec (2026-09-09 decision: omit both until scope is confirmed).

---

## 10. Immediate Task

Build the **Career Marketing & Placement** page (Template B) first, using the shared component library (header/nav/footer/breadcrumb/buttons) as the foundation. Reference `DESIGN.md` for typography/spacing/shape/elevation tokens and the table in Section 3 above for colors. Ask for real content (hero copy, trust-strip facts, personas, FAQ questions, testimonials/pricing stance) if it hasn't been supplied yet — do not invent it.
