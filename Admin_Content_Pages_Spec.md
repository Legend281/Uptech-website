# Admin Panel — Content Management Pages Spec
### Testimonials · Team Members · FAQ Items · Settings

This spec refines the Testimonials plan already proposed, and extends the same
rigor to Team Members, FAQ Items, and Settings. All four should reuse the
patterns already established in the Leads module: `RegisterList` for list
views, a `LeadFormDialog`-style dialog for create/edit, a `LeadsProvider`-style
context per module, Supabase migrations with row-level security and the
existing `updated_at` trigger, and the Activity feed for audit logging.

---

## 0. Standing rules (apply to all three content modules)

These aren't per-module choices — they're cross-cutting standards, carried
over from the existing "no invented quotes" rule in CLAUDE.md and extended to
match:

1. **No AI-authored public content.** No AI-generated testimonials, team bios,
   or FAQ answers. Staff write it; the admin panel stores and publishes it. If
   an AI drafting assist is ever added later, drafts must be clearly marked
   "AI-suggested — unreviewed" and cannot be published from that state.
2. **Every publish, unpublish, and permission change is logged** to the
   existing Activity feed — same pattern as Leads status changes.
3. **Row-level security enforces role scope in the database**, not just in
   hidden UI buttons. Department Editors should not be able to publish
   another department's content even by calling the API directly.
4. **Active-services-only tagging.** Any field that tags content to a service
   (Testimonials' service field, FAQ's category) must pull from the current
   active service list, not a hardcoded enum — so a paused service (e.g. IT
   Consulting) automatically stops appearing as an option without a code
   change.

---

## 1. Testimonials

*(Refining the plan already proposed — structure kept, open questions below
converted into recommended defaults so build isn't blocked waiting on
leadership sign-off.)*

### 1.1 Data model

