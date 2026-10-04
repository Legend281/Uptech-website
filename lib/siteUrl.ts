/*
 * Single source of truth for the site's real, public origin — sitemap.ts,
 * robots.ts, and layout.tsx's metadataBase all read this instead of each
 * hardcoding their own guess.
 *
 * Confirmed 2026-10-03: the real domain is uptechoutsourcing.com (the one
 * actually registered in the Hostinger account), not uptechconsulting.com —
 * an earlier placeholder guess that also leaked into the site's contact
 * email everywhere. Both were corrected together; see CLAUDE.md. Still set
 * NEXT_PUBLIC_SITE_URL explicitly in the real Hostinger deployment's env
 * rather than relying on this fallback.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uptechoutsourcing.com";

if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV !== "test") {
  console.warn(
    "[siteUrl] NEXT_PUBLIC_SITE_URL isn't set — sitemap.xml, robots.txt, and social-share previews are using the fallback domain (uptechoutsourcing.com). Set it explicitly before the real deployment.",
  );
}
