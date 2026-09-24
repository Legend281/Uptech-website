# Uptech Consulting — Admin Dashboard: Full Requirements Specification

**Purpose:** This is the complete build spec for the custom admin dashboard — the internal tool Uptech Consulting staff use to manage every editable part of the public website without needing a developer. Read this alongside `CLAUDE.md` before building. This dashboard is custom-built (Sanity was evaluated and explicitly rejected earlier in this project) — do not introduce a third-party CMS.

The dashboard's job: turn everything currently hardcoded in the codebase (service status flags, contact info, compliance disclaimers, `[PENDING]` content markers) into something a non-technical staff member can see, understand, and update safely — without needing to ask a developer or risk publishing something inaccurate.

---

## 1. Who Uses This, and Why It Matters

Two real departments use this dashboard day to day, per the site's actual structure:
- **Career Services Operations** — owns Career Marketing & Placement content, Careers page job postings, related leads
- **Business Formalisation & Compliance** — owns the compliance hub and its sub-pages, including the highest-liability content on the entire site

A third group — **Management** — needs oversight across everything (per the confirmed answer that Management reviews compliance content and Privacy Policy/Terms). The dashboard's role structure must reflect these three real groups, not a generic one-size-fits-all editor role.

---

## 2. Roles & Permissions

| Role | Can do | Cannot do |
|---|---|---|
| **Administrator** | Full access: all content, all settings, user management, publish anything, view all leads, access audit log | — |
| **Editor** | Edit and publish content within their assigned department (Career Services Operations OR Business Formalisation & Compliance) | Cannot touch site-wide Settings, cannot manage other departments' content, cannot manage users |
| **Viewer** | Read-only access to content and leads within their assigned department | Cannot edit or publish anything |

**Department scoping is required, not optional** — an Editor assigned to Career Services Operations should not be able to edit CNPS Compliance content, and vice versa. This directly reduces the risk of someone without compliance expertise accidentally editing regulatory content they don't understand.

**Management** users should be set up as Administrators, or a dedicated **Reviewer** role with read access everywhere plus the specific ability to mark compliance content as "reviewed" (see Section 5) without full edit rights — confirm with the team which model fits better before building; default to Administrator if no answer comes back, since that's the safer default.

Every login requires authentication via Supabase Auth. Enforce strong passwords. Enable 2FA wherever Supabase supports it, per `CLAUDE.md` Section 7's existing security requirements.

---

## 3. Content Model — Every Editable Content Type

Each content type below needs full CRUD (Create, Read, Update, Delete) support in the dashboard, with plain-language labels — never raw technical field names like `heroTitleEn` shown to a staff member. Use labels like "Homepage Headline (English)."

