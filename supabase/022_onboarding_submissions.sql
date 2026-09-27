-- Uptech Consulting admin dashboard — Client Onboarding submissions.
-- Run once, after 016_fix_staff_role_functions.sql.
--
-- Feeds from an external Google Form (Profile Marketing client intake) via
-- a webhook (app/api/onboarding-webhook/route.ts) for everything the client
-- fills in themselves. Two fields are NOT part of that webhook payload —
-- account_manager_id and application_password — because they're set by
-- Uptech staff afterward, never by the client: the account manager
-- assignment happens in the dashboard, and the application password is one
-- Uptech itself generates once the case is set up.
--
-- Deliberately more sensitive than any other table in this project: real
-- date of birth, nationality, ethnicity, immigration/residency status, and
-- — on explicit instruction, despite being offered a safer encrypted
-- alternative twice — the client's actual email, LinkedIn, and application
-- account passwords in plain text. Access is stricter than the Leads
-- precedent as a result: Viewers get nothing at all, regardless of
-- department (elsewhere in this app a Viewer gets read-only access).

create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  -- Continuing Uptech's own existing numbering (their real sheet was
  -- already at 127 when this was built) — change the restart value below to
  -- whatever their actual highest case number is before running this.
  case_number integer not null generated always as identity (start with 128),
  account_manager_id uuid references public.profiles(id) on delete set null,

  first_name text not null,
  last_name text not null,
  gender text not null,
  contact text not null,
  email text not null,
  email_password text,
  linkedin_email text not null,
  linkedin_password text not null,
  -- Set later by staff, once Uptech has created it for the client — never
  -- part of the webhook payload the client's own form submission sends.
  application_password text,
  address text not null,
  date_of_birth date not null,
  nationality text not null,
  ethnicity text not null,
  residency_status text not null,
  security_clearance text not null,
  preferred_job_titles text not null,
  preferred_job_location text not null,
  expected_salary_range text not null,
  -- Google Drive share links from the form's file-upload questions.
  resume_url text,
  linkedin_photo_url text,

  -- Three fixed reference slots, matching the form's own fixed structure
  -- (not a repeating/dynamic section) — flat columns are simpler here than
  -- a child table for a fixed count of 3, and keep the Excel export flat.
  reference1_name text,
  reference1_title_company text,
  reference1_relationship text,
  reference1_email text,
  reference1_phone text,
  reference2_name text,
  reference2_title_company text,
  reference2_relationship text,
  reference2_email text,
  reference2_phone text,
  reference3_name text,
  reference3_title_company text,
  reference3_relationship text,
  reference3_email text,
  reference3_phone text,

  -- The Google account the form response was collected under — may differ
  -- from the client's own "Email" answer above.
  google_response_email text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_onboarding_submissions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists onboarding_submissions_set_updated_at on public.onboarding_submissions;
create trigger onboarding_submissions_set_updated_at
  before update on public.onboarding_submissions
  for each row
  execute function public.set_onboarding_submissions_updated_at();

alter table public.onboarding_submissions enable row level security;
revoke all on public.onboarding_submissions from anon, authenticated;

-- No grant to anon at all — the webhook route writes through the service
-- role key (server-only, bypasses RLS entirely), never the public anon key,
-- unlike /api/leads and /api/apply which accept anon inserts directly.
grant select, update, delete on public.onboarding_submissions to authenticated;

drop policy if exists "Career services staff read onboarding submissions" on public.onboarding_submissions;
create policy "Career services staff read onboarding submissions"
  on public.onboarding_submissions
  for select
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or (public.current_staff_role() = 'editor' and public.current_staff_department() = 'career-services-operations')
  );

-- Update covers both: an Administrator/career-services Editor setting the
-- application password or reassigning the account manager.
drop policy if exists "Career services staff update onboarding submissions" on public.onboarding_submissions;
create policy "Career services staff update onboarding submissions"
  on public.onboarding_submissions
  for update
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or (public.current_staff_role() = 'editor' and public.current_staff_department() = 'career-services-operations')
  )
  with check (
    public.current_staff_role() = 'administrator'
    or (public.current_staff_role() = 'editor' and public.current_staff_department() = 'career-services-operations')
  );

drop policy if exists "Career services staff delete onboarding submissions" on public.onboarding_submissions;
create policy "Career services staff delete onboarding submissions"
  on public.onboarding_submissions
  for delete
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or (public.current_staff_role() = 'editor' and public.current_staff_department() = 'career-services-operations')
  );
