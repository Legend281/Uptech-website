import { getSupabaseServerClient } from "@/lib/supabase/server";

/*
 * Public read side of the Additional Services module (see
 * supabase/013_additional_services.sql). The 5 current, real services stay
 * exactly as hardcoded on the Homepage and /services; this reads whatever
 * Uptech has added and published beyond those 5, so they appear after them
 * in the identical card/list design without a code change or redeploy.
 *
 * Server-only (reads SUPABASE_URL / SUPABASE_ANON_KEY). Reads ONLY the
 * published_additional_services view, which already filters to published
 * rows and strips internal fields (status, created_by, timestamps).
 * Gracefully returns an empty list on any failure (missing env vars, table
 * not yet migrated, or genuinely nothing published) — every caller then
 * just shows the original 5, exactly as before this module existed.
 */

export type PublishedAdditionalService = {
  id: string;
  title: string;
  description: string;
  href?: string;
  flag?: string;
  photoUrl?: string;
};

type PublishedRow = {
  id: string;
  title: string;
  description: string;
  href: string | null;
  flag: string | null;
  photo_path: string;
  display_order: number;
};

export async function getPublishedAdditionalServices(): Promise<PublishedAdditionalService[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return [];

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("published_additional_services")
      .select("id, title, description, href, flag, photo_path, display_order")
      .order("display_order", { ascending: true });

    if (error || !data) {
      if (error) console.error("[additional-services] read failed; showing the page's 5 core services instead:", error.message);
      return [];
    }

    return (data as PublishedRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      href: row.href ?? undefined,
      flag: row.flag ?? undefined,
      photoUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/service-photos/${encodeURI(row.photo_path)}`,
    }));
  } catch (error) {
    console.error("[additional-services] read failed; showing the page's 5 core services instead:", error);
    return [];
  }
}
