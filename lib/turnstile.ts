const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/*
 * Server-side verification for CLAUDE.md Section 7's "bot protection on all
 * public forms" requirement. Mirrors lib/resend.ts's missing-key posture:
 * if TURNSTILE_SECRET_KEY isn't configured yet, this no-ops (logs a warning,
 * lets the submission through) instead of hard-blocking every real visitor
 * because a key hasn't been set up in Cloudflare yet. Once the key is set,
 * a missing/invalid token is treated as a real failure.
 */
export async function verifyTurnstile(token: string | null, remoteIp: string): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — skipping bot-protection check.");
    return { ok: true };
  }

  if (!token) {
    return { ok: false, reason: "Missing verification token." };
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
    });
    const data = (await response.json()) as { success: boolean };
    return data.success ? { ok: true } : { ok: false, reason: "Verification failed." };
  } catch (error) {
    console.error("[turnstile] Verification request failed:", error);
    return { ok: false, reason: "Verification request failed." };
  }
}
