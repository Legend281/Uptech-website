import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { requireStaff } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/*
 * Public pages are prerendered, so a publish in the dashboard only reaches
 * visitors once the affected page is rebuilt. The dashboard calls this
 * after every change that can alter a public page. Any active Editor or
 * Administrator may ask; only pages that actually render dashboard content
 * can be named.
 */
const ALLOWED_PATHS = new Set([
  "/",
  "/who-we-are",
  "/services",
  "/services/career-marketing-placement",
  "/services/business-formalisation-compliance/cameroon",
  "/services/business-formalisation-compliance/united-states",
  "/services/business-formalisation-compliance/tax-compliance-businesses-cameroon",
  "/services/business-formalisation-compliance/cnps-compliance-cameroon",
  "/blog",
]);

// Blog slugs are staff-chosen at post-creation time, so they can't be
// listed individually like the fixed pages above — matched by shape
// instead. slugify() (lib/admin/blog.ts) only ever produces lowercase
// letters, digits, and hyphens, so this can't be used to revalidate
// anything outside /blog/*.
const BLOG_POST_PATH = /^\/blog\/[a-z0-9]+(-[a-z0-9]+)*$/;

function isAllowedPath(path: string): boolean {
  return ALLOWED_PATHS.has(path) || BLOG_POST_PATH.test(path);
}

export async function POST(request: NextRequest) {
  const caller = await requireStaff(request);
  if (caller instanceof NextResponse) return caller;
  if (caller.role === "viewer") return NextResponse.json({ error: "Viewers can't change the site." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { paths?: unknown } | null;
  const paths = Array.isArray(body?.paths) ? body.paths.filter((p): p is string => typeof p === "string" && isAllowedPath(p)) : [];
  for (const path of paths) revalidatePath(path);
  return NextResponse.json({ revalidated: paths });
}
