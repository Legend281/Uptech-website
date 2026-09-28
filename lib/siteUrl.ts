/*
 * Single source of truth for the site's real, public origin — sitemap.ts,
 * robots.ts, and layout.tsx's metadataBase all read this instead of each
 * hardcoding their own guess.
 *
 * [PENDING: confirm real domain with management] — "uptechconsulting.com"
 * below is NOT a confirmed decision, just a working placeholder so the
 * sitemap/robots/OG-image code has something to build against today. The
 * fact that infos@uptechconsulting.com is already used as a real contact
 * email sitewide doesn't mean the website's own domain will match it —
 * management is deciding the actual domain separately. Set
 * NEXT_PUBLIC_SITE_URL to the real one the moment it's confirmed; nothing
 * else in this file needs to change when that happens.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uptechconsulting.com";

if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV !== "test") {
  console.warn(
    "[siteUrl] NEXT_PUBLIC_SITE_URL isn't set — sitemap.xml, robots.txt, and social-share previews are using a placeholder domain (uptechconsulting.com), not a confirmed one. Set it before the real deployment.",
  );
}
