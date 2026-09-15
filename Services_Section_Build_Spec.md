# Uptech Consulting — Services Section: Frontend Build Specification

**For: Precious (Frontend — Services Section)**
**Purpose:** This document specifies everything under `/services` — the Services hub page, every individual service page and its sub-pages, routing/breadcrumb structure, and exactly what makes each page unique rather than a reskin of the last one. Feed this directly into your own Claude Code session alongside `DESIGN.md` and `CLAUDE.md`.

This is one connected system, not a pile of separate pages — read it end to end before building anything, since several pages depend on shared components and a consistent routing pattern.

---

## 1. The Core Principle — Read This First

Every page under `/services` shares the same visual design system (colors, type, spacing, header, footer) but **not the same content structure.** There are **three distinct page templates**, because different services create different fears in the person reading them. Building all of these as "the hero page with a different heading" is the single biggest way this section could go wrong — each page needs to actually do a different job.

| Template | Used for | Buyer's real fear | Shape |
|---|---|---|---|
| **A — Advisory/Menu** | IT Consulting & Outsourcing (**paused by leadership decision** — soft-hidden sitewide; see `CLAUDE.md` Section 5) | "Will this be done competently?" | Card grid — independent services a visitor picks from |
| **B — Campaign/Sequence** | Career Marketing & Placement (broadened to general career placement, no longer IT-specific — see Section 6.1) | "Is anyone actually fighting for me, or does this go into a void?" | One continuous linear path — not a menu |
| **C — Regulatory/Procedure** | The 4 Business Formalisation & Compliance pages (Tax Compliance for Businesses and for Individuals were unified into one — see Section 6.4/6.6) | "Will this be done correctly, and will I get in legal trouble if it isn't?" | Documents checklist + official procedure + disclaimer |

Full detail on each template is in Section 6. Build the shared components in Section 13 first — every page below depends on them.

---

## 2. Full URL & Breadcrumb Map

Two breadcrumb depths exist in this section — most pages are 3 levels, the 4 compliance sub-pages are 4 levels (they sit under their own hub).

| Page | URL | Breadcrumb |
|---|---|---|
| Services hub (NEW — see Section 3) | `/services` | Home / Services |
| Career Marketing & Placement | `/services/career-marketing-placement` | Home / Services / Career Marketing & Placement |
| IT Consulting & Outsourcing | `/services/it-consulting-outsourcing` | Home / Services / IT Consulting & Outsourcing |
| Business Formalisation & Compliance (hub) | `/services/business-formalisation-compliance` | Home / Services / Business Formalisation & Compliance |
| → Business Formalisation — Cameroon | `/services/business-formalisation-compliance/business-formalisation-cameroon` | Home / Services / Business Formalisation & Compliance / Business Formalisation — Cameroon |
| → Business Formalisation — US | `/services/business-formalisation-compliance/business-formalisation-us` | Home / Services / Business Formalisation & Compliance / Business Formalisation — United States |
| → Tax Compliance — Cameroon (unified: businesses & individuals) | `/services/business-formalisation-compliance/tax-compliance-businesses-cameroon` | Home / Services / Business Formalisation & Compliance / Tax Compliance — Cameroon |
| ~~→ Tax Compliance for Individuals — Cameroon~~ | ~~`/services/business-formalisation-compliance/tax-compliance-individuals-cameroon`~~ | **Merged into the row above.** That URL now redirects there (`redirect()` in its `page.tsx`, not a `next.config.js` rewrite — the static-export build ignores those) rather than 404ing for anyone with the old link bookmarked or indexed. |
| → CNPS Compliance — Cameroon | `/services/business-formalisation-compliance/cnps-compliance-cameroon` | Home / Services / Business Formalisation & Compliance / CNPS Compliance for Businesses — Cameroon |