**Public fields**
- Quote (English, required) and Quote (French, optional — flagged if it's a
  translation rather than the client's own French wording)
- Attribution mode: `full_name` | `first_name_initial` | `anonymised`
  (only the fields that mode needs are shown/required)
- Role/title, company (optional), location/audience tag (Cameroon / US /
  Diaspora)
- Photo (optional, Supabase Storage, resized on upload)
- Outcome line (optional) — e.g. "Placed within 8 weeks"

**Internal-only fields**
- Service tag (active services only — sets department)
- Original wording as given by the client (unedited, kept even if the public
  quote is lightly cleaned up for typos)
- Consent: given (bool), date, channel, recorded-by
- Linked Lead record (optional — typically a "Won" lead)
- Status: Draft | Published | Archived

### 1.2 Recommended defaults (build on these; confirm/override later)

| Open question | Default |
|---|---|
| What counts as valid consent? | A WhatsApp/email "yes" is sufficient and should be logged (date, channel, who recorded it). Require a signed form only if the testimonial is (a) placed on the Homepage, or (b) includes an outcome line. |
| Are anonymised testimonials allowed? | Yes — but anonymised and first-name-only entries are restricted to service pages, not the Homepage. Homepage placement requires a full name. |
| Are outcome lines allowed? | Yes, but only if the testimonial has a linked Lead record — the outcome line must be checkable against that lead's own timeline, not a free-floating claim. |
| Who can publish to the Homepage? | Administrators only. Department Editors can publish to their own service pages. |

### 1.3 Guardrails

| Check | Behaviour |
|---|---|
| No consent recorded | Hard block on publish (privacy/legal, not editorial) |
| Consent withdrawn | One action unpublishes everywhere + offers to delete the photo |
| Outcome line present, no linked lead | Hard block on publish (see default above) |
| Quote mentions "UCO" or a competitor | Warn only — it's the client's own words |
| Quote exceeds card length | Soft limit, live character counter |
| French quote missing | Completeness indicator only, not a block |

### 1.4 Layout

- **List:** `RegisterList` pattern, filters for status / service / page /
  consent. Each row shows quote preview, display name, status, page
  placement chips, consent indicator.
- **Create/edit:** dialog with four sections in this order — **Quote →
  Attribution → Consent → Placement**. Consent must come before Placement so
  it can't be skipped.
- **Preview:** renders inside the actual public testimonial card component
  (pull this out as a shared component used by both the public site and
  admin, if not already separate).
- **Empty state:** "No testimonials yet. When a placed client or finished
  engagement agrees to share their story, log it here." — include a shortcut
  from Won leads.

### 1.5 Build order

1. Supabase migration (`002_testimonials.sql`) — table + page-placement join
   table, RLS, `updated_at` trigger
2. Admin list + create/edit dialog + consent/publish rules, backed by a
   `TestimonialsProvider`
3. Placements + preview, including extracting the shared public card
   component
4. Public site: replace the hardcoded placeholder with published
   testimonials, falling back to the current placeholder when none exist for
   a page

---

## 2. Team Members

Public "Who We Are" roster. **Distinct from admin login accounts**, which
belong in Settings §4.2 below.

### 2.1 Data model

- Name, title, department (Career Services / Compliance / Leadership / Ops)
- Entity (Cameroon / US) — dual-entity company, staff should be tagged
- Photo (Supabase Storage, resized on upload — same pattern as Testimonials)
- Short bio
- Optional LinkedIn/social link
- Display order
- Status: Visible | Hidden (not deleted — see 2.3)

### 2.2 Layout

- **List:** grid view (photo-forward), not a table — reuse `RegisterList` in
  its grid variant if that exists, otherwise a simple card grid with the same
  filter/search bar treatment as Leads.
- **Create/edit:** same dialog pattern as Testimonials, sections: **Identity
  → Bio → Placement/Visibility**.
- **Preview:** renders in the real public team-card component (extract as a
  shared component, same as Testimonials).

### 2.3 Guardrails

| Check | Behaviour |
|---|---|
| Staff member departs | Set to Hidden, don't hard-delete — case studies or other pages may reference them by name/photo |
| Photo missing | Allowed to save as Draft/Hidden, but warn before setting to Visible |
| Two people with the same name | Allowed — this only matters for internal admin search, not the public site; disambiguate in the list view with department/entity shown alongside the name |

**Permissions:** Adding/editing/removing team members touches real people's
personal data and images — treat this at the same sensitivity level as
Testimonials consent. Recommend only Administrators or a designated
People/HR-scoped Editor role can manage this module (not general department
Editors).

### 2.4 Build order

Same three-step pattern as Testimonials: migration → admin list/edit →
public page wiring.

---

## 3. FAQ Items

Feeds both a general FAQ section and per-service FAQ blocks on the four
service pages (Career Marketing, Business Formalisation, Tax Compliance,
CNPS Compliance) plus General Contracts & Supplies.

### 3.1 Data model

- Question
- Answer (rich text — needs to support formatting and links, since
  compliance answers may reference forms, deadlines, or external filing
  portals)
- Category/service tag (active services only, plus a "General" category for
  site-wide FAQs)
- Display order within category
- Status: Draft | Published
- **Legal review flag** (bool) — see 3.2

### 3.2 Guardrails — this is the one place this spec adds something new

Compliance-related FAQ content (Tax Compliance, CNPS Compliance) is a direct
legal-liability risk if wrong — this has already been flagged as a recurring
blind spot for this project. Treat it accordingly:

| Check | Behaviour |
|---|---|
| Category = Tax Compliance or CNPS Compliance | Cannot be set to Published until a second person (any Administrator, or a different Editor than the author) marks it "Reviewed." Author cannot self-approve. |
| Category = Career Marketing, Business Formalisation (general), General Contracts, or General | Standard single-author publish, no second review required |
| Answer edited after being marked Reviewed | Reviewed flag clears automatically — must be re-reviewed before staying Published |

### 3.3 Layout

- **List:** grouped by category with expand/collapse, or a category filter
  dropdown at the top — same search bar and status filters as Leads.
- **Create/edit:** simpler dialog than Testimonials/Team Members —
  **Question → Answer → Category/Order**, plus the Reviewed checkbox
  (visible only to eligible reviewers, per 3.2).
- **Reorder:** drag-and-drop within a category; moving an item to a different
  category should prompt confirmation since it changes which page it appears
  on.

### 3.4 Build order

1. Migration (`004_faq_items.sql`) — table with category, order, review
   status, RLS
2. Admin list + create/edit + review-gate logic
3. Public site wiring per service page + general FAQ page

---

## 4. Settings

This page is different in kind from the other three — it's system
configuration, not public content — and it's the highest-risk of the four to
get wrong, since mistakes here (a bad permission grant, a broken assignment
rule) affect the whole system rather than one piece of content. **Build this
one last, and review it more carefully than the others.**

### 4.1 Auto-assignment rules

Configuration surface for the routing logic already defined for the
Dashboard/Leads module:

- Department pools and which staff belong to each
- Round-robin vs. manual toggle, per department
- Escalation time windows (e.g. 24h for new leads, configurable per
  compliance type for review-deadline escalation)
- On/off switch per department, in case a team wants to revert to fully
  manual triage temporarily

### 4.2 Admin user accounts & roles

Distinct from Team Members (§2) — this is about who can log into the admin
panel and what they can touch, not public bios. Roles should match what's
already implied by the existing Activity feed (e.g. a Viewer role has
already been used):

- **Administrator** — full access, only role that can publish Homepage
  testimonials, edit auto-assignment rules, and manage other users' roles
- **Editor (department-scoped)** — manage leads/content for their own
  department only, enforced via RLS
- **Viewer** — read-only access

All role changes are logged to the Activity feed (per the standing rule in
§0.2).

### 4.3 Notification preferences

Email / in-app toggles per user, tied directly to the "Send reminder" and
"Escalate" actions already built into the Dashboard.

### 4.4 Compliance review cycle defaults

Configurable default cycle lengths per compliance type (e.g. 180 days for
CNPS) — this is what drives the "days until due" countdown on the Dashboard.
Keep this configurable here rather than hardcoded, so cycle-length changes
don't require a code deploy.

### 4.5 General / branding

Company info, entity details (Cameroon/US), logo/favicon if the admin panel
is ever white-labeled or shared with another team.

---

## 5. Overall build order across all four pages

1. **Testimonials** (already scoped in detail above — proceed with defaults
   in §1.2 rather than waiting on every open question)
2. **Team Members** (same pattern, lower complexity, no legal-review gate)
3. **FAQ Items** (same pattern, plus the compliance-content review gate)
4. **Settings** (last, extra care — touches permissions and system-wide
   rules rather than a single content record)
