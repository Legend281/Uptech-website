import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// No per-request dynamism here (no cookies/headers/search params) — this
// content is genuinely the same for every visitor and every build, so
// forcing static rendering is a true fact about the route, not a static-
// export-only workaround. Also required: `output: "export"` (the GitHub
// Pages preview build) refuses to build this route without it.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
