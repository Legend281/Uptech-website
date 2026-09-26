import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TestimonialCardProps } from "@/components/TestimonialCard";
import type { TestimonialPage } from "@/lib/admin/types";

/*
 * Public read side of the Testimonials module. Server-only (it reads
 * SUPABASE_URL / SUPABASE_ANON_KEY, which are never exposed to the client).
 *
 * Reads ONLY the published_testimonials view from
 * supabase/002_testimonials.sql, which already filters to published,
 * consented rows and strips every internal field — this code never sees
 * original wording, consent details or lead links.
 *
 * Runs once at build time for these statically prerendered pages. An
 * empty list is the normal answer today (missing env vars, table not yet
 * created, or nothing published) and every caller falls back to what the
 * page showed before. When staff auth lands and publishing writes to the
 * database, the publish action should call revalidatePath() for the
 * affected page so it updates without a redeploy.
 */

type PublishedRow = {
  id: string;
  display_order: number;
  quote_en: string;
  outcome_line: string | null;
  display_name: string;
  role_title: string | null;
  company: string | null;
  photo_path: string | null;
};

export type PublishedTestimonial = TestimonialCardProps & { id: string };

export async function getPublishedTestimonials(page: TestimonialPage): Promise<PublishedTestimonial[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return [];

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("published_testimonials")
      .select("id, display_order, quote_en, outcome_line, display_name, role_title, company, photo_path")
      .eq("page", page)
      .order("display_order", { ascending: true });

    if (error || !data) {
      if (error) console.error("[testimonials] read failed; showing the page's fallback instead:", error.message);
      return [];
    }

    return (data as PublishedRow[]).map((row) => ({
      id: row.id,
      quote: row.quote_en,
      displayName: row.display_name,
      roleTitle: row.role_title ?? undefined,
      company: row.company ?? undefined,
      outcomeLine: row.outcome_line ?? undefined,
      photoUrl: row.photo_path
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/testimonial-photos/${encodeURI(row.photo_path)}`
        : undefined,
    }));
  } catch (error) {
    console.error("[testimonials] read failed; showing the page's fallback instead:", error);
    return [];
  }
}
