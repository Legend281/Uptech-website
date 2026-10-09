import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, type CompanyDetails } from "@/lib/admin/settings";

/**
 * Public server-side fetcher for company details.
 * Reads the 'company' row from app_settings (configured via Admin > Settings > Company details).
 *
 * If Supabase is unreachable or unconfigured, falls back to DEFAULT_SETTINGS.company.
 */
export async function getCompanyDetails(): Promise<CompanyDetails> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return DEFAULT_SETTINGS.company;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "company")
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_SETTINGS.company;
    }

    const value = data.value as Partial<CompanyDetails>;
    return {
      ...DEFAULT_SETTINGS.company,
      ...value,
    };
  } catch (err) {
    console.warn("[company] Failed to read company details, using defaults:", err);
    return DEFAULT_SETTINGS.company;
  }
}
