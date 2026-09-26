-- Uptech Consulting admin dashboard — Testimonials.
-- Run once in the Supabase SQL editor, after 001_leads_table.sql (the
-- lead_id foreign key below points at public.leads).
--
-- Mirrors lib/admin/types.ts's Testimonial type and the rules in
-- lib/admin/testimonials.ts. Spec: Admin_Content_Pages_Spec.md Section 1.
--
-- Two tables: the testimonial itself, and a join table recording which
-- public pages it's placed on (one testimonial can appear on several pages,
-- each with its own display order — Admin_Dashboard_Requirements.md 3.9).

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),

  -- Public content ---------------------------------------------------------
  quote_en text not null,
  quote_fr text,
  -- True when the French text is Uptech Consulting's translation rather
  -- than the client's own French wording — a translation must never be
  -- presented as the client's own words.
  quote_fr_is_translation boolean not null default true,
  outcome_line text,

  attribution_mode text not null check (attribution_mode in ('full_name', 'first_name_initial', 'anonymised')),
  full_name text,
  first_name text,
  last_initial text check (last_initial is null or char_length(last_initial) = 1),
  anonymised_descriptor text,
  role_title text,
  company text,
  audience text check (audience in ('cameroon', 'us', 'diaspora')),
  -- Path inside the testimonial-photos storage bucket, never a full URL.
  photo_path text,

  -- Internal only — never exposed through published_testimonials ---------
  -- No CHECK list on service on purpose (spec Section 0.4): the valid set
  -- is the current active-service list, which changes without a migration.
  service text not null,
  department text not null check (department in ('career-services-operations', 'business-formalisation-compliance')),
  original_wording text not null,
  consent_given boolean not null default false,
  consent_date date,
  consent_channel text check (consent_channel in ('whatsapp', 'email', 'signed-form')),
  consent_recorded_by text,
  consent_withdrawn_at timestamptz,
  lead_id uuid references public.leads (id) on delete set null,

  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Each attribution mode carries exactly the fields it needs. Fields a
  -- mode doesn't use must be empty, so switching an entry to "anonymised"
  -- can't leave a real name sitting in the row.
  constraint testimonials_attribution_fields check (
    case attribution_mode
      when 'full_name' then
        full_name is not null and first_name is null and last_initial is null and anonymised_descriptor is null
      when 'first_name_initial' then
        first_name is not null and last_initial is not null and full_name is null
        and anonymised_descriptor is null and company is null and photo_path is null
      when 'anonymised' then
        anonymised_descriptor is not null and full_name is null and first_name is null
        and last_initial is null and company is null and photo_path is null
    end
  ),

  -- Hard block (spec 1.3): nothing publishes without recorded, un-withdrawn consent.
  constraint testimonials_publish_requires_consent check (
    status <> 'published'
    or (consent_given and consent_date is not null and consent_channel is not null and consent_withdrawn_at is null)
  ),

  -- Hard block (spec 1.2/1.3): an outcome line is a factual claim — it
  -- must be checkable against a linked lead, and needs a signed form.
  constraint testimonials_outcome_requires_lead check (
    status <> 'published' or outcome_line is null
    or (lead_id is not null and consent_channel = 'signed-form')
  )
);

create table if not exists public.testimonial_placements (
  testimonial_id uuid not null references public.testimonials (id) on delete cascade,
  -- Pages with a real testimonial slot in the codebase. Unlike services,
  -- a slot only exists once code renders it, so a fixed list is correct
  -- here. Keep in sync with testimonialPages in lib/admin/testimonials.ts.
  page text not null check (page in ('homepage', 'career-marketing-placement')),
  display_order integer not null default 0,
  primary key (testimonial_id, page)
);

create index if not exists testimonial_placements_page_idx
  on public.testimonial_placements (page, display_order);

-- Keep updated_at honest, same as leads.
create or replace function public.set_testimonials_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_testimonials_updated_at();

-- Placement rules span both tables, so they can't be CHECKs: a published
-- testimonial placed on the Homepage must be fully named and backed by a
-- signed consent form (spec 1.2), and one placed on a service page must be
-- about that service. Deferred to commit so "add placement,
-- then publish" inside one transaction is judged on the final state.
create or replace function public.assert_testimonial_placement_rules()
returns trigger as $$
declare
  target uuid;
