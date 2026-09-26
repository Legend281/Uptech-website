/*
 * Best-effort in-memory rate limit, shared by every public API route that
 * needs one (CLAUDE.md Section 7). Per-server-instance memory: fine for a
 * single Node process (Hostinger, per CLAUDE.md's actual hosting choice),
 * but it resets on redeploy and won't coordinate across multiple instances.
 * A real multi-instance deployment would need a shared store (e.g. Upstash
 * Redis) instead — flagging that rather than pretending this is bulletproof.
 */
const submissionsByKey = new Map<string, number[]>();

export function isRateLimited(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const recent = (submissionsByKey.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  submissionsByKey.set(key, recent);
  return recent.length > max;
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
