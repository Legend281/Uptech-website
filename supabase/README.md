# Running these migrations on a fresh database

This folder has duplicate numbers — two different `002`s, two `003`s, two
`004`s, two `005`s, two `006`s. That happened because this project went
through a period with two parallel branches (`main` and `Development`), each
numbering its own new migrations from `002` independently; when they merged,
nobody renumbered either set.

Renumbering them now was considered and rejected: these files have already
been run against the live database, are already referenced by number in past
commits and in this project's own conversation history, and — more
importantly — a naive renumber almost reintroduced a real bug. Moving
`005_settings_and_staff.sql` to run *after* `016_fix_staff_role_functions.sql`
would have let its own (buggy) `current_staff_role()` definition silently
overwrite the fix `016` makes, since both files `create or replace` the same
function. The actual required order isn't "ascending by filename" — it's the
order below.

If you ever need to run every migration in order on a brand new Supabase
project (disaster recovery, a staging environment, etc.), use this sequence,
not filename order:

```
001_leads_table.sql
002_leads_applications.sql
002_testimonials.sql
003_staff_auth.sql
003_team_members.sql
004_grants.sql
004_faq_items.sql
005_anon_insert_grant.sql
005_settings_and_staff.sql
006_job_postings.sql
006_testimonial_publishing.sql
007_job_postings_apply_url.sql
008_activity_log.sql
009_service_pages.sql
010_job_postings_closing_date.sql
011_service_pages_due_soon_days.sql
012_profiles_active_and_update.sql
013_additional_services.sql
014_job_postings_department_optional.sql
015_leads_language_optional.sql
016_fix_staff_role_functions.sql
017_team_members_staff_policies.sql
018_faq_items_staff_policies.sql
019_check_active_everywhere.sql
020_drop_profiles_languages.sql
021_settings_real_data.sql
022_onboarding_submissions.sql   <- change the case_number restart value first, see that file's own comment
023_security_advisor_fixes.sql
024_testimonial_single_consent.sql
025_service_pages_service_role_grant.sql
026_blog_posts.sql
027_onboarding_service_role_grant.sql
028_blog_author_bio.sql
029_blog_featured.sql
030_close_authenticated_gaps.sql
031_remove_viewer_role.sql
```

Every new migration from here on should just get the next number after `031`

**Rule for every new policy:** check access with `public.current_staff_role()`
/ `public.current_staff_department()`, never `to authenticated using (true)`
and never an ad hoc `exists (select 1 from public.profiles ...)`. Public
sign-ups make "authenticated" mean "anyone with an email address", and the
ad hoc check ignores deactivated accounts. `030` exists because `008`, `019`
(its leads null-department branch), and `026` each missed one of these.
— the duplicates are a closed, historical problem, not an ongoing one.

**As of 2026-10-03, a live check against the database confirmed `025`, `026`,
and `027` have never actually been run** — they exist as files, written and
committed, but the database itself still doesn't have the table (`026`) or
the permissions (`025`, `027`) they describe. This is why Blog can't save
anything, the daily digest email fails entirely, and the Client Onboarding
webhook silently fails every real submission. Run all four (`025`–`028`), in
that order, before relying on any of Blog, the daily digest, or Onboarding.