begin
  -- Separate branches, not one CASE: NEW only has the columns of the table
  -- that fired the trigger, and referencing the other table's column errors.
  if tg_table_name = 'testimonials' then
    target := new.id;
  else
    target := new.testimonial_id;
  end if;

  if exists (
    select 1
    from public.testimonials t
    join public.testimonial_placements p on p.testimonial_id = t.id
    where t.id = target
      and p.page = 'homepage'
      and t.status = 'published'
      and (t.attribution_mode <> 'full_name' or t.consent_channel is distinct from 'signed-form')
  ) then
    raise exception 'A published Homepage testimonial needs a full name and a signed consent form (testimonial %).', target;
  end if;

  -- A service page only shows testimonials about its own service.
  if exists (
    select 1
    from public.testimonials t
    join public.testimonial_placements p on p.testimonial_id = t.id
    where t.id = target
      and t.status = 'published'
      and p.page = 'career-marketing-placement'
      and t.service <> 'career-marketing'
  ) then
    raise exception 'The Career Marketing page only shows Career Marketing testimonials (testimonial %).', target;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists testimonials_placement_rules on public.testimonials;
create constraint trigger testimonials_placement_rules
  after insert or update on public.testimonials
  deferrable initially deferred
  for each row
  execute function public.assert_testimonial_placement_rules();

drop trigger if exists testimonial_placements_placement_rules on public.testimonial_placements;
create constraint trigger testimonial_placements_placement_rules
  after insert or update on public.testimonial_placements
  deferrable initially deferred
  for each row
  execute function public.assert_testimonial_placement_rules();

-- Row Level Security --------------------------------------------------------
-- Both base tables have RLS on and NO policies yet, which denies every
-- read and write to the anon and authenticated keys. Same reasoning as
-- 001_leads_table.sql: staff auth (Supabase Auth + a staff profile row
-- holding role + department) doesn't exist yet. When it lands, add
-- policies here that:
--   * let Administrators do anything;
--   * let Editors insert/update/delete only rows whose department matches
--     their own, and never touch a 'homepage' placement;
--   * let Viewers select rows in their own department only.
-- Until then the admin page keeps its data in the browser (see
-- components/admin/providers/TestimonialsProvider.tsx).
alter table public.testimonials enable row level security;
alter table public.testimonial_placements enable row level security;

revoke all on public.testimonials from anon, authenticated;
revoke all on public.testimonial_placements from anon, authenticated;

-- Public read path ----------------------------------------------------------
-- The public site reads ONLY this view. It exposes public columns only —
-- original wording, consent details, lead link, service and department
-- never leave the database. It runs with its owner's rights (not
-- security_invoker) on purpose, so anon can read published rows without
-- any policy on the base tables. Supabase's linter will flag this as a
-- "security definer view"; that's intended — the WHERE clause below is the
-- whole access rule, so review it carefully before changing it.
create or replace view public.published_testimonials as
select
  t.id,
  p.page,
  p.display_order,
  t.quote_en,
  t.quote_fr,
  t.quote_fr_is_translation,
  t.outcome_line,
  case t.attribution_mode
    when 'full_name' then t.full_name
    when 'first_name_initial' then t.first_name || ' ' || t.last_initial || '.'
    else t.anonymised_descriptor
  end as display_name,
  t.attribution_mode,
  case when t.attribution_mode = 'anonymised' then null else t.role_title end as role_title,
  case when t.attribution_mode = 'full_name' then t.company end as company,
  t.audience,
  case when t.attribution_mode = 'full_name' then t.photo_path end as photo_path
from public.testimonials t
join public.testimonial_placements p on p.testimonial_id = t.id
where t.status = 'published'
  and t.consent_given
  and t.consent_withdrawn_at is null;

grant select on public.published_testimonials to anon, authenticated;

-- Photos ----------------------------------------------------------------------
-- Public-read bucket for published testimonial photos. Photos are resized
-- client-side before upload (max 320px, JPEG). No insert/update/delete
-- policies yet, for the same staff-auth reason as above. Uploads land with
-- auth. Withdrawing consent must delete the object, not just unlink it.
insert into storage.buckets (id, name, public)
values ('testimonial-photos', 'testimonial-photos', true)
on conflict (id) do nothing;
