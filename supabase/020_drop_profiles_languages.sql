-- Uptech Consulting admin dashboard — remove the "Languages Spoken"
-- capability field from staff accounts, per a direct product decision to
-- drop the English/French concept everywhere, not just from the lead-side
-- "Preferred language" selector (015_leads_language_optional.sql). It was
-- kept at first as a separate, legitimate-seeming capability roster
-- (Staff page, Assignment Settings, Invite dialog) — that distinction
-- wasn't wanted; this removes it too.
--
-- The one functional use of this field (flagging a French-preferring lead
-- claimed by someone who doesn't list French) was already removed along
-- with the lead-side field itself. Nothing left in the app reads
-- profiles.languages.
--
-- This DROPS the column — real data loss for whatever's on file per staff
-- member. Skip this migration and the app still works fine either way;
-- nothing writes to or reads this column anymore regardless.

alter table public.profiles drop column if exists languages;
