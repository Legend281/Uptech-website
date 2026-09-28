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
```

Every new migration from here on should just get the next number after `024`
— the duplicates are a closed, historical problem, not an ongoing one.
