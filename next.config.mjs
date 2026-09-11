import { fileURLToPath } from "node:url";
import path from "node:path";

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/*
 * GitHub Pages preview only (CLAUDE.md Section 2: real hosting is Hostinger
 * Node.js — this branch must never fire there). Set only by
 * .github/workflows/github-pages-preview.yml, never locally and never in the
 * Hostinger build. When on, this becomes a static HTML export served from a
 * project-page subpath (https://<user>.github.io/Uptech-website/) instead of
 * a Next.js server: no image optimization server, no custom headers (GitHub
 * Pages serves plain static files — CSP/HSTS below simply cannot apply
 * there), and every internal link needs the repo name prefixed on it.
 *
 * `basePath` handles that prefixing automatically for next/link and for
 * Next's own framework assets — but NOT for next/image's `unoptimized`
 * mode, which renders raw `<img src>` from the string exactly as written in
 * lib/images.ts, unprefixed (verified against an actual export: every photo
 * and the logo 404). lib/pagesImageLoader.js is the fix for that half.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/*
 * script-src must allow inline scripts.
 *
 * The App Router ships the streamed RSC payload inside inline
 * `self.__next_f.push(...)` script tags. Under a bare `script-src 'self'`
 * the browser blocks every one of them and each page renders as a blank
 * white document in production — verified in a real browser, and the reason
 * this comment exists.
 *
 * The stricter alternative is a per-request nonce set from middleware, but a
 * nonce cannot be baked into prerendered HTML, so it forces every page to
 * render dynamically. That would cost the edge-cacheable static HTML this
 * site's Cameroon mobile audience depends on (CLAUDE.md Section 6.7), in
 * exchange for hardening a page that currently renders no user-supplied
 * content at all.
 *
 * REVISIT when the lead-capture form and admin dashboard land: once
 * user-supplied content is rendered, switch to the nonce middleware and
 * accept dynamic rendering.
 */
const scriptSrc = isProd
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-eval' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // `data:` covers the LQIP blur placeholders generated for each photo.
  "img-src 'self' data:",
  isProd ? "connect-src 'self'" : "connect-src 'self' ws:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig = {
  /*
   * `next build` and `next dev` write incompatible output to the same folder.
   * Running a build while a dev server is up leaves the dev bundler resolving
   * chunks against production artifacts, which fails as
   * "Cannot find module './331.js'" and takes the whole site down until
   * `.next` is deleted.
   *
   * Defaults to `.next`, so production is unaffected. Set NEXT_DIST_DIR to
   * verify a build without disturbing a running dev server:
   *   NEXT_DIST_DIR=.next-verify npm run build
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // An unrelated package-lock.json in the user's home directory otherwise
  // makes Next.js misdetect the workspace root.
  outputFileTracingRoot: projectRoot,

  ...(isStaticExport
    ? {
        output: "export",
        basePath: pagesBasePath,
        // No optimization server exists on GitHub Pages, so this can't be
        // the default loader — but plain `unoptimized: true` drops basePath
        // prefixing too (see comment above), hence the custom loader.
        // Hostinger runs a real Next.js server, so neither applies there —
        // CLAUDE.md Section 6.9 wants real optimization on the real site.
        images: { loader: "custom", loaderFile: "./lib/pagesImageLoader.js" },
      }
    : {}),

  async headers() {
    // `output: "export"` cannot serve custom headers at all — there's no
    // server to run this function. Skip it outright rather than let Next.js
    // build a static site that silently ships without the CSP/HSTS headers
    // CLAUDE.md Section 7 requires on the real deployment.
    if (isStaticExport) return [];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
