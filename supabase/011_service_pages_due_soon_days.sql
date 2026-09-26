-- Uptech Consulting admin dashboard — configurable "due soon" warning window
-- per tracked compliance page. Run this once in the Supabase SQL editor,
-- after 009_service_pages.sql.
--
-- Merging in the Development branch's Settings module (built by a teammate)
-- brought a "Review Cycle Settings" screen that lets an Administrator tune
-- how many days before a page is due its "due soon" warning starts firing —
-- previously a flat, non-configurable 30 days (lib/admin/staleness.ts's
-- DEFAULT_DUE_SOON_DAYS). That screen needs somewhere real to persist a
-- per-page override; this column is it. Nullable, so every existing page
-- keeps using the flat default until someone actually changes it.
--
-- No RLS/grant changes needed — same table, same policies as 009.

alter table public.service_pages add column if not exists due_soon_days integer;
