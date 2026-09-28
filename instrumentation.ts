import * as Sentry from "@sentry/nextjs";

/*
 * Server/edge-side counterpart to instrumentation-client.ts. Next.js calls
 * register() once per runtime on startup; same DSN-gated no-op behavior.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
