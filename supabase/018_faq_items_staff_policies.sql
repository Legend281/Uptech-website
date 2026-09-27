-- Uptech Consulting admin dashboard — real staff RLS for FAQ Items.
-- Run once, after 003_staff_auth.sql and 004_faq_items.sql.
--
-- Same gap and same fix shape as 017_team_members_staff_policies.sql:
-- 004_faq_items.sql shipped before public.profiles existed, left RLS
-- enabled with zero policies, and the "when staff auth lands" follow-up
-- never happened. Currently harmless only because FaqItemsProvider.tsx is
-- still a localStorage mock.
--
-- Mirrors lib/admin/faqs.ts's canManageFaqCategory() exactly: Administrators
-- manage every category; an Editor manages only the category(ies) that
-- belong to their own department; "general" (the Homepage FAQ) has no
-- owning department, so it's Administrators only. Keep this function in
-- step with lib/admin/faqs.ts's allCategories the same way
-- faq_category_needs_review() (004_faq_items.sql) is already kept in step
-- with legalReview there.

create or replace function public.faq_category_department(category text)
returns text as $$
  select case category
    when 'career-marketing' then 'career-services-operations'
    when 'business-formalisation-cameroon' then 'business-formalisation-compliance'
    when 'business-formalisation-us' then 'business-formalisation-compliance'
    when 'tax-compliance-businesses' then 'business-formalisation-compliance'
    when 'cnps-compliance' then 'business-formalisation-compliance'
    else null -- 'general' and anything not listed: no owning department, Administrators only.
  end;
$$ language sql immutable;

revoke all on public.faq_items from anon, authenticated;
grant select, insert, update, delete on public.faq_items to authenticated;

-- Read: Administrators see everything. Editors/Viewers see their own
-- department's categories, plus "general" — the Homepage FAQ affects
-- everyone, so it's worth being visible even though only an Administrator
-- can change it.
drop policy if exists "Staff read faq items in scope" on public.faq_items;
create policy "Staff read faq items in scope"
  on public.faq_items
  for select
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or public.faq_category_department(category) is null
    or public.faq_category_department(category) = public.current_staff_department()
  );

drop policy if exists "Staff write faq items in scope" on public.faq_items;
create policy "Staff write faq items in scope"
  on public.faq_items
  for insert
  to authenticated
  with check (
    public.current_staff_role() = 'administrator'
    or (
      public.current_staff_role() = 'editor'
      and public.faq_category_department(category) = public.current_staff_department()
    )
  );

drop policy if exists "Staff update faq items in scope" on public.faq_items;
create policy "Staff update faq items in scope"
  on public.faq_items
  for update
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or (
      public.current_staff_role() = 'editor'
      and public.faq_category_department(category) = public.current_staff_department()
    )
  )
  with check (
    public.current_staff_role() = 'administrator'
    or (
      public.current_staff_role() = 'editor'
      and public.faq_category_department(category) = public.current_staff_department()
    )
  );

drop policy if exists "Staff delete faq items in scope" on public.faq_items;
create policy "Staff delete faq items in scope"
  on public.faq_items
  for delete
  to authenticated
  using (
    public.current_staff_role() = 'administrator'
    or (
      public.current_staff_role() = 'editor'
      and public.faq_category_department(category) = public.current_staff_department()
    )
  );