### 3.1 Site Settings (Administrator only)
The single source of truth for information currently hardcoded across the site — editable in one place, not scattered across code:
- Official contact email
- WhatsApp number
- "Talk to us" phone number(s), if different from WhatsApp
- Both office addresses (Buea, Cameroon / Stafford, Texas)
- Social media links (LinkedIn, Facebook, TikTok, X)
- Official company name display string (should always resolve to "Uptech Consulting" per `CLAUDE.md` — this field exists so it's never re-typed inconsistently across pages again)

This directly solves the exact problem that caused the WhatsApp-number and email confusion earlier in this project — one editable field, referenced everywhere, instead of copy-pasted into dozens of places.

### 3.2 Service Visibility & Status (Administrator only — HIGH PRIORITY)
This is the dashboard's most important structural feature. Every service pillar's display status must be an editable field here, not a hardcoded value in code:

| Service | Status field (editable) |
|---|---|
| Career Marketing & Placement | active / paused / hidden |
| Business Formalisation & Compliance (and its 4 sub-pages individually) | active / paused / hidden, each with its own status |
| IT Consulting & Outsourcing | active / paused / hidden |
| Recruitment & BPO | active / paused / hidden |
| General Contracts & Supplies | active / paused / hidden |

Changing a status here should automatically update: the Services hub page, the main nav dropdown, the footer's Services column, the Who We Are "What We Do" section, the Who We Serve pages, and the Careers page department grid — everywhere this pillar is referenced sitewide. This is what makes it possible for leadership's future "structure session" decision (on IT Consulting, Recruitment & BPO, General Contracts & Supplies) to be applied in minutes, not by re-prompting a developer across a dozen files again.

Also include a **visual weight** setting (normal / de-emphasized) for the Careers page specifically, since paused services still need to appear there but visually muted, per the confirmed team decision.

### 3.3 Homepage Content
- Hero headline, subheadline, split-hero left/right copy (EN + FR fields, see Section 6)
- Trust strip facts/badges (editable list)
- "Meet Your Dedicated Person" section copy
- Services grid — pulls automatically from Section 3.2's active services, not manually re-entered
- "Do the Math" comparator default values (if applicable)
- Real Results / testimonial assignment (pulls from Section 3.9)
- FAQ items (pulls from Section 3.10, scoped to homepage)

### 3.4 Service Pages — by Template Type
Since the site uses three distinct templates (Advisory/Menu, Campaign/Sequence, Regulatory/Procedure — see `CLAUDE.md` Section 4), the dashboard's edit forms must differ per template, not use one generic "page content" blob:

**Template A (Advisory/Menu — IT Consulting & Outsourcing):** editable list of service cards (title, description, tags), trust strip badges, persona cards, engagement-rhythm steps, FAQ items

**Template B (Campaign/Sequence — Career Marketing & Placement):** hero copy, trust strip, the linear campaign steps (editable ordered list), persona cards, testimonial assignment, FAQ items

**Template C (Regulatory/Procedure — the 4 Business Formalisation & Compliance pages):** see Section 5 below — these need special handling beyond a normal content type, given their legal/compliance nature.

### 3.5 Who We Are Page
- Philosophy section copy
- Core Values (4 values, each with name + definition + "in practice" real example — editable per value)
- "What We Do" pillar list (pulls from Section 3.2, with paused pillars shown honestly per the page's completeness requirement)
- Team Members — **this is currently an empty/pending state on the live site.** Build this as a real content type (name, role, photo, short bio) so that the moment real team data arrives, someone adds entries here and the page automatically switches from its "coming soon" state to a populated grid, with zero developer involvement.
- Mission & Vision (closing section copy)

### 3.6 Who We Serve Pages (Individuals / Businesses & Institutions)
- Hero copy per audience
- Selectable service cards (title, description, tag — e.g. "IT & TECH ROLES ONLY" style tags, if reintroduced)
- Persona/track cards (Track A/B/C style content)
- FAQ items per page

### 3.7 Careers Page
- Department grid (pulls active/paused status from Section 3.2)
- **Job Postings** — full CRUD: title, description, requirements, how-to-apply link/instructions, open/closed status, date posted. When zero postings are open, the page must show the existing honest "No open positions right now" state automatically — never a broken empty page.
- "Send Us Your CV" submission routing (see Section 3.11 — Leads)
- FAQ items

### 3.8 Contact Page
- Office info (pulls from Site Settings)
- Response-time commitment text
- Form routing configuration: which inbox/recipient receives job-seeker inquiries vs. business inquiries (this was flagged as a pending decision earlier in the project — once resolved, it should be dashboard-configurable, not hardcoded)

### 3.9 Testimonials / Real Results (shared, reusable across pages)
- Quote, author name, title/company (or anonymized), associated service (Career Marketing, a specific compliance page, etc.), photo (optional)
- Draft/Published status (see Section 7) — so a testimonial can be entered and held back until approved
- Assignable to multiple pages (e.g., a strong testimonial can appear on both the Homepage and Career Marketing & Placement)

### 3.10 FAQ Items (shared, scoped by page)
- Question, answer (EN + FR), associated page, display order
- Reorderable within each page's FAQ list

### 3.11 Leads & Inquiries — Full Specification

**Current real-world state, confirmed against the live codebase (do not assume otherwise):** the public Contact form is currently `mailto:`-only — it does not write to any backend, and every "lead" seen anywhere until this is fixed is either manually entered or mock data. This section covers both the module itself and the integration work needed to make it real.

**View: list, not board.** A Kanban-style board was considered and deliberately rejected — this site's mobile-performance requirement for Cameroon-based visitors and staff applies to the dashboard too, and board layouts degrade badly on narrow screens. Use a clean, filterable list.

**Manual lead entry is a first-class, priority-one feature — not an afterthought.** Until the Contact form (and any other lead-generating form) is properly wired to write here automatically, every real lead arriving by phone call, WhatsApp message, or a direct email will only exist in this system if a staff member logs it by hand. Build a "Log a New Lead" action prominently, before anything else in this module — a Leads module with no manual-entry path is non-functional in the site's actual current state, not a smaller version of the feature.

**Wiring the real forms is part of this task, not a separate one.** The Contact form's `mailto:` pre-fill needs to be replaced with an actual submission to Supabase, creating a real Lead record (in addition to, or instead of, the current email-based flow — confirm with the team which they want, but default to "write to Supabase AND still send the email notification via Resend," so nothing is lost during the transition). The same applies to CV submissions and any checklist/lead-magnet downloads elsewhere on the site.

**Data model — the Lead record must include (fix the current type if it's missing any of these):**
- Name
- Email
- Phone
- Company (if applicable)
- Service/department the inquiry relates to
- **Preferred language** (the form already captures this — it must reach the Lead record, not be dropped)
- The full inquiry message, in full — not truncated in the list view's row, only in the detail view
- Source (which form/page it came from)
- Type (job-seeker / business / general)
- **Status**, including a distinct **"Needs Triage"** state — do NOT silently auto-assign an ambiguous inquiry (e.g., a generic "General inquiry" selection) to a department by default logic alone; give it its own visible pending-triage state instead, so it can't quietly sit in the wrong queue unexamined
- Assigned owner (see below)
- Timestamp
- **Consent checkbox timestamp** — proof the Privacy Policy consent was given at submission, required given this project's legal/compliance requirements

**Detail view (does not currently exist — build it):** a full page or panel per lead, not just a row. Contact info must be actionable, not just displayed: `mailto:` link, `tel:` link, and a WhatsApp click-to-chat link — WhatsApp is "core infrastructure, not decorative" per this project's own standing rule, so a phone number here should be one tap to a WhatsApp conversation, not inert text. The full message is shown in full.

**Department scoping:** an Editor's Leads view defaults to showing only leads belonging to their own department (Career Services Operations sees Career Marketing leads; Business Formalisation & Compliance sees theirs) — this simply applies the same access boundary already required for content editing (Section 2) to leads, for consistency. Administrators see everything, with department available as a filter, not a hard boundary.

**Ownership: "Claim This Lead" is a first-class, visible action — not a quiet dropdown field.** This connects directly to Uptech Consulting's own stated positioning: Career Marketing & Placement's real differentiator is "we dedicate a full-time worker to your account." A lead sitting unassigned in a dropdown contradicts that promise operationally. Claiming a lead should be a deliberate, visible act. Administrators can still manually reassign a lead away from its current owner if needed.

**Staleness signal:** a lead untouched past the site's public response-time commitment should be visibly flagged, the same way an overdue compliance-page review is flagged (Section 5). **This commitment is confirmed, not provisional** — "We respond within one business day" was finalized directly by management earlier in this project. If a code comment anywhere still describes this figure as unconfirmed, that comment is stale and should be corrected — the number itself is locked and safe to build the staleness threshold around with confidence.

**Language-aware assignment (new requirement — add a "Languages Spoken" field to internal dashboard user accounts, Section 2's role system; this is separate from the public-facing Team Members content in Section 3.5, which is a different thing — display content for the Who We Are page, not staff account data):** when a lead's preferred language is French, the dashboard should flag it if the currently assigned/claiming staff member's account doesn't list French among their languages — a visible warning, not a hard block. This is a concrete example of the "intelligence" defined in Section 6: surfacing a real mismatch, not generating anything.

### 3.12 Privacy Policy & Terms of Service
- Editable rich-text content for both
- A **Legal Review Status** field: Draft / Under Review / Approved, with reviewer name and approval date — since the confirmed answer states the CEO, Head of Operations, and HR must review these before they're treated as final. The dashboard should visibly show "NOT YET LEGALLY APPROVED" if the status isn't "Approved," so nobody mistakes draft content for a finished policy.

---

## 4. Bilingual (EN/FR) Field Architecture

Per `CLAUDE.md`, English and French are both official languages, and the site must be built French-ready even though French ships in phase 2. Every text field in every content type above must be structured as a pair (English value, French value), with French allowed to stay empty for now.

**Dashboard-specific requirement:** show a simple completion indicator per page/content item — e.g., "English: Complete · French: 0% complete" — so staff can see at a glance what's ready for the French rollout without hunting field by field. Do not build a full translation workflow (e.g., translation memory, side-by-side diff editors) for v1 — that's explicitly out of scope (see Section 12).

---

## 5. Compliance Content — Special Handling (Template C pages)

This is the highest-liability content on the site, and the dashboard needs to treat it differently from ordinary marketing copy:

- **"Last Reviewed" date field** — a real, dashboard-editable date per compliance page (Business Formalisation Cameroon, Business Formalisation US, Tax Compliance, CNPS Compliance), replacing the currently hardcoded placeholder strings identified in the last codebase audit. Updating this date should be a deliberate, one-click action ("Mark as reviewed today"), not a manual date-picker buried in a big form.
- **Staleness alert (see Section 8):** if a compliance page's "Last Reviewed" date is older than a configurable threshold (default: 6 months), the dashboard should visibly flag it on the main dashboard view — e.g., a warning badge next to that page's name in the content list.
- **Reviewer attribution field** — replaces the previously flagged "Uptech Consulting Legal & Corporate Administration Desk" placeholder. Per the confirmed answer, this should default to "Uptech Consulting Management," but the field should be editable per page in case a different department reviews a specific page in the future.
- **`[PENDING]`-style field tracking:** for any compliance fact currently written as hedged/general copy (per the recent rewrite pass — DPAE frequency, Casier Judiciaire window, formation timelines, penalty percentages, etc.), the dashboard should show these as a distinct "Needs Real Data" list, separate from ordinary content editing, so whoever eventually gets the real answer can find and update these fields in one place rather than hunting through full-page content forms.

---

## 6. Dashboard "Intelligence" — What This Actually Means

To be concrete and prevent scope drift toward something risky: "intelligent" in this dashboard means **surfacing what needs attention and preventing mistakes** — not generating content automatically. Do NOT build any feature that writes page copy, compliance facts, or testimonials using AI/generative text — that would reintroduce the exact fabrication risk this entire project has worked to eliminate. The following are in scope:

1. **Staleness alerts** — compliance pages overdue for review (Section 5), flagged visibly on login/dashboard home
2. **Completeness indicators** — per page, show what's missing: empty required fields, French translation gaps (Section 4), unresolved "Needs Real Data" items (Section 5)
3. **A real Leads overview** — count of new/unread leads by department, simple trend (leads this week vs. last week), no invented metrics
4. **Publish-safety checks** — warn (don't block) before publishing a compliance page if its "Last Reviewed" date wasn't updated in this same editing session, and before publishing any page containing an unresolved "Needs Real Data" field
5. **Audit log** — who changed what, and when, across all content (see Section 9) — this is "intelligent" in the sense of accountability and traceability, especially important given the compliance-content risk already established

---

## 7. Editorial Workflow

- **Draft → Publish** — changes save as drafts and don't go live until explicitly published. This prevents half-finished edits from appearing on the public site.
- **Preview** — before publishing, a staff member should be able to see how the change will actually look on the real page layout, not just raw form fields.
- This applies to all content types, but matters most for Testimonials (Section 3.9) and compliance content (Section 5), where an unreviewed change going live carries real reputational or legal risk.

---

## 8. Media & Asset Management

Since there's no third-party CMS providing this automatically (unlike the rejected Sanity option), build a real image pipeline:
- Image upload via Supabase Storage
- Automatic resizing/optimization on upload (use Next.js Image component conventions + the `sharp` library server-side, consistent with `CLAUDE.md`'s existing recommendation)
- This directly serves the site's mobile/low-bandwidth performance requirement for Cameroon-based visitors — a staff member uploading a large photo shouldn't be able to accidentally slow down a live page.

---

## 9. Security & Audit Requirements

Carried over and made concrete from `CLAUDE.md` Section 7:
- Supabase Auth for all dashboard logins, no separate auth system
- Role-based access strictly enforced server-side (not just hidden UI — a Career Services Editor must be blocked at the API level from writing to compliance content, not just prevented from seeing the button)
- 2FA enabled wherever Supabase supports it
- **Audit log:** every content change records who made it, what changed, and when. This is a genuine requirement, not a nice-to-have, given how much of this project's effort has gone into ensuring compliance content is accurate — if something goes wrong, the team needs to know who changed what and when.
- Session timeout after a reasonable period of inactivity
- All dashboard routes protected — no dashboard page should be reachable without authentication, including via direct URL

---

## 10. Backups

No vendor (like Sanity) is providing this automatically anymore, since the dashboard is custom-built on Supabase. This needs an explicit, active plan:
- Enable Supabase's built-in backup features
- Additionally, recommend a periodic manual/automated export of critical content (compliance page content especially) as a second safety net — relying on one vendor's backup alone was already flagged as a risk earlier in this project.

---

## 11. Branding & UX Requirements

The dashboard should look and feel like "Uptech Consulting's own tool," not a generic admin panel:
- Uptech Consulting logo (the real supplied asset, never a placeholder) and brand colors in the dashboard's own chrome/theme
- Menu organized by plain-language names matching how staff actually think about the site ("Career Marketing Page," "Team Members," "Job Postings") — never raw database/technical field names
- Icons per content type for quick visual scanning (use `lucide-react`, consistent with the rest of the codebase's icon convention)
- Fully usable on desktop; reasonable to view on tablet/mobile for quick checks, but full content editing is not required to be mobile-optimized for v1

---

## 12. Explicitly Out of Scope for Version 1

Naming these directly so they're deferred deliberately, not silently forgotten:
- Multi-step approval/publishing chains beyond simple Draft → Publish
- A full translation-management workflow (side-by-side diff editors, translation memory) — v1 just needs the EN/FR field pairs and a completion indicator
- Any AI-assisted or auto-generated content writing
- Real-time multi-user collaborative editing (e.g., Google-Docs-style simultaneous editing)
- A public-facing client login portal (this was already identified much earlier in the project as a strong phase-2 pitch, separate from the admin dashboard entirely)
- Automated social media posting or external marketing tool integrations

---

## 13. Build Priority Order

1. Authentication, roles, and department scoping (Section 2) — nothing else is safe to build without this
2. Site Settings + Service Visibility & Status (Sections 3.1, 3.2) — highest leverage, fixes the exact problems already encountered in this project (contact info drift, hardcoded pause/active states)
3. Leads & Inquiries (Section 3.11) — build manual "Log a New Lead" entry FIRST within this phase (the site's forms don't write anywhere real yet, so this is currently the only way any real lead gets captured), then wire the Contact form and other lead-generating forms to actually submit to Supabase, then build the list view, detail view, claiming, and staleness flagging
4. Compliance content special handling (Section 5) — highest-risk content, needs its safeguards early
5. Remaining content types (Sections 3.3–3.10)
6. Dashboard intelligence features (Section 6)
7. Bilingual completeness tracking, media pipeline, audit log, backups (Sections 4, 8, 9, 10)

Confirm with the team before building Section 2's Reviewer-role question (Administrator vs. a dedicated Reviewer role for Management) — default to Administrator if no answer arrives in time, since that's the safer, more permissive-but-accountable default given the audit log requirement in Section 9.
