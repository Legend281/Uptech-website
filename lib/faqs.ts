import { getSupabaseServerClient } from "@/lib/supabase/server";
import { siteFaqs, type FaqCategory } from "@/lib/faqContent";
import type { FaqItem } from "@/components/FaqAccordion";

/*
 * Public read side of the FAQ Items module. Server-only; reads ONLY the
 * published_faq_items view from supabase/004_faq_items.sql, which already
 * enforces the legal-review gate for Tax and CNPS compliance answers.
 *
 * Replace, never merge: once a category has at least one FAQ published in
 * the database, the page shows exactly that list (in its display order)
 * instead of its built-in one — mixing the two would duplicate questions.
 * Anything short of that (no env vars, table not created yet, nothing
 * published for the category, a read error) falls back to the built-in
 * list in lib/faqContent.ts, so a page never loses its FAQ.
 *
 * Runs at build time for these statically prerendered pages. Once staff
 * auth lets the dashboard publish here, publishing should
 * revalidatePath() the affected page.
 */
export async function getFaqs(category: FaqCategory): Promise<FaqItem[]> {
  const fallback = siteFaqs[category];
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return fallback;

  try {
    const { data, error } = await getSupabaseServerClient()
      .from("published_faq_items")
      .select("question, answer")
      .eq("category", category)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[faqs] read failed; showing the built-in FAQ instead:", error.message);
      return fallback;
    }
    return data && data.length > 0 ? (data as FaqItem[]) : fallback;
  } catch (error) {
    console.error("[faqs] read failed; showing the built-in FAQ instead:", error);
    return fallback;
  }
}
