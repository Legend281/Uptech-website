import type { AdminUser } from "./types";

/*
 * A shared, generic content-management gate — Administrator and Editor may
 * create/edit/publish/delete. Job Postings and Additional Services both use
 * this; their Supabase RLS enforces the same boundary (role in
 * ('administrator','editor')). Written as an explicit allowlist so an
 * unexpected role value fails closed rather than open.
 *
 * Department-scoped modules (Testimonials, FAQ Items) need a finer rule
 * than this and already have their own purpose-built helper
 * (canManageTestimonial, canManageFaqCategory) — use those there instead,
 * not this.
 */
export function canManageContent(user: AdminUser): boolean {
  return user.role === "administrator" || user.role === "editor";
}
