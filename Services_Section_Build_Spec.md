# Uptech Consulting — Services Section: Frontend Build Specification

**For: Precious (Frontend — Services Section)**
**Purpose:** This document specifies everything under `/services` — the Services hub page, every individual service page and its sub-pages, routing/breadcrumb structure, and exactly what makes each page unique rather than a reskin of the last one. Feed this directly into your own Claude Code session alongside `DESIGN.md` and `CLAUDE.md`.

This is one connected system, not a pile of separate pages — read it end to end before building anything, since several pages depend on shared components and a consistent routing pattern.

---

## 1. The Core Principle — Read This First

Every page under `/services` shares the same visual design system (colors, type, spacing, header, footer) but **not the same content structure.** There are **three distinct page templates**, because different services create different fears in the person reading them. Building all of these as "the hero page with a different heading" is the single biggest way this section could go wrong — each page needs to actually do a different job.

| Template | Used for | Buyer's real fear | Shape |
|---|---|---|---|
| **A — Advisory/Menu** | IT Consulting & Outsourcing | "Will this be done competently?" | Card grid — independent services a visitor picks from |
| **B — Campaign/Sequence** | Career Marketing & Placement | "Is anyone actually fighting for me, or does this go into a void?" | One continuous linear path — not a menu |
| **C — Regulatory/Procedure** | The 5 Business Formalisation & Compliance pages | "Will this be done correctly, and will I get in legal trouble if it isn't?" | Documents checklist + official procedure + disclaimer |

Full detail on each template is in Section 6. Build the shared components in Section 13 first — every page below depends on them.

---

## 2. Full URL & Breadcrumb Map

Two breadcrumb depths exist in this section — most pages are 3 levels, the 5 compliance sub-pages are 4 levels (they sit under their own hub).

| Page | URL | Breadcrumb |
|---|---|---|
| Services hub (NEW — see Section 3) | `/services` | Home / Services |
| Career Marketing & Placement | `/services/career-marketing-placement` | Home / Services / Career Marketing & Placement |
| IT Consulting & Outsourcing | `/services/it-consulting-outsourcing` | Home / Services / IT Consulting & Outsourcing |
| Business Formalisation & Compliance (hub) | `/services/business-formalisation-compliance` | Home / Services / Business Formalisation & Compliance |
| → Business Formalisation — Cameroon | `/services/business-formalisation-compliance/business-formalisation-cameroon` | Home / Services / Business Formalisation & Compliance / Business Formalisation — Cameroon |
| → Business Formalisation — US | `/services/business-formalisation-compliance/business-formalisation-us` | Home / Services / Business Formalisation & Compliance / Business Formalisation — United States |
| → Tax Compliance for Businesses — Cameroon | `/services/business-formalisation-compliance/tax-compliance-businesses-cameroon` | Home / Services / Business Formalisation & Compliance / Tax Compliance for Businesses — Cameroon |
| → Tax Compliance for Individuals — Cameroon | `/services/business-formalisation-compliance/tax-compliance-individuals-cameroon` | Home / Services / Business Formalisation & Compliance / Tax Compliance for Individuals — Cameroon |
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
   - **For Business:** Business Formalisation & Compliance (active — links to hub), IT Consulting & Outsourcing (status: confirm with team whether this shows as active or is held — see `CLAUDE.md` Section 5)
3. Each card: icon, one-line description, "Learn more →" link — shallow by design, same pattern as the homepage's pillar cards, just more complete/organized here

**Important build instruction — make this data-driven, not hardcoded:**
Recruitment & BPO and General Contracts & Supplies are real, official service pillars that are currently paused pending a leadership structure session (see `CLAUDE.md`). Whether they appear here at all — fully hidden, or shown with a "Coming Soon" state — is not decided yet. **Build this page's card list from a single data array with a `status` field (`"active" | "comingSoon" | "hidden"`) per service, not as hardcoded JSX cards.** That way, when leadership resolves the paused-services question, it's a one-line data change, not a rebuild.

```
// Example shape, not final content
const services = [
  { name: "Career Marketing & Placement", status: "active", href: "/services/career-marketing-placement", category: "career" },
  { name: "Business Formalisation & Compliance", status: "active", href: "/services/business-formalisation-compliance", category: "business" },
  { name: "IT Consulting & Outsourcing", status: "active", href: "/services/it-consulting-outsourcing", category: "business" },
  { name: "Recruitment & BPO", status: "hidden", href: null, category: "business" },
  { name: "General Contracts & Supplies", status: "hidden", href: null, category: "business" },
]
```

