-- Uptech Consulting admin dashboard — the "Preferred language" (English /
-- French) selector has been removed from the Book a Consultation form, the
-- Apply/résumé form, and the admin's own manual "Log a New Lead" form, per
-- a direct product decision — it's no longer collected anywhere.
--
-- Not urgent to run: the app now writes a fixed "English" default into this
-- column on every insert (see app/api/leads/route.ts, app/api/apply/route.ts,
-- and LeadsProvider.tsx's addLead), so the existing not-null + check
-- constraint keeps being satisfied either way. Nothing breaks if this is
-- never run. Run it whenever you want the column itself gone rather than
-- just unused.
--
-- Historical data note: this DROPS the column, which erases whatever
-- language preference is on file for every existing lead. If you might want
-- that history later, keep the column (skip this migration) — the app
-- doesn't care either way.

alter table public.leads drop column if exists language;
