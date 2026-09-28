import type { AdminUser } from "./types";

/*
 * A shared, generic content-management gate — Administrator and Editor may
 * create/edit/publish/delete; Viewer is read-only. Job Postings and
 * Additional Services both use this: their Supabase RLS already enforces
 * exactly this boundary (role in ('administrator','editor')), but neither
 * admin page ever checked it client-side, so a Viewer saw the same
 * Add/Edit/Publish/Delete controls an Administrator does and only found out
 * they couldn't use them from a raw Supabase error after clicking one.
 *
 * Department-scoped modules (Testimonials, FAQ Items) need a finer rule
 * than this and already have their own purpose-built helper
 * (canManageTestimonial, canManageFaqCategory) — use those there instead,
 * not this.
 */
export function canManageContent(user: AdminUser): boolean {
  return user.role === "administrator" || user.role === "editor";
}
