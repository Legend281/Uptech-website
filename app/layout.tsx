import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/*
 * Material Symbols is self-hosted from public/fonts/ via a plain <style>
 * @font-face below — deliberately NOT next/font (google or local) and NOT a
 * runtime <link> to fonts.googleapis.com/fonts.gstatic.com. Two separate
 * problems ruled those out:
 *
 * 1. The old <link> fetched the icon font cross-origin from the browser at
 *    runtime, which some networks/browsers (Chrome's Private Network Access
 *    checks, corporate proxies, certain VPNs) block outright with a CORS
 *    error, breaking every icon on the page.
 * 2. `next/font/google` doesn't export Material Symbols at all. Routing the
 *    same file through `next/font/local` instead compiled, but Next's font
 *    pipeline silently produced a broken woff2 for this specific font —
 *    fontkit even threw trying to read its metrics for CLS-fallback
 *    generation (worked around once with `adjustFontFallback: false`), and
 *    even with that, Chrome reported the resulting FontFace `status:
 *    "error"` and every icon rendered as literal fallback text
 *    ("arrow_forward" instead of the arrow glyph). Next's local-font
 *    pipeline evidently doesn't handle this kind of non-text/ligature
 *    variable font correctly, whatever it's doing to the file.
 *
 * Serving the untouched file as a plain static asset (like the photos in
 * public/images/) sidesteps both: same-origin (no CORS) and completely
 * unprocessed (no corruption). `basePath` is threaded through manually
 * because raw CSS `url()` values are the one asset type Next's basePath
 * rewriting does NOT reach automatically (see lib/pagesImageLoader.js for
 * the identical problem on next/image under the GitHub Pages preview).
 *
 * This is the static weight-400 instance (~320KB), not the full variable
 * font (~3.9MB covering the opsz/wght/FILL/GRAD axis ranges) the old <link>
 * loaded — nothing in this codebase sets font-variation-settings or a
 * non-400 weight on .material-symbols-outlined, so every icon already
 * renders at this exact axis point today. The smaller file is a genuine
 * improvement for this site's mobile/low-bandwidth audience (CLAUDE.md
 * Section 6.9), not just an artifact of working around a flaky download.
 */
const fontsBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: {
    default: "Uptech Consulting & Outsourcing",
    template: "%s — Uptech Consulting & Outsourcing",
  },
  description:
    "IT consulting, business formalisation & compliance, and career marketing & placement — bridging Cameroon and the United States.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `@font-face {
  font-family: "Material Symbols Outlined Self Hosted";
  src: url("${fontsBasePath}/fonts/material-symbols-outlined.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
