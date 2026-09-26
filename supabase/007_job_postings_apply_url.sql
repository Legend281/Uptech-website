-- Uptech Consulting admin dashboard — optional external apply link for a
-- job posting (e.g. the Graduate Trainee Program, which applies through a
-- Google Form, not the site's own résumé-upload flow).
-- Run this once in the Supabase SQL editor, after 006_job_postings.sql.

alter table public.job_postings add column if not exists apply_url text;

comment on column public.job_postings.apply_url is
  'When set, the public "Apply" button links here instead of opening the site''s own résumé-upload flow.';
