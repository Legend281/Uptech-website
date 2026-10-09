import { getSupabaseServerClient } from "@/lib/supabase/server";

/*
 * Public read side of the Partner Logos module.
 * Reads published partner logos from the published_partner_logos view
 * (supabase/032_partner_logos.sql).
 *
 * Runs on the server for the homepage. If Supabase is not configured,
 * or the table hasn't been migrated yet, or returns empty, it falls back
 * gracefully to the default 6 real partners.
 */

export type PublicPartner = {
  id?: string;
  name: string;
  src: string;
  websiteUrl?: string;
  width?: number;
  height?: number;
};

export const DEFAULT_PARTNERS: PublicPartner[] = [
  { id: "partner-1", name: "Capital One", src: "/images/s1.webp", width: 199, height: 74 },
  { id: "partner-2", name: "CenturyLink", src: "/images/s2.webp", width: 156, height: 78 },
  { id: "partner-3", name: "HMS", src: "/images/s3.webp", width: 182, height: 64 },
  { id: "partner-4", name: "Accenture", src: "/images/s4.webp", width: 223, height: 62 },
  { id: "partner-5", name: "GVEC", src: "/images/s5.webp", width: 165, height: 62 },
  { id: "partner-6", name: "KiawiTech IT Academy", src: "/images/header-logo.webp", width: 248, height: 71 },
];

type PublishedPartnerRow = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
};

export async function getPublishedPartnerLogos(): Promise<PublicPartner[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return DEFAULT_PARTNERS;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("published_partner_logos")
      .select("id, name, logo_url, website_url, display_order")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("[partners] read failed, falling back to default partners:", error.message);
      return DEFAULT_PARTNERS;
    }

    const supabaseUrl = process.env.SUPABASE_URL;

    return (data as PublishedPartnerRow[]).map((row) => {
      let src = row.logo_url;
      // If it's a storage path inside partner-logos bucket, resolve to public URL
      if (src && !src.startsWith("/") && !src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("data:")) {
        src = `${supabaseUrl}/storage/v1/object/public/partner-logos/${encodeURI(src)}`;
      }

      return {
        id: row.id,
        name: row.name,
        src,
        websiteUrl: row.website_url ?? undefined,
        width: 200,
        height: 70,
      };
    });
  } catch (err) {
    console.error("[partners] read failed:", err);
    return DEFAULT_PARTNERS;
  }
}
