import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  // A staff invite link's session token only gets exchanged client-side
  // (Supabase puts it in the URL hash, which never reaches this server-side
  // check) — redirecting this path before that JS runs would strand every
  // invite on /admin/login and drop the token entirely.
  const isSetPasswordPage = request.nextUrl.pathname === "/admin/set-password";

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
  matcher: ["/admin/:path*"],
};
