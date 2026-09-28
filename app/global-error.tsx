"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

/*
 * Sentry's own recommended pattern: this is the only error boundary that
 * sits above the root layout, so it's the sole place that catches a crash
 * in the layout itself (everything else is already inside it). Renders a
 * bare fallback rather than this site's own styled error UI on purpose —
 * globals.css and the fonts may be exactly what failed to load.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
