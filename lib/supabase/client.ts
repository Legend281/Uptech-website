"use client";

import { createBrowserClient } from "@supabase/ssr";

/*
 * The one Supabase client every admin client component uses — auth session,
 * leads reads/writes, staff profile reads, resume downloads. createBrowserClient
 * (not the plain supabase-js createClient lib/supabase/server.ts's anon
 * client uses) also mirrors the session into a cookie, which is what lets
 * middleware.ts read it on the next request to gate /admin routes.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set (see .env.local).");
  }

  return createBrowserClient(url, anonKey);
}

/** Plain-language version of a database refusal, for toasts. */
export function describeDbError(error: { message?: string; code?: string } | null | undefined): string {
  if (!error) return "Something went wrong.";
  if (error.code === "42501" || /row-level security|permission denied/i.test(error.message ?? "")) {
    return "You don't have permission to do that. Sign in with a staff account that's registered as staff.";
  }
  // The database's own rules for testimonials, in words (supabase/002).
  if (/testimonials_publish_requires_consent/.test(error.message ?? "")) return "Record the client's consent before publishing.";
  if (/testimonials_outcome_requires_lead/.test(error.message ?? "")) {
    return "An outcome line needs a linked lead from the database and a signed consent form. Remove the outcome line to publish.";
  }
  if (/testimonials_attribution_fields/.test(error.message ?? "")) return "The name fields don't match the attribution you chose.";
  // Our own trigger messages (e.g. the review gate) are already written for people.
  return error.message || "Something went wrong.";
}

/** Public URL for a file in one of the public photo buckets. */
export function publicPhotoUrl(bucket: "testimonial-photos" | "team-photos", path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return getSupabaseBrowserClient().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Uploads a resized data-URL image and returns its storage path. */
export async function uploadDataUrl(bucket: "testimonial-photos" | "team-photos", dataUrl: string, prefix: string): Promise<string> {
  // Decoded by hand rather than fetch(dataUrl), which the CSP's connect-src would block.
  const [header, base64] = dataUrl.split(",");
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg" });
  const path = `${prefix}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await getSupabaseBrowserClient().storage.from(bucket).upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw new Error(describeDbError(error));
  return path;
}
