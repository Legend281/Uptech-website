-- Uptech Consulting admin dashboard — Additional Services.
-- Run this once in the Supabase SQL editor, after 003_staff_auth.sql.
--
-- Lets Uptech add a real new service later without a code change: the 5
-- current, real services (Career Marketing, Business Formalisation CM/US,
-- Tax Compliance, CNPS Compliance) stay exactly as hardcoded on the
-- Homepage and /services — untouched, zero risk. This table only ever
-- adds MORE services, appended after those 5, rendered with the identical
-- card/list design (see app/page.tsx and app/services/page.tsx). A row
-- here is never one of the original 5.
--
-- Grants included in this same migration (see 004/005's own history for
-- why that matters — RLS policies alone don't grant table-level access).

create table if not exists public.additional_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  -- A dedicated page for this service, if one has been built — null means
  -- "no page yet," and the public card falls back to a "Get in touch" CTA
  -- instead of "Explore" (CLAUDE.md Section 6: never link to a page that
  -- doesn't exist).
  href text,
  -- An optional country-flag emoji, matching the existing 5 cards' style
  -- (e.g. the Business Formalisation cards' 🇨🇲 / 🇺🇸).
  flag text,
  -- Path inside the service-photos storage bucket, never a full URL.
  photo_path text not null,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_additional_services_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists additional_services_set_updated_at on public.additional_services;
create trigger additional_services_set_updated_at
  before update on public.additional_services
  for each row
  execute function public.set_additional_services_updated_at();

alter table public.additional_services enable row level security;

-- Every staff member can see the full list, drafts included — matching
-- Job Postings' precedent (staff need to see what's not live yet too).
drop policy if exists "Staff can read all additional services" on public.additional_services;
create policy "Staff can read all additional services"
  on public.additional_services
  for select
  to authenticated
  using (true);

-- Administrator or Editor can create/change/publish — Viewers stay read-only,
-- matching the Leads/Service Pages update-policy pattern.
drop policy if exists "Staff can write additional services" on public.additional_services;
create policy "Staff can write additional services"
  on public.additional_services
  for all
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('administrator', 'editor')));

grant select, insert, update, delete on public.additional_services to authenticated;

-- Public read path — only published rows, only the columns the public site
-- actually needs (no created_by/status/timestamps).
create or replace view public.published_additional_services as
select id, title, description, href, flag, photo_path, display_order
from public.additional_services
where status = 'published'
order by display_order asc, created_at asc;

grant select on public.published_additional_services to anon, authenticated;

-- Photos — same public-read-bucket pattern as testimonial-photos/team-photos.
insert into storage.buckets (id, name, public)
values ('service-photos', 'service-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view service photos" on storage.objects;
create policy "Public can view service photos"
  on storage.objects
  for select
  using (bucket_id = 'service-photos');

drop policy if exists "Staff can upload service photos" on storage.objects;
create policy "Staff can upload service photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'service-photos');

drop policy if exists "Staff can delete service photos" on storage.objects;
create policy "Staff can delete service photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'service-photos');
