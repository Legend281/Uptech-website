-- Uptech Consulting admin dashboard — one-tick testimonial consent.
-- Run once in the Supabase SQL editor AFTER 013_testimonial_publishing.sql.
-- Safe to re-run.
--
-- Leadership decision: the Add a Testimonial form's consent section is now
-- a single "the client agreed" tick, recorded as channel 'confirmed' (a
-- staff member confirmed it) and dated the day it was ticked. Consent is
-- still required to publish — 002's testimonials_publish_requires_consent
-- is unchanged — but there is no longer a way to record a signed form, so
-- the two rules that demanded one are relaxed:
--   * Homepage: needs a full name (no longer also a signed form);
--   * outcome line: needs a linked lead (no longer also a signed form).

-- 1. Allow the new 'confirmed' consent channel.
alter table public.testimonials drop constraint if exists testimonials_consent_channel_check;
alter table public.testimonials add constraint testimonials_consent_channel_check
  check (consent_channel in ('whatsapp', 'email', 'signed-form', 'confirmed'));

-- 2. Outcome lines: a linked lead is still required, a signed form no longer is.
alter table public.testimonials drop constraint if exists testimonials_outcome_requires_lead;
alter table public.testimonials add constraint testimonials_outcome_requires_lead
  check (status <> 'published' or outcome_line is null or lead_id is not null);

-- 3. Homepage and service-page placement rules, without the signed-form requirement.
create or replace function public.assert_testimonial_placement_rules()
returns trigger as $$
declare
  target uuid;
begin
  -- Separate branches, not one CASE: NEW only has the columns of the table
  -- that fired the trigger, and referencing the other table's column errors.
  if tg_table_name = 'testimonials' then
    target := new.id;
  else
    target := new.testimonial_id;
  end if;

  if exists (
    select 1
    from public.testimonials t
    join public.testimonial_placements p on p.testimonial_id = t.id
    where t.id = target
      and p.page = 'homepage'
      and t.status = 'published'
      and t.attribution_mode <> 'full_name'
  ) then
    raise exception 'A published Homepage testimonial needs the client''s full name (testimonial %).', target;
  end if;

  -- A service page only shows testimonials about its own service.
  if exists (
    select 1
    from public.testimonials t
    join public.testimonial_placements p on p.testimonial_id = t.id
    where t.id = target
      and t.status = 'published'
      and p.page = 'career-marketing-placement'
      and t.service <> 'career-marketing'
  ) then
    raise exception 'The Career Marketing page only shows Career Marketing testimonials (testimonial %).', target;
  end if;

  return null;
end;
$$ language plpgsql;

notify pgrst, 'reload schema';
