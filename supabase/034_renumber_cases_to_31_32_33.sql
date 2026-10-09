-- Uptech Consulting admin dashboard — Renumber onboarding cases to 31, 32, 33
-- Run this once in the Supabase SQL editor.
--
-- Context: The previous 30 submissions were deleted. The 3 remaining submissions
-- should be numbered 31, 32, 33 (continuing from where the previous 30 left off).
-- This script reassigns their case_numbers in submitted_at order and resets
-- the identity sequence so the next submission gets case #34.

do $$
declare
  seq_name text;
  r record;
  new_num integer := 31;
begin
  -- First, use large temp numbers to avoid unique-constraint collisions
  -- while we reassign (in case current numbers overlap with 31-33)
  update public.onboarding_submissions
  set case_number = case_number + 10000;

  -- Now reassign 31, 32, 33 in submission order (oldest first)
  for r in (
    select id from public.onboarding_submissions
    order by submitted_at asc, created_at asc
  ) loop
    update public.onboarding_submissions
    set case_number = new_num
    where id = r.id;
    new_num := new_num + 1;
  end loop;

  -- Reset the identity sequence so the next new submission gets case #34
  select pg_get_serial_sequence('public.onboarding_submissions', 'case_number')
  into seq_name;

  if seq_name is not null then
    perform setval(seq_name, new_num - 1);
  end if;

  raise notice 'Renumbered % submissions: 31 through %. Sequence reset to %.', new_num - 31, new_num - 1, new_num - 1;
end;
$$;