**Breadcrumb component rules:**
- Every segment except the current (last) page is a clickable link
- "Home" always links to `/`
- "Services" always links to `/services` (the hub, not the homepage's `#services` anchor — those are two different things, see Section 3 note)
- Component must support both 3-level and 4-level depth from one reusable component — pass breadcrumb items as an array prop, don't hardcode depth

**Naming note:** use the exact page names above everywhere (nav, breadcrumb, page titles, cross-links). "Career Marketing & Placement" is the only correct name for that service — do not use "Career & Profile Marketing" anywhere, that variant appeared once in an earlier draft and was an error.

---

## 3. The Services Hub Page — `/services` (NEW PAGE, not yet designed, needs to be built)

This page doesn't exist yet in any prior design pass and needs to be built now. It is **different from the homepage's services grid** — the homepage briefly teases all pillars for a zero-context visitor; this page is the actual directory for someone who clicked "Services" in the nav wanting to browse deliberately.

**Its one job:** give a visitor a complete, honest, organized view of everything Uptech Consulting offers, and route them confidently to the right page.

**Sections:**
1. Short header: "Our Services" + one-line framing (e.g., "Two ways we help — building your career, and building your business.")
2. **Service cards, grouped by real category, not a flat list:**
   - **For Careers:** Career Marketing & Placement (active — link works)
   - **For Business:** Business Formalisation & Compliance (active — links to hub). IT Consulting & Outsourcing is **paused by leadership decision** — per the data-driven design below, this is a one-line `status` flip to `"hidden"`, already done.
3. Each card: icon, one-line description, "Learn more →" link — shallow by design, same pattern as the homepage's pillar cards, just more complete/organized here

**Important build instruction — make this data-driven, not hardcoded:**
Recruitment & BPO and General Contracts & Supplies are real, official service pillars that are currently paused pending a leadership structure session (see `CLAUDE.md`). Whether they appear here at all — fully hidden, or shown with a "Coming Soon" state — is not decided yet. **Build this page's card list from a single data array with a `status` field (`"active" | "comingSoon" | "hidden"`) per service, not as hardcoded JSX cards.** That way, when leadership resolves the paused-services question, it's a one-line data change, not a rebuild.

```
// Example shape, not final content
const services = [
  { name: "Career Marketing & Placement", status: "active", href: "/services/career-marketing-placement", category: "career" },
  { name: "Business Formalisation & Compliance", status: "active", href: "/services/business-formalisation-compliance", category: "business" },
  { name: "IT Consulting & Outsourcing", status: "hidden", href: null, category: "business" }, // paused by leadership decision
  { name: "Recruitment & BPO", status: "hidden", href: null, category: "business" },
  { name: "General Contracts & Supplies", status: "hidden", href: null, category: "business" },
]
```

---

## 4. Navigation — Services Dropdown Behavior

The main site nav's "Services" item should be a **hover/click dropdown**, not a plain link straight to the hub — a visitor shouldn't have to land on `/services` just to see the list. Dropdown contents:

- Career Marketing & Placement
- Business Formalisation & Compliance *(hovering/expanding this shows the 4 sub-pages as a nested flyout, OR link directly to the hub — recommend the flyout on desktop, since it saves a click for a visitor who already knows what they want; on mobile, tapping "Business Formalisation & Compliance" in the collapsed nav expands inline rather than navigating away)*
- ~~IT Consulting & Outsourcing~~ **Removed — paused by leadership decision, soft-hidden sitewide (see `CLAUDE.md` Section 5). The page and its code still exist; only the nav entry is gone.**
- A "View All Services" link at the bottom of the dropdown, pointing to `/services` (the hub), for anyone who wants the full browsing experience

**Resolved (was an open decision):** Career Marketing & Placement does NOT appear inside IT Consulting & Outsourcing's service grid. This is no longer a live question either way — Career Marketing was broadened off its IT-specific scoping and is no longer positioned as a sub-service of IT Consulting at all (see Section 6.1), and IT Consulting itself is currently paused and unlinked.

---

## 5. Content Architecture — Dynamic Templates, Not 5 Separate Page Files

**Important correction to how Section 6 below should actually be built:** the 4 Template C pages (Business Formalisation CM/US, Tax Compliance, CNPS) should NOT be hand-built as separate static page files with duplicated JSX. They share one template exactly, with only jurisdiction and content swapped. (Tax Compliance for Businesses and for Individuals were originally planned as two of these — they were later unified into one page covering both audiences; see Section 6.4/6.6.)

**Recommended approach:** one dynamic route, e.g. `/app/services/business-formalisation-compliance/[slug]/page.tsx`, driven by a content data object per page (or eventually a Supabase table, per the admin dashboard's future content model). Next.js's `generateStaticParams` and `generateMetadata` still let each resolved page be statically generated and independently SEO-optimized — dynamic routing does not mean worse SEO, it means the template code exists once instead of five times.

This matters practically: when real content (fees, timelines, documents) comes in from the team, someone updates a data object — not several separate component files that have quietly drifted out of sync with each other. (In practice, each page shipped as its own component file rather than one dynamic `[slug]` route — a gap from this section's own recommendation, unrelated to the leadership-adjustment round this revision documents.)

---

## 6. Per-Page Detailed Specs

### 6.1 Career Marketing & Placement — Template B (Campaign/Sequence)

**Status:** Built and live.

**One job:** Prove a real, dedicated human is actively working this campaign — not software, not a form into a void.

**Scoping — changed since this page was first built:** it was originally IT/tech-specific (the talent arm of Uptech's IT Consulting practice, per `CLAUDE.md` Section 4 at the time). **Leadership has since broadened it to general career placement, open to any professional background.** It is no longer positioned as a sub-service of IT Consulting at all — all persona and example content is general, not IT/tech-specific.

**Sections, in order:**
1. Hero — headline built around relief from job-search exhaustion (e.g., "You don't chase jobs. We do."). Primary CTA: **"Start Your Career Campaign"** (an intake action — NOT "Book a Consultation"). Secondary: WhatsApp.
2. Trust Strip — 3 badges using real UCO language: dedicated account worker, bilingual support, ongoing recruiter follow-up
3. **The Campaign** — one merged section (do NOT split "what's included" from "process" into two sections, they're the same content here): a connected linear path — Profile & CV Audit → LinkedIn & Portal Setup → Daily Targeted Applications → Interview Preparation → Ongoing Recruiter Follow-Up
4. Who This Is For — 3 persona cards, general (broadened off the earlier IT-specific framing): recent graduates, experienced professionals re-entering the market, diaspora professionals
5. Real Results — merged testimonial + outcome section (structure to feel substantial even with 1-2 real examples)
6. FAQ — service-specific objections (What if I don't get placed? How is this different from doing it myself? etc.)
7. Explore Other Pillars — cross-link grid
8. Footer

**Tone:** warm, personal, relentless-on-your-behalf. Opposite register from IT Consulting's technical tone (a contrast that holds regardless of IT Consulting's own paused status).

---

### 6.2 Business Formalisation & Compliance — Hub Page — Router/Hub Template

**Status:** Designed & built.

**One job:** Route a visitor to the correct one of 4 sub-pages in one click. This is required infrastructure — 4 pages cannot all hang cleanly off one nav item without it. (Originally 5 pages/pathways — Tax Compliance for Businesses and for Individuals were later unified into one, so the hub now routes to 4, not 5.)

**Sections, in order:**
1. Hero — headline around removing regulatory uncertainty. Primary CTA: **"Find My Path"** (scrolls to/triggers the router, not a direct consultation booking).
2. **Guided Router** — 2-step selector: Step 1: "Business or Individual?" → Step 2 (if Business): which specific need (Formalisation Cameroon / Formalisation US / Tax Compliance / CNPS); Step 2 (if Individual): **"Personal tax, or starting your own venture?"** — Personal Tax resolves to the unified Tax Compliance page, Starting a Venture asks a further Cameroon-or-US jurisdiction question and resolves into the Business Formalisation flow. (This individual branch used to resolve straight to personal tax with no venture path at all — a real gap, now fixed.) Each resolves to a card with a "Go to this page" CTA.
3. **The Four Pathways** — one unified card grid, not grouped into "For Businesses" / "For Individuals" clusters (that grouping stopped making sense once Tax Compliance became a page serving both — it carries an "audience" badge instead of living in its own column). Each card: icon, description, jurisdiction indicator (Cameroon/US flag or label), "Learn more" link.
4. Why This Matters — trust section: jurisdiction-specific expertise (OHADA/RCCM for Cameroon, LLC/S-Corp for US), plus the visible compliance disclaimer
5. Free Checklist Lead Magnet — "Is Your Business Registration-Ready?" downloadable checklist, email-capture form
6. Cross-link Grid — to Career Marketing & Placement. (IT Consulting & Outsourcing removed — paused by leadership decision, soft-hidden sitewide.)
7. Footer

---

### 6.3 Business Formalisation — Cameroon — Template C (Regulatory/Procedure)

**Status:** Designed.

**One job:** Prove the registration process is knowable and Uptech Consulting has done it before — certainty through procedural transparency.

**Sections, in order:**
1. Hero — headline removing registration anxiety (e.g., "Formalise your business in Cameroon, without the guesswork"). Primary CTA: **"Get the Registration Checklist"** (lead-magnet, lower commitment). Secondary: WhatsApp. Do NOT lead with "Book a Consultation."
2. Trust Strip — OHADA/RCCM compliance, remote registration for diaspora clients, documented process
3. **The Process** — general public procedure only (Name Reservation → RCCM Registration → Statutes → Tax ID/NIU → CFCE), shown as a connected step-path. Timeline range marked `[PENDING: confirm with UCO]` until real data supplied.
4. **Documents & Requirements Checklist** — the highest-trust section on this page. Include a line item for **Power of Attorney** (for remote/diaspora clients specifically). Fees marked `[PENDING]`.
5. Who This Is For — 3 personas: first-time entrepreneurs, informally-operating businesses looking to legalize, diaspora business owners needing remote registration
6. Do the Math — cost-of-doing-it-alone comparator (time lost to rejected paperwork/repeat visits vs. guided process)
7. **What Comes Next** — NOT a generic cross-link grid. Explicit forward-pointing section: "Once formalised, most businesses also need..." → links to Tax Compliance (Cameroon) and CNPS Compliance
8. FAQ — service-specific (Can this be done remotely? What if my business name is taken? Do I need a physical office?)
9. **Compliance Disclaimer + "Last Reviewed: [DATE]"** — visible, permanent component
10. Footer

**Content boundary to respect:** publish official/public procedure steps and client-facing document requirements freely. Never publish UCO's internal negotiation tactics, specific government-office relationships, or exact fees/timelines that aren't confirmed real data.

---

### 6.4 Tax Compliance — Cameroon — Template C (Regulatory/Procedure, recurring variant)

**Status:** Built and live. **Unified per leadership decision:** this was originally "Tax Compliance for Businesses — Cameroon" only, with personal tax split out to its own page (see 6.6, now merged in below). It now serves both audiences on one page, URL unchanged (`tax-compliance-businesses-cameroon`, kept to avoid breaking existing links into it — only the display copy dropped "for Businesses").

**One job:** Different from Formalisation's one-time-event certainty — this page's fear is "am I going to get penalized for something I didn't know I owed." This is an ONGOING obligation, not a one-time setup. (True for both the business and personal-tax sides.)

**Sections, in order:**
1. Hero — headline around ongoing peace of mind (e.g., "Stay ahead of your tax obligations, without the stress"). Primary CTA: **"Get a Compliance Check."**
2. Trust Strip — ongoing filing support, Cameroon tax code expertise, documented compliance calendar
3. **Your Compliance Calendar** — a recurring-rhythm visual (monthly/quarterly/annual categories), NOT a linear one-time step-path like the Formalisation page. Specific dates/figures marked `[PENDING]`.
4. **Who This Is For — three personas, EQUAL visual weight, not one primary + two secondary:**
   - "Newly Formalised & Staying Ahead" (proactive, business)
   - "Catching Up on Filings" (already behind, business — tone must be explicitly non-judgmental: "Behind on filings? You're not alone — let's get you current.")
   - **"Individuals With Personal Tax Obligations"** (personal IRPP, not corporate — added when the standalone individuals page was merged into this one; same equal-weight treatment as the other two, not a bolted-on afterthought)
5. What We Handle — client-facing scope only. Include one explicit line: "Social insurance compliance (CNPS) is handled on its own page →" linking to the CNPS page, so visitors don't wonder if it's covered here.
6. **The Real Cost of Falling Behind** — penalty-risk comparator (cost of a missed filing/penalty vs. managed compliance). More concrete/urgent framing than the Formalisation page's comparator, since real financial penalties are the actual stake. Figures marked `[PENDING]`.
7. ~~**Also Managing Your Personal Taxes?** — a specific cross-link (not the generic grid) to Tax Compliance for Individuals, since many business owners need both~~ **Removed:** personal tax is now covered on this same page (see persona 3 and the FAQ additions below), so a cross-link to a separate personal-tax page would point back at itself.
8. FAQ — specific to this page (What if I've missed previous filings? Back-taxes if just now formalising? How often will I provide documents?)
9. Compliance Disclaimer + Last Reviewed
10. Footer

**Tone:** calm/reassuring for the proactive persona, warm and explicitly non-judgmental for the catching-up persona — no shame-based language anywhere on this page. Same warmth extends to the personal-tax persona; it isn't a lesser, bolted-on afterthought to the business content.

**FAQ additions from the merge:** the four personal-tax FAQ items from the old standalone individuals page (foreign-income declaration, unregistered freelancers, filing deadline, required documents) were added to this page's FAQ rather than dropped.

---

### 6.5 Business Formalisation — United States (NOT yet designed — build structurally now, swap final visuals later)

**Status:** Not yet designed by Titi. Structurally, this shares the exact template as 4.3 (Business Formalisation — Cameroon) with the jurisdiction swapped.

**Build instruction:** Don't wait on final design approval to start the component structure. Build this page using the same component set as 4.3, with jurisdiction-specific content swapped:
- Procedure references US filing steps (e.g., LLC/S-Corp formation, EIN registration) instead of RCCM/OHADA/CFCE
- Documents & Requirements checklist reflects US-specific requirements
- **Important content-honesty note (from `CLAUDE.md`):** confirm with the team whether Uptech Consulting has in-house US filing expertise or a licensed US partner backing this content before publishing confident procedural claims — this affects how the page's trust strip and "why this matters" section should be worded
- "Who This Is For" personas will differ from the Cameroon page — likely diaspora Cameroonians setting up a US entity, or US-based businesses wanting Cameroon market entry later — confirm with team before finalizing, use a `[PENDING: confirm personas]` placeholder in the meantime

---

### 6.6 Tax Compliance for Individuals — Cameroon — **MERGED into 6.4, no longer a standalone page**

**Status:** This was never designed as its own page before leadership decided to unify it with 6.4 instead — so there's no separate build to track here any more. Its content (personas, FAQ, document checklist) now lives on the unified Tax Compliance page (Section 6.4). Its old URL (`tax-compliance-individuals-cameroon`) redirects to the unified page rather than 404ing, and every internal link that pointed to it (the Individuals persona page's Personal Tax card, the Business Formalisation hub's router and "Five Pathways" grid, the main nav) was updated to point at the unified page directly instead of through the redirect.

This section is kept (rather than deleted) so anyone reading this doc's history understands why a page that was never fully designed doesn't appear as a gap in Section 7's blocked-work table below — it isn't blocked, it was folded into an already-built page.

---

### 6.7 CNPS Compliance for Businesses — Cameroon (NOT yet designed — build structurally now)

**Status:** Not yet designed by Titi. Same category as 6.4 (Tax Compliance for Businesses) — an ongoing/recurring obligation, social insurance rather than tax.

**Build instruction:** Use the same recurring-obligation template shape as 6.4 (compliance calendar, not a one-time step-path). Content-wise:
- What We Handle should include an explicit line distinguishing this from Tax Compliance ("Tax obligations are handled on their own page →")
- "What Comes Next" / sequencing: this is typically the last step after Formalisation → Tax Compliance → CNPS — its own cross-link should acknowledge it's the final piece, not point forward to another compliance page
- Mark specific contribution rates, deadlines, and figures `[PENDING]` until real data is supplied

---

### 6.8 IT Consulting & Outsourcing — Template A (Advisory/Menu)

**Status:** Already designed and coded (`code.html` exists). **Resolved (was pending team confirmation): paused by leadership decision.** Soft-hidden sitewide — removed from the main nav, footer, homepage pillars, homepage rotating statements, and every cross-link section that pointed to it (Career Marketing, the Business Formalisation hub, Who We Are, the Businesses persona page). The page and its code remain intact, not deleted, for whenever it's unpaused — reference only, do not rebuild, do not relink without a further leadership decision.

**Known fixes needed if/when this page proceeds:**
- Cross-link label currently reads "Career & Profile Marketing" in one spot — must be corrected to "Career Marketing & Placement"
- Trust-strip stat ("99.98% SLA Availability") must be verified as real or replaced with a qualitative badge — do not ship an invented precision statistic
- Confirm the "Technology Advisory" sub-service traces to something real in Uptech's official service list, or adjust

---

## 7. What's Genuinely Blocked vs. What You Can Build Now

| Page | Can build structure now? | Blocked on |
|---|---|---|
| Services hub | Yes | Just the active/hidden data flags per Section 3 |
| Career Marketing & Placement | Yes, fully | Real hero copy/testimonials if not yet supplied |
| Business Formalisation & Compliance hub | Yes, fully | — |
| Business Formalisation — Cameroon | Yes, fully | Real fees/timeline data (`[PENDING]` in the meantime) |
| Tax Compliance — Cameroon (unified) | Built | Real calendar/penalty data (`[PENDING]`) |
| Business Formalisation — US | Built | Confirmed US-expertise backing + personas |
| ~~Tax Compliance for Individuals~~ | — | **Merged into the row above — not a separate page any more.** |
| CNPS Compliance | Built | Real contribution/deadline data (`[PENDING]`) |
| IT Consulting & Outsourcing | Built, then paused | **Resolved:** paused by leadership decision, soft-hidden sitewide (was "team confirmation on whether it proceeds" — that confirmation happened) |

---

## 8. SEO Requirements Per Page

This is Randy's domain (SEO owner), but Precious needs to build the structure that makes it possible — SEO can't be bolted on after the fact.

- **Every page needs a unique `<title>` and meta description** — do not let Next.js fall back to a generic site-wide default. Use `generateMetadata` per route.
- **Canonical URLs** on every page, especially the 4 compliance sub-pages, to avoid any duplicate-content ambiguity between them
- **Service schema markup (Schema.org `Service` type)** on every service page — this was already committed to as a standout feature earlier in the project (structured data for local/service search visibility). Include: service name, description, provider (Uptech Consulting), areaServed (Cameroon/US as applicable)
- **Open Graph tags** per page (title, description, image) — this affects how links look when shared on WhatsApp/LinkedIn, which matters given how much of Uptech's real client communication happens over WhatsApp
- **Internal linking strategy needs Randy's sign-off, not just Precious's judgment.** The entire reason the compliance pages were originally split apart instead of staying one page is SEO — each targeting its own high-intent search term. The cross-linking this document specifies (What Comes Next, hub router) is good UX, but heavy-handed or generic anchor text between them could work against the exact SEO goal that justified splitting them in the first place. **Before shipping the cross-link components, confirm anchor text and linking density with Randy.**
- **Flag for Randy, not resolved here:** leadership's decision to unify Tax Compliance for Businesses and for Individuals into one page runs directly against this section's own SEO rationale — it collapses two distinct high-intent search terms ("tax compliance for individuals cameroon" vs. "...for businesses") onto one URL. The redirect preserves the old URL's existing link equity rather than losing it outright, but whether the unified page can still rank for both search intents as well as two separate pages could is an open SEO question this document cannot answer — worth Randy's explicit review, not an assumed non-issue.

---

## 9. Analytics & Conversion Tracking

The project's stated goal is lead generation — this section only works if it's measurable. Instrument each unique CTA as its own distinct event (Google Analytics 4), not one generic "button_click":

- `start_career_campaign` (Career Marketing hero CTA)
- `get_registration_checklist` (Formalisation pages' lead magnet)
- `get_compliance_check` (Tax Compliance CTA)
- `book_consultation` (wherever this CTA appears)
- `whatsapp_click` (every WhatsApp button, tagged with which page it was clicked from)
- `hub_router_completed` (Business Formalisation hub's 2-step router, tagged with the resulting path chosen)

This lets the team actually answer "which service page converts best," not just "did the site launch."

---

## 10. States to Design For (not just the happy path)

- **Invalid service slug** (e.g., a typo'd or old URL under `/services/...`) — a proper 404 within the services section, not a generic site-wide error page, ideally with a link back to the Services hub
- **Empty/pending content states** — e.g., a Real Results section before any real testimonial exists. Design this to read as "coming soon" rather than a broken-looking empty box
- **`[PENDING]` content rendering** — every instance of pending data (fees, timelines, figures) must render through the shared `<PendingBadge />` component (Section 13), never as plain text that could be mistaken for confirmed information
- **Form submission states** — loading/"Sending...", success confirmation, and error states for every lead-capture form (checklist download, compliance check request, career campaign intake) — a silent form with no feedback is a real conversion killer, not a minor polish item

---

## 11. Mobile Behavior of the New Components

Each unique visual component introduced in this document needs specific mobile behavior, not just "it's responsive":

- **The Campaign path (Career Marketing)** — collapses to a vertical stacked sequence with a connecting line, not a horizontal scroll
- **Compliance Calendar (Tax Compliance, CNPS)** — collapses to an accordion grouped by period (Monthly / Quarterly / Annual) rather than a wide horizontal calendar grid
- **Hub's 2-step guided router** — becomes a full-screen, one-question-at-a-time wizard flow on mobile, not a cramped two-dropdown form
- **Documents & Requirements checklist** — stays a simple vertical list on mobile, no layout change needed, but keep tap targets large enough for a real touch device, not just visually shrunk desktop cards

---

## 12. Sequencing Language — One Accuracy Caution

The "What Comes Next" component (Section 6.3, 6.4) implies a fairly deterministic sequence (Formalisation → Tax Compliance → CNPS). Not every business necessarily needs all three, or in that exact order. Whoever writes final copy for these sections should keep the "most businesses also need..." framing already specified rather than language that reads as a mandatory checklist — this is a content-accuracy nuance worth flagging to whoever finalizes copy, not a structural change.

---

## 13. Shared Components Needed (build these once, reuse everywhere)

- `<Breadcrumb items={[...]} />` — supports 3 or 4 levels, last item non-clickable
- `<ServiceHero />` — variant prop for headline/CTA style per template type
- `<TrustBadgeStrip badges={[...]} />`
- `<ProcessPath steps={[...]} />` — linear connected path visual (Template B, and Template C one-time pages like Formalisation)
- `<ComplianceCalendar categories={[...]} />` — recurring-rhythm visual (Template C recurring pages: Tax Compliance, CNPS)
- `<PersonaCard title="" painPoint="" outcome="" />`
- `<DocumentsChecklist items={[...]} />` — Template C only
- `<ComparatorWidget />` — configurable for "time lost" (Formalisation) vs. "penalty risk" (Tax Compliance) framing
- `<WhatsNext links={[...]} />` — Template C sequencing component, distinct from generic cross-links
- `<ComplianceDisclaimer lastReviewed="" />` — Template C only, permanent/visible
- `<FAQAccordion items={[...]} />`
- `<CrossLinkGrid services={[...]} />`
- `<PendingBadge />` — visually distinct (dashed border/muted tone) wrapper for any `[PENDING]` content, so it's never mistaken for real data by a reviewer or, worse, a visitor

**Content architecture recommendation:** keep each page's actual copy (headlines, persona text, FAQ items) in a separate structured data object/file per page rather than inline JSX — this mirrors the admin dashboard's future content model (per `CLAUDE.md` Section 8) and makes it trivial to swap placeholder content for real content later without touching layout code.

---

## 14. Non-Negotiables Carried Over From `CLAUDE.md` (do not relitigate these here)

- "Uptech Consulting," never "UCO," in any visible copy
- No fabricated statistics, certifications, or exclusivity claims
- No pricing published unless explicitly told otherwise — default to consultation/checklist CTAs
- Real logo asset only, never a placeholder mark
- Mobile/low-bandwidth performance is a real constraint — no heavy video/animation
- Do not build Recruitment & BPO or General Contracts & Supplies pages — paused pending leadership session

Full detail and rationale for all of the above lives in `CLAUDE.md` — read that file too, this document assumes it as context, not a replacement for it.
