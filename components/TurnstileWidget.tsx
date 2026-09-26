"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

/*
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set — the
 * server-side verifyTurnstile() helper (lib/turnstile.ts) no-ops the same
 * way when its secret key is missing, so a form using this widget still
 * works end-to-end locally before real Cloudflare keys exist, matching this
 * codebase's existing missing-config posture (see lib/resend.ts).
 */
export function TurnstileWidget({ onVerify }: { onVerify: (token: string | null) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerId = `turnstile-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!siteKey || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
      sitekey: siteKey,
      callback: (token: string) => onVerify(token),
      "expired-callback": () => onVerify(null),
      "error-callback": () => onVerify(null),
    });
  }, [siteKey, containerId, onVerify]);

  useEffect(() => {
    // Covers the case where the script already finished loading on a
    // previous mount (e.g. the modal was closed and reopened) — Script's
    // onReady only fires once per page load, not on every remount.
    renderWidget();
  }, [renderWidget]);

  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" onReady={renderWidget} />
      <div id={containerId} />
    </>
  );
}
