import DOMPurify from "isomorphic-dompurify";

/*
 * Blog post bodies are the first place in this codebase that renders raw
 * HTML from admin-authored content (everywhere else — FAQ answers, job
 * descriptions, testimonial quotes — is plain text, auto-escaped by React
 * interpolation). Staff write it through a rich text editor behind
 * Supabase Auth + RLS, but sanitizing server-side before it ever reaches a
 * visitor's browser is real defense in depth: a compromised staff account
 * or an editor bug producing unexpected markup shouldn't be able to run
 * script in every visitor's browser, not just the dashboard.
 *
 * Allowlist matches exactly what components/admin/RichTextEditor.tsx's
 * toolbar can actually produce — nothing wider than that.
 */
const ALLOWED_TAGS = ["p", "h2", "h3", "strong", "em", "a", "ul", "ol", "li", "blockquote", "img", "br", "code", "pre"];
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt"];

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
