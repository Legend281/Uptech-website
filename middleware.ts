import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Optional admin-subdomain routing (e.g. control.uptechoutsourcing.com) —
 * same "unset = no-op, behaves exactly as before" posture as every other
 * optional integration in this project (Turnstile, Sentry, Resend, Google
 * Reviews). Unset locally and in any environment whose DNS/hosting for the
 * subdomain isn't wired up yet — every check below short-circuits to false
 * and the admin stays reachable at /admin on whatever host serves the app.
 */
const ADMIN_HOSTNAME = process.env.ADMIN_HOSTNAME;

/*
 * Admin_Dashboard_Requirements.md Section 9: "All dashboard routes protected
 * — no dashboard page should be reachable without authentication, including
 * via direct URL." Before this, every /admin/* page was reachable by anyone
 * who typed the URL — CurrentUserProvider was explicitly documented as "a UI
 * preview convenience... nothing gates any route."
 *
 * Runs on the Edge runtime before any /admin page renders. Must return the
 * `supabaseResponse` object (not a fresh NextResponse) so a refreshed auth
 * cookie actually reaches the browser — this is the standard @supabase/ssr
 * Next.js middleware shape, not a local variation.
 */
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];
  const onAdminHost = Boolean(ADMIN_HOSTNAME && hostname === ADMIN_HOSTNAME);
  const realPath = request.nextUrl.pathname;

  // Once the subdomain is configured, the main domain should never serve
  // /admin directly — a stray bookmark/link gets sent to the one real place
  // staff should be logging in from, not left pointing at two.
  if (ADMIN_HOSTNAME && !onAdminHost && realPath.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.hostname = ADMIN_HOSTNAME;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // The subdomain serves /admin/* at its own root, so a bare "/" (or any
  // path a visitor types without the prefix) resolves to the dashboard
  // instead of 404ing. Real internal admin links already include the
  // /admin prefix and pass through unchanged — this only rewrites the
  // entry point, it doesn't try to strip /admin from every subsequent URL.
  const logicalPath = onAdminHost && !realPath.startsWith("/admin") ? (realPath === "/" ? "/admin" : `/admin${realPath}`) : realPath;

  if (!onAdminHost && !realPath.startsWith("/admin")) {
    // Not an admin request on any host — nothing below this line applies.
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = logicalPath;
  const rewriteNeeded = logicalPath !== realPath;
  const buildResponse = () => (rewriteNeeded ? NextResponse.rewrite(rewriteUrl, { request }) : NextResponse.next({ request }));

  let supabaseResponse = buildResponse();

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = buildResponse();
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = logicalPath === "/admin/login";
  // A staff invite link's session token only gets exchanged client-side
  // (Supabase puts it in the URL hash, which never reaches this server-side
  // check) — redirecting this path before that JS runs would strand every
  // invite on /admin/login and drop the token entirely.
  const isSetPasswordPage = logicalPath === "/admin/set-password";

  if (!user && !isLoginPage && !isSetPasswordPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
