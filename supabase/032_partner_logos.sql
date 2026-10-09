-- Uptech Consulting admin dashboard — Partner Logos
-- Run this once in the Supabase SQL editor.
--
-- Lets administrators add, edit, reorder, and remove partner logos shown
-- in the "Our Partners" marquee strip on the public homepage.
--
-- Includes seed rows for the 6 original partners, matching the current public strip.

create table if not exists public.partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  display_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_partner_logos_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists partner_logos_set_updated_at on public.partner_logos;
create trigger partner_logos_set_updated_at
  before update on public.partner_logos
  for each row
  execute function public.set_partner_logos_updated_at();

alter table public.partner_logos enable row level security;

-- Every active staff member can view all partner logos
drop policy if exists "Staff can read all partner logos" on public.partner_logos;
create policy "Staff can read all partner logos"
  on public.partner_logos
  for select
  to authenticated
  using (public.current_staff_role() is not null);

-- Administrators and editors can insert/update/delete partner logos
drop policy if exists "Staff can write partner logos" on public.partner_logos;
create policy "Staff can write partner logos"
  on public.partner_logos
  for all
  to authenticated
  using (public.current_staff_role() in ('administrator', 'editor'))
  with check (public.current_staff_role() in ('administrator', 'editor'));

grant select, insert, update, delete on public.partner_logos to authenticated;

-- Public view: published partner logos only
create or replace view public.published_partner_logos as
select id, name, logo_url, website_url, display_order
from public.partner_logos
where status = 'published'
order by display_order asc, created_at asc;

grant select on public.published_partner_logos to anon, authenticated;

-- Storage bucket for partner logos
insert into storage.buckets (id, name, public)
values ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view partner logos" on storage.objects;
create policy "Public can view partner logos"
  on storage.objects
  for select
  using (bucket_id = 'partner-logos');

drop policy if exists "Staff can upload partner logos" on storage.objects;
create policy "Staff can upload partner logos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'partner-logos' and public.current_staff_role() in ('administrator', 'editor'));

drop policy if exists "Staff can delete partner logos" on storage.objects;
create policy "Staff can delete partner logos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'partner-logos' and public.current_staff_role() in ('administrator', 'editor'));

-- Seed the initial 6 real partners if table is empty
insert into public.partner_logos (name, logo_url, display_order, status)
select * from (values
  ('Capital One', '/images/s1.webp', 1, 'published'),
  ('CenturyLink', '/images/s2.webp', 2, 'published'),
  ('HMS', '/images/s3.webp', 3, 'published'),
  ('Accenture', '/images/s4.webp', 4, 'published'),
  ('GVEC', '/images/s5.webp', 5, 'published'),
  ('KiawiTech IT Academy', '/images/header-logo.webp', 6, 'published')
) as v(name, logo_url, display_order, status)
where not exists (select 1 from public.partner_logos);
