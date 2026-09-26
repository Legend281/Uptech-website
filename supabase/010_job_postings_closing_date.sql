-- Uptech Consulting admin dashboard — real closing date for fixed-duration
-- job postings. Run this once in the Supabase SQL editor, after 006/007.
--
-- Before this, isJobPostingStale() (lib/admin/jobPostings.ts) used a single
-- flat "45 days since posted" heuristic for every published posting. That's
-- a reasonable guess for an open-ended role, but wrong for a time-boxed
-- program with its own real intake window (e.g. the Graduate Trainee
-- Program 2026, which states its own launch/start dates in its
-- description) — it could show as falsely stale while the real program is
-- still well within its actual window, or falsely fresh after the real
-- deadline has already passed. This column lets staff record the real date
-- when one exists; the 45-day heuristic remains the fallback for every
-- posting that leaves it unset.
--
-- No RLS/grant changes needed — same table, same policies as 006.

alter table public.job_postings add column if not exists closing_date date;
