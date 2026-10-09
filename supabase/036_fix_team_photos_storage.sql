-- Uptech Consulting — Fix team-photos storage bucket & policies
-- Run this in your Supabase SQL editor.
--
-- Context: Fixes HTTP/2 protocol and permission errors when staff upload team member photos.
-- Ensures the team-photos bucket exists, is public, and staff can upload/delete.

-- 1. Create or update team-photos bucket to ensure it is public
insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do update set public = true;

-- 2. Allow public to read/view team member photos
drop policy if exists "Public can read team photos" on storage.objects;
create policy "Public can read team photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'team-photos');

-- 3. Allow staff (administrators and editors) to upload team photos
drop policy if exists "Administrators upload team photos" on storage.objects;
drop policy if exists "Staff can upload team photos" on storage.objects;
create policy "Staff can upload team photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'team-photos' and public.current_staff_role() in ('administrator', 'editor'));

-- 4. Allow staff to update or replace team photos
drop policy if exists "Staff can update team photos" on storage.objects;
create policy "Staff can update team photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'team-photos' and public.current_staff_role() in ('administrator', 'editor'));

-- 5. Allow staff to delete team photos
drop policy if exists "Administrators remove team photos" on storage.objects;
drop policy if exists "Staff can delete team photos" on storage.objects;
create policy "Staff can delete team photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'team-photos' and public.current_staff_role() in ('administrator', 'editor'));
