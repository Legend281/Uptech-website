/*
 * Custom next/image loader used only for the GitHub Pages static-export
 * preview (see next.config.mjs's STATIC_EXPORT branch). Not used anywhere
 * else — the real Hostinger deployment keeps the default Next.js
 * Image Optimization server.
 *
 * GitHub Pages serves this site from a repo subpath
 * (https://<user>.github.io/Uptech-website/...), and next/image's built-in
 * `unoptimized: true` mode renders a plain `<img src>` from the string
 * exactly as given in `lib/images.ts` (e.g. "/images/ops-center.webp") with
 * NO basePath prefix applied — verified against an actual export, every
 * photo and the logo 404 without this. A custom loader is the documented
 * escape hatch: it still runs for every <Image> in the app, so this is the
 * one place that needs to know about the subpath.
 *
 * It also has to stand in for the optimization server GitHub Pages doesn't
 * have. next/image still builds a full responsive `srcset` (640w..3840w)
 * and asks this loader for a URL at each width — a first version of this
 * loader ignored `width` entirely and returned the same master file for
 * every entry, so a phone downloaded the exact same bytes as a 4K monitor
 * (confirmed against the live preview: every srcset descriptor pointed at
 * an identical URL). scripts/prep-real-images.mjs now bakes real 640w/1200w
 * WebP companions alongside each master, and this picks the smallest one
 * that still covers the requested width, falling back to the master for
 * anything larger.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Keys that have -640/-1200 companions on disk (see BREAKPOINTS in
// scripts/prep-real-images.mjs). Partner logos and anything else under
// /images/ don't — they're already small, so they pass straight through.
const HAS_VARIANTS = new Set([
  "ops-center",
  "dedicated-advisor",
  "career-review",
  "compliance-advisory",
  "it-advisory",
  "cross-border-boardroom",
  "infrastructure-corridor",
  "team-lineup",
  "team-lounge",
  "team-presenting",
]);

const BREAKPOINTS = [640, 1200];

export default function pagesImageLoader({ src, width }) {
  const match = /^\/images\/([\w-]+)\.webp$/.exec(src);
  const key = match?.[1];

  if (key && HAS_VARIANTS.has(key)) {
    const bucket = BREAKPOINTS.find((bp) => width <= bp);
    if (bucket) {
      return `${BASE_PATH}/images/${key}-${bucket}.webp`;
    }
  }

  return `${BASE_PATH}${src}`;
}
