import { LeadDetailPageClient } from "./LeadDetailPageClient";

/*
 * This route is entirely client-rendered from local/mock data (see
 * LeadsProvider) — lead ids are created at runtime (manual entry, or
 * eventually a real database once Phase B's admin-read side exists), never
 * known at build time, so there's no real id to list here. `output: export`
 * also rejects a genuinely empty array (tested directly — it errors the
 * same as no generateStaticParams at all), so this returns one placeholder
 * value purely to satisfy that build requirement; it renders the
 * client component's own "not found" state, since no real lead has this id.
 *
 * This only matters for the temporary GitHub Pages preview build (see
 * .github/workflows/github-pages-preview.yml) — real production hosting
 * (Hostinger, per CLAUDE.md Section 2) is a real Next.js server, not a
 * static export, and renders any lead id normally. That preview exists for
 * public marketing-page sign-off, not admin testing, so a single
 * non-functional placeholder path here is an acceptable limitation, not a
 * real regression.
 */
export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetailPageClient id={id} />;
}
