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
 * escape hatch: it still skips real optimization (returns the source file
 * as-is, no query string, no resizing), but it runs for every <Image> in the
 * app, so this is the one place that needs to know about the subpath.
 */
export default function pagesImageLoader({ src }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${src}`;
}
