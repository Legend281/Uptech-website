-- Uptech Consulting admin dashboard — Leads & Inquiries table.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- before the Contact form or any other lead-generating form will work.
--
-- Mirrors lib/admin/types.ts's Lead type. department/status/type/source
-- CHECK constraints match that file's unions exactly — if you ever add a
-- new service, status, etc. there, update the matching constraint here too.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service text not null,
  type text not null check (type in ('job-seeker', 'business', 'general')),
  -- Null on purpose for an ambiguous inquiry — see Admin_Dashboard_Requirements.md
  -- Section 3.11. Always paired with status = 'needs-triage' when null.
  department text check (department in ('career-services-operations', 'business-formalisation-compliance')),
  status text not null default 'new' check (
    status in ('needs-triage', 'new', 'contacted', 'qualified', 'consultation-booked', 'won', 'lost')
  ),
  source text not null check (
    source in ('contact-form', 'referral', 'whatsapp', 'website', 'manual-phone', 'manual-email', 'manual-other')
  ),
  language text not null check (language in ('English', 'French')),
  message text not null,
  assigned_to_id text,
  -- When the Privacy Policy consent checkbox was ticked — proof of consent
  -- at submission. Null for a manually-logged lead (Phase A), which never
  -- had a checkbox to tick.
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  -- Two independent staleness clocks (see the "two-clock" discussion):
  -- first_contacted_at measures response-lag against the public 1-business-
  -- day commitment; status_changed_at measures stage-aging (how long a
  -- lead has sat in its current status with no movement). Columns added
  -- now, while the table is fresh, so this doesn't need a later migration
  -- — the logic that populates/surfaces them is separate, not-yet-built
  -- (Phase D) work.
  first_contacted_at timestamptz,
  status_changed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at honest on every row change.
create or replace function public.set_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_leads_updated_at();

-- Row Level Security: the public anon key (used by the Contact form's API
-- route) may only INSERT — never read, update, or delete. There is
-- deliberately no SELECT policy for `anon` yet, since the admin dashboard
-- has no real staff authentication wired up (that's CLAUDE.md Section 2 /
-- Admin_Dashboard_Requirements.md Section 2 — Supabase Auth + roles — a
-- separate, larger, not-yet-requested piece of work). Granting public read
-- here would expose every lead's name, email, phone, and message to
-- anyone with the anon key, which is publishable by design. Don't add a
-- public SELECT policy without real auth in front of it.
alter table public.leads enable row level security;

drop policy if exists "Public can submit leads" on public.leads;
create policy "Public can submit leads"
  on public.leads
  for insert
  to anon
  with check (true);