---

## 4. Navigation — Services Dropdown Behavior

The main site nav's "Services" item should be a **hover/click dropdown**, not a plain link straight to the hub — a visitor shouldn't have to land on `/services` just to see the list. Dropdown contents:

- Career Marketing & Placement
- Business Formalisation & Compliance *(hovering/expanding this shows the 5 sub-pages as a nested flyout, OR link directly to the hub — recommend the flyout on desktop, since it saves a click for a visitor who already knows what they want; on mobile, tapping "Business Formalisation & Compliance" in the collapsed nav expands inline rather than navigating away)*
- IT Consulting & Outsourcing
- A "View All Services" link at the bottom of the dropdown, pointing to `/services` (the hub), for anyone who wants the full browsing experience

**Open decision, flag to the team:** should Career Marketing & Placement also appear as a card inside IT Consulting & Outsourcing's own six-card service grid (Template A), since it's officially one of that pillar's sub-services? The already-built IT Consulting page currently does NOT list it there. Leaving it out keeps Career Marketing's flagship page clean and un-duplicated; adding it back would be more organizationally accurate but creates two entry paths to the same page. Neither is wrong — just needs a decision, not silent inconsistency between pages.

---

## 5. Content Architecture — Dynamic Templates, Not 5 Separate Page Files

**Important correction to how Section 6 below should actually be built:** the 4 business-facing Template C pages (Business Formalisation CM/US, Tax Compliance for Businesses, CNPS) — and arguably Tax Compliance for Individuals too — should NOT be hand-built as 5 separate static page files with duplicated JSX. They share one template exactly, with only jurisdiction and content swapped.

