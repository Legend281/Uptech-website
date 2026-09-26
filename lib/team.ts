import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/components/TeamGrid";

/*
 * Public read side of the Team Members module. Server-only; reads ONLY the
 * visible_team_members view from supabase/003_team_members.sql.
 *
 * Runs at build time for the statically prerendered Who We Are page. An
 * empty list (no env vars, table not created yet, nobody visible) is the
 * normal answer today, and TeamGrid then shows its "profiles coming soon"
 * line. Once staff auth lets the dashboard write here, saving a visible
 * member should revalidatePath("/who-we-are").
 */

type VisibleRow = {
  name: string;
  title: string;
  bio: string | null;
  profile_url: string | null;
  photo_path: string | null;
};

export async function getVisibleTeamMembers(): Promise<TeamMember[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return [];

  try {
    const { data, error } = await getSupabaseServerClient()
      .from("visible_team_members")
      .select("name, title, bio, profile_url, photo_path")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) {
      if (error) console.error("[team] read failed; showing the empty state instead:", error.message);
      return [];
    }

    return (data as VisibleRow[]).map((row) => ({
      name: row.name,
      role: row.title,
      bio: row.bio ?? undefined,
      linkedinUrl: row.profile_url ?? undefined,
      photo: row.photo_path
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/team-photos/${encodeURI(row.photo_path)}`
        : undefined,
    }));
  } catch (error) {
    console.error("[team] read failed; showing the empty state instead:", error);
    return [];
  }
}
