import { SITE_URL } from "@/lib/siteUrl";
import { getPublishedBlogPosts } from "@/lib/blog";

// Same reasoning as sitemap.ts/robots.ts: no real per-request dynamism, and
// `output: "export"` refuses to build this route without it.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/*
 * A plain RSS 2.0 feed — the one standard blog primitive that was missing
 * entirely. Nobody on this team currently consumes it, but it's what lets
 * feed readers, aggregators, and some SEO tooling discover new posts
 * without polling the HTML page, and costs nothing to ship. Summaries only
 * (post.excerpt), not full sanitized HTML content — keeps this simple and
 * valid without needing CDATA-wrapped rich content.
 */
export async function GET() {
  const posts = await getPublishedBlogPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.authorName)}</dc:creator>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Uptech Consulting Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Updates, guidance, and perspective from Uptech Consulting on career placement, business formalisation, and compliance across Cameroon and the United States.</description>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
