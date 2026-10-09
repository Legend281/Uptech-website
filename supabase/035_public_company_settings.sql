-- Uptech Consulting — Enable public reading of company details from app_settings
-- Run this in your Supabase SQL editor.
--
-- Context: Company details (contact email, phone number, WhatsApp number, office addresses,
-- and social media URLs) configured in Admin Settings > Company details must be readable
-- by the public website (anon role) so visitors see the updated contact information.
-- Assignment settings remain restricted to authenticated staff only.

-- 1. Ensure anon can execute SELECT on app_settings
grant select on public.app_settings to anon;

-- 2. Add an RLS policy that permits anon and authenticated to read the 'company' row specifically
drop policy if exists "Public read company settings" on public.app_settings;
create policy "Public read company settings"
  on public.app_settings
  for select
  to anon, authenticated
  using (key = 'company');

-- Note: The existing "Staff read settings" and "Administrators change settings"
-- policies remain in place to protect lead assignment configurations.
