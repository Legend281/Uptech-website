-- Uptech Consulting admin dashboard — Job Application intake.
-- Run this once in the Supabase SQL editor, after 001_leads_table.sql.
--
-- Per Admin_Dashboard_Requirements.md Section 3.11: "The same applies to CV
-- submissions and any checklist/lead-magnet downloads elsewhere on the
-- site" — a job application is a Lead (service = 'career-marketing',
-- type = 'job-seeker'), not a separate table. This migration only adds
-- what a CV submission needs on top of the existing leads table: a resume
-- file reference, a new source value to tell it apart from the general
-- Contact form, and a private Storage bucket to hold the actual files.

alter table public.leads add column if not exists resume_url text;

comment on column public.leads.resume_url is
  'A storage object path within the resumes bucket (e.g. "<uuid>-cv.pdf"), not a public URL — the bucket is private. Null for every lead that isn''t a job application.';

-- Postgres auto-names an unnamed column CHECK constraint "<table>_<column>_check" —
-- this matches what 001_leads_table.sql implicitly created for `source`.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check check (
  source in ('contact-form', 'careers-apply', 'referral', 'whatsapp', 'website', 'manual-phone', 'manual-email', 'manual-other')
);

-- Private bucket: resumes contain real PII (name, contact info, work
-- history), so this follows the exact same least-privilege posture as the
-- leads table itself (see 001's own comment) — anon can INSERT (upload) a
-- new file during a submission, never list, read, or delete. At submission
-- time (before any staff session exists), app/api/apply/route.ts generates
-- a short-lived signed URL via the service-role key and includes it in the
-- Resend notification email. Once 003_staff_auth.sql adds real staff
-- accounts, any authenticated staff member can also read this bucket
-- directly (ResumeDownloadButton) — both paths coexist on purpose.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Public can upload resumes" on storage.objects;
create policy "Public can upload resumes"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'resumes');
