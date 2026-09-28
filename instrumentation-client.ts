import * as Sentry from "@sentry/nextjs";

/*
 * Client-side error monitoring. Entirely inert — Sentry.init with an
 * undefined dsn sends nothing — until NEXT_PUBLIC_SENTRY_DSN is set, same
 * graceful-degradation posture as every other optional integration here
 * (Resend, Turnstile). Free at sentry.io: create a project (platform:
 * Next.js), the DSN is shown immediately, no card required on the free tier.
 *
 * Session Replay is deliberately not enabled: this dashboard handles real
 * staff passwords, DOB, and other sensitive fields (Client Onboarding —
 * supabase/022_onboarding_submissions.sql), and screen-recording that
 * surface for debugging isn't worth the exposure.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