**Recommended approach:** one dynamic route, e.g. `/app/services/business-formalisation-compliance/[slug]/page.tsx`, driven by a content data object per page (or eventually a Supabase table, per the admin dashboard's future content model). Next.js's `generateStaticParams` and `generateMetadata` still let each resolved page be statically generated and independently SEO-optimized — dynamic routing does not mean worse SEO, it means the template code exists once instead of five times.

This matters practically: when real content (fees, timelines, documents) comes in from the team, or when Titi finishes designing the 2 remaining pages, someone updates a data object — not five separate component files that have quietly drifted out of sync with each other.

---

## 6. Per-Page Detailed Specs

### 6.1 Career Marketing & Placement — Template B (Campaign/Sequence)

**Status:** Designed. Build first — this is the team's top priority page.

**One job:** Prove a real, dedicated human is actively working this campaign — not software, not a form into a void.

**Important scoping note:** this service is officially IT/tech-specific (it's the talent arm of Uptech's IT Consulting practice — see `CLAUDE.md` Section 4). All persona and example content must reference IT/tech roles specifically, not generic job seekers.

**Sections, in order:**
1. Hero — headline built around relief from job-search exhaustion (e.g., "You don't chase jobs. We do."). Primary CTA: **"Start Your Career Campaign"** (an intake action — NOT "Book a Consultation"). Secondary: WhatsApp.
2. Trust Strip — 3 badges using real UCO language: dedicated account worker, bilingual support, ongoing recruiter follow-up
3. **The Campaign** — one merged section (do NOT split "what's included" from "process" into two sections, they're the same content here): a connected linear path — Profile & CV Audit → LinkedIn & Portal Setup → Daily Targeted Applications → Interview Preparation → Ongoing Recruiter Follow-Up
4. Who This Is For — 3 persona cards, IT-specific: recent IT graduates, experienced IT professionals re-entering the market, diaspora IT professionals
5. Real Results — merged testimonial + outcome section (structure to feel substantial even with 1-2 real examples)
6. FAQ — service-specific objections (What if I don't get placed? How is this different from doing it myself? etc.)
7. Explore Other Pillars — cross-link grid
8. Footer

**Tone:** warm, personal, relentless-on-your-behalf. Opposite register from IT Consulting's technical tone.

---

### 6.2 Business Formalisation & Compliance — Hub Page — Router/Hub Template

**Status:** Designed.

**One job:** Route a visitor to the correct one of 5 sub-pages in one click. This is required infrastructure — 5 pages cannot all hang cleanly off one nav item without it.

**Sections, in order:**
1. Hero — headline around removing regulatory uncertainty. Primary CTA: **"Find My Path"** (scrolls to/triggers the router, not a direct consultation booking).
2. **Guided Router** — 2-step selector: Step 1: "Business or Individual?" → Step 2 (if Business): "Cameroon or United States?" then which specific need (Formalisation / Tax Compliance / CNPS); Step 2 (if Individual): routes directly to Tax Compliance for Individuals. Each resolves to a card with a "Go to this page" CTA.
3. **The Five Pathways** — card grid grouped into two visually separated clusters: "For Businesses" (4 cards) and "For Individuals" (1 card). Each card: icon, description, jurisdiction indicator (Cameroon/US flag or label), "Learn more" link.
4. Why This Matters — trust section: jurisdiction-specific expertise (OHADA/RCCM for Cameroon, LLC/S-Corp for US), plus the visible compliance disclaimer
5. Free Checklist Lead Magnet — "Is Your Business Registration-Ready?" downloadable checklist, email-capture form
6. Cross-link Grid — to Career Marketing & Placement, IT Consulting & Outsourcing
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
7. **What Comes Next** — NOT a generic cross-link grid. Explicit forward-pointing section: "Once formalised, most businesses also need..." → links to Tax Compliance for Businesses (Cameroon) and CNPS Compliance
8. FAQ — service-specific (Can this be done remotely? What if my business name is taken? Do I need a physical office?)
9. **Compliance Disclaimer + "Last Reviewed: [DATE]"** — visible, permanent component
10. Footer

**Content boundary to respect:** publish official/public procedure steps and client-facing document requirements freely. Never publish UCO's internal negotiation tactics, specific government-office relationships, or exact fees/timelines that aren't confirmed real data.

---

### 6.4 Tax Compliance for Businesses — Cameroon — Template C (Regulatory/Procedure, recurring variant)

**Status:** Designed.

**One job:** Different from Formalisation's one-time-event certainty — this page's fear is "am I going to get penalized for something I didn't know I owed." This is an ONGOING obligation, not a one-time setup.

**Sections, in order:**
1. Hero — headline around ongoing peace of mind (e.g., "Stay ahead of your tax obligations, without the stress"). Primary CTA: **"Get a Compliance Check."**
2. Trust Strip — ongoing filing support, Cameroon tax code expertise, documented compliance calendar
3. **Your Compliance Calendar** — a recurring-rhythm visual (monthly/quarterly/annual categories), NOT a linear one-time step-path like the Formalisation page. Specific dates/figures marked `[PENDING]`.
4. **Who This Is For — two personas, EQUAL visual weight, not one primary + one secondary:**
   - "Newly Formalised & Staying Ahead" (proactive)
   - "Catching Up on Filings" (already behind — tone must be explicitly non-judgmental: "Behind on filings? You're not alone — let's get you current.")
5. What We Handle — client-facing scope only. Include one explicit line: "Social insurance compliance (CNPS) is handled on its own page →" linking to the CNPS page, so visitors don't wonder if it's covered here.
6. **The Real Cost of Falling Behind** — penalty-risk comparator (cost of a missed filing/penalty vs. managed compliance). More concrete/urgent framing than the Formalisation page's comparator, since real financial penalties are the actual stake. Figures marked `[PENDING]`.
7. **Also Managing Your Personal Taxes?** — a specific cross-link (not the generic grid) to Tax Compliance for Individuals, since many business owners need both
8. FAQ — specific to this page (What if I've missed previous filings? Back-taxes if just now formalising? How often will I provide documents?)
9. Compliance Disclaimer + Last Reviewed
10. Footer

**Tone:** calm/reassuring for the proactive persona, warm and explicitly non-judgmental for the catching-up persona — no shame-based language anywhere on this page.

---

### 6.5 Business Formalisation — United States (NOT yet designed — build structurally now, swap final visuals later)

**Status:** Not yet designed by Titi. Structurally, this shares the exact template as 4.3 (Business Formalisation — Cameroon) with the jurisdiction swapped.

**Build instruction:** Don't wait on final design approval to start the component structure. Build this page using the same component set as 4.3, with jurisdiction-specific content swapped:
- Procedure references US filing steps (e.g., LLC/S-Corp formation, EIN registration) instead of RCCM/OHADA/CFCE
- Documents & Requirements checklist reflects US-specific requirements
- **Important content-honesty note (from `CLAUDE.md`):** confirm with the team whether Uptech Consulting has in-house US filing expertise or a licensed US partner backing this content before publishing confident procedural claims — this affects how the page's trust strip and "why this matters" section should be worded
- "Who This Is For" personas will differ from the Cameroon page — likely diaspora Cameroonians setting up a US entity, or US-based businesses wanting Cameroon market entry later — confirm with team before finalizing, use a `[PENDING: confirm personas]` placeholder in the meantime

---

### 6.6 Tax Compliance for Individuals — Cameroon (NOT yet designed — different audience, do not reuse business template as-is)

**Status:** Not yet designed by Titi. **This is NOT the same audience as the other 4 compliance pages** — this is personal tax, not business tax. Do not simply copy the Tax Compliance for Businesses template and swap "business" for "individual."

**Build instruction:** Structurally it can reuse the same *component types* (hero, trust strip, compliance calendar, documents checklist, FAQ, disclaimer) but content and tone need a personal framing:
- "Who This Is For" personas: individual professionals/employees needing personal tax filing support, not business owners
- The "catching up" non-judgmental persona pattern from 6.4 likely applies here too, and may be even more important for personal tax anxiety
- Cross-link should point back to Tax Compliance for Businesses for anyone who's actually asking on behalf of a business, to avoid visitors landing on the wrong page
- Mark all specific content `[PENDING: needs its own design pass + real content]` until Titi designs it — do not silently reuse Cameroon business copy structure without flagging this

---

### 6.7 CNPS Compliance for Businesses — Cameroon (NOT yet designed — build structurally now)

**Status:** Not yet designed by Titi. Same category as 6.4 (Tax Compliance for Businesses) — an ongoing/recurring obligation, social insurance rather than tax.

**Build instruction:** Use the same recurring-obligation template shape as 6.4 (compliance calendar, not a one-time step-path). Content-wise:
- What We Handle should include an explicit line distinguishing this from Tax Compliance ("Tax obligations are handled on their own page →")
- "What Comes Next" / sequencing: this is typically the last step after Formalisation → Tax Compliance → CNPS — its own cross-link should acknowledge it's the final piece, not point forward to another compliance page
- Mark specific contribution rates, deadlines, and figures `[PENDING]` until real data is supplied

---

### 6.8 IT Consulting & Outsourcing — Template A (Advisory/Menu)

**Status:** Already designed and coded (`code.html` exists). Reference only — do not rebuild, but confirm with the team whether this page proceeds to launch or holds, per the leadership re-prioritization noted in `CLAUDE.md`.

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
| Tax Compliance for Businesses — Cameroon | Yes, fully | Real calendar/penalty data (`[PENDING]`) |
| Business Formalisation — US | Yes, structurally | Confirmed US-expertise backing + personas |
| Tax Compliance for Individuals | Yes, structurally, but flag it clearly as placeholder | Full design pass from Titi + real content |
| CNPS Compliance | Yes, structurally | Real contribution/deadline data (`[PENDING]`) |
| IT Consulting & Outsourcing | Already built | Team confirmation on whether it proceeds |

---

## 8. SEO Requirements Per Page

This is Randy's domain (SEO owner), but Precious needs to build the structure that makes it possible — SEO can't be bolted on after the fact.

- **Every page needs a unique `<title>` and meta description** — do not let Next.js fall back to a generic site-wide default. Use `generateMetadata` per route.
- **Canonical URLs** on every page, especially the 5 compliance sub-pages, to avoid any duplicate-content ambiguity between them
- **Service schema markup (Schema.org `Service` type)** on every service page — this was already committed to as a standout feature earlier in the project (structured data for local/service search visibility). Include: service name, description, provider (Uptech Consulting), areaServed (Cameroon/US as applicable)
- **Open Graph tags** per page (title, description, image) — this affects how links look when shared on WhatsApp/LinkedIn, which matters given how much of Uptech's real client communication happens over WhatsApp
- **Internal linking strategy needs Randy's sign-off, not just Precious's judgment.** The entire reason the 5 compliance pages were split apart instead of staying one page is SEO — each targeting its own high-intent search term. The cross-linking this document specifies (What Comes Next, Also Managing Your Personal Taxes, hub router) is good UX, but heavy-handed or generic anchor text between them could work against the exact SEO goal that justified splitting them in the first place. **Before shipping the cross-link components, confirm anchor text and linking density with Randy.**

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
