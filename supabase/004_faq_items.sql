-- Uptech Consulting admin dashboard — FAQ Items.
-- Run once in the Supabase SQL editor. Independent of 001–003.
-- (Numbered 004 to match Admin_Content_Pages_Spec.md 3.4.)
--
-- Mirrors lib/admin/types.ts's FaqItemRecord and the rules in
-- lib/admin/faqs.ts. The site's built-in FAQs live in lib/faqContent.ts;
-- a category shows rows from this table only once at least one is
-- published (lib/faqs.ts), so this table can start empty.

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(trim(question)) > 0),
  -- Light formatting, rendered safely by components/FaqAnswer.tsx.
  answer text not null check (char_length(trim(answer)) > 0),
  -- No CHECK list on purpose (spec 0.4): categories are "general" plus the
  -- current active-service values, which change without a migration.
  category text not null,
  display_order integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published')),
  reviewed_by text,
  reviewed_at timestamptz,
  -- Live before the review gate existed; still needs a first review.
  awaiting_first_review boolean not null default false,
  last_edited_by text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Spec 3.2: the author can't approve their own words.
  constraint faq_items_no_self_review check (reviewed_by is null or reviewed_by <> last_edited_by)
);

create index if not exists faq_items_category_order_idx on public.faq_items (category, display_order);

-- Categories that need a second person's review before publishing (spec 3.2).
-- Keep in step with legalReview in lib/admin/faqs.ts.
create or replace function public.faq_category_needs_review(category text)
returns boolean as $$
  select category in ('tax-compliance-businesses', 'cnps-compliance');
$$ language sql immutable;

-- Bookkeeping + the review gate, in one place:
--   * any change to the question or answer clears the review;
--   * a review-gated FAQ can't be published (or stay published) without a
--     current review — unless it is grandfathered and untouched.
create or replace function public.enforce_faq_review_gate()
returns trigger as $$
begin
  new.updated_at = now();

  if tg_op = 'UPDATE' and (new.question is distinct from old.question or new.answer is distinct from old.answer) then
    new.reviewed_by = null;
    new.reviewed_at = null;
    new.awaiting_first_review = false;
  end if;

  if new.reviewed_by is not null then
    new.awaiting_first_review = false;
  end if;

  if new.status = 'published'
     and public.faq_category_needs_review(new.category)
     and new.reviewed_at is null
     and not new.awaiting_first_review then
    raise exception 'FAQ % needs a review by a second person before it can be published.', new.id;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists faq_items_review_gate on public.faq_items;
create trigger faq_items_review_gate
  before insert or update on public.faq_items
  for each row
  execute function public.enforce_faq_review_gate();

-- Row Level Security ----------------------------------------------------------
-- RLS on, no policies yet (same reasoning as 001–003). When staff auth
-- lands: Administrators do anything; Editors write only categories that
-- belong to their department ("general" is Administrators only); Viewers
-- read their department's rows.
alter table public.faq_items enable row level security;
revoke all on public.faq_items from anon, authenticated;

-- Public read path: published rows, public columns only. Owner's rights on
-- purpose (see the note in 002_testimonials.sql).
create or replace view public.published_faq_items as
select id, category, question, answer, display_order
from public.faq_items
where status = 'published';

grant select on public.published_faq_items to anon, authenticated;
