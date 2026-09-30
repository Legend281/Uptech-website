import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getPublishedBlogPosts } from "@/lib/blog";

/*
 * Deliberately excludes two real routes:
 * - /services/it-consulting-outsourcing: paused by leadership decision,
 *   soft-hidden sitewide (CLAUDE.md Section 5/9) — a sitemap entry is an
 *   active "please index this" signal, which would work against that
 *   decision. The page stays live at its URL; it just isn't promoted here.
 * - /services/business-formalisation-compliance/tax-compliance-individuals-cameroon:
 *   a redirect stub to the unified Tax Compliance page, not a real page.
 *
 * All /admin/* routes are excluded entirely — private, and already
 * disallowed in robots.ts.
 */
// Same reasoning as robots.ts: no real per-request dynamism, and
// `output: "export"` refuses to build this route without it.
export const dynamic = "force-static";

const routes = [
  "",
  "/contact",
  "/careers",
  "/who-we-are",
  "/who-we-serve",
  "/who-we-serve/businesses",
  "/who-we-serve/individuals",
  "/services",
  "/services/career-marketing-placement",
  "/services/business-formalisation-compliance",
  "/services/business-formalisation-compliance/cameroon",
  "/services/business-formalisation-compliance/united-states",
  "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  "/privacy-policy",
  "/terms-of-service",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Real published posts only — this runs at build time (force-static
  // above), so a post added after the last build won't appear here until
  // the next one. Acceptable for a sitemap; the post itself is still
  // reachable and indexable via its own page and the /blog listing.
  const posts = await getPublishedBlogPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
