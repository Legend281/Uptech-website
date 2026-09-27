-- Uptech Consulting admin dashboard — department is no longer required on a
-- job posting. Run this once in the Supabase SQL editor, after 006.
--
-- Some postings (e.g. a general-interest or cross-department opening) don't
-- cleanly belong to one of the six HIRING_DEPARTMENT_NAMES. The admin form,
-- the public Careers page, and the lead/job-posting matcher all already
-- treat a missing department as "not stated" rather than an error — this
-- migration just lets the database accept that instead of rejecting it.
--
-- No RLS/grant changes needed — same table, same policies as 006.

alter table public.job_postings alter column department drop not null;
