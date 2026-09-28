/*
 * Client-side error monitoring — deliberately scoped to /admin only.
 *
 * Every real bug this project has hit was in the admin dashboard (the
 * login incident, unscrollable modals, the Change Password bug) — none
 * were on the public marketing site. Loading Sentry's client SDK
 * unconditionally added ~67KB to every public page's First Load JS
 * (175KB -> 242KB on the homepage, measured directly), which fights a
 * real, explicit constraint: CLAUDE.md Section 6.7 treats low-bandwidth
 * Cameroon mobile as a hard requirement, not a preference.
 *
 * The dynamic import() below means Sentry's SDK is its own separate
 * chunk, only fetched when this actually runs on an /admin page — a
 * public visitor's bundle never includes it at all. Entirely inert
 * either way until NEXT_PUBLIC_SENTRY_DSN is set (same graceful
 * degradation as every other optional integration here).
 *
 * Session Replay stays off on purpose: this dashboard handles real staff
 * passwords and sensitive Onboarding fields (DOB, immigration status),
 * and screen-recording that surface isn't worth the exposure.
 */
const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

if (isAdminRoute) {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  });
}

// Next.js calls this on every client-side route transition, admin or not
// — only worth acting on (and only worth paying for the Sentry chunk) on
// an /admin page, where it was already loaded above.
export function onRouterTransitionStart(href: string, navigationType: string) {
  if (!isAdminRoute) return;
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureRouterTransitionStart(href, navigationType);
  });
}
