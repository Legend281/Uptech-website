/*
 * Rule-based pre-filter for the two public forms (Contact, Apply) — catches
 * obvious junk Turnstile doesn't (a human typing garbage, or a throwaway
 * email address), without needing an AI call or any external service.
 * Every check here is deliberately conservative: French is an official
 * language and real names carry accents, hyphens, and apostrophes, so
 * these only reject what's clearly not a real submission, never anything
 * merely unusual-looking.
 */

// A small, maintainable set of well-known disposable/throwaway email
// providers — not exhaustive (new ones appear constantly), but catches the
// common ones someone reaches for to avoid giving a real address.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "mailnesia.com",
  "mintemail.com",
  "moakt.com",
  "spambog.com",
  "tempinbox.com",
  "emailondeck.com",
  "mohmal.com",
  "discard.email",
  "discardmail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

/**
 * Only catches obvious garbage — no letters at all (any script, so accented
 * French names pass fine), or the same character repeated 4+ times in a
 * row ("aaaa", "1111"), or a string that's mostly non-letters. A short or
 * unusual-looking real name never trips this.
 */
export function looksLikeGibberishName(name: string): boolean {
  const trimmed = name.trim();
  if (!/\p{L}/u.test(trimmed)) return true;
  if (/(.)\1{3,}/u.test(trimmed)) return true;
  const withoutSpaces = trimmed.replace(/\s/gu, "");
  const letterCount = (withoutSpaces.match(/\p{L}/gu) ?? []).length;
  return withoutSpaces.length > 0 && letterCount / withoutSpaces.length < 0.5;
}

/**
 * Flags a message that's overwhelmingly links (a common spam pattern),
 * never one that simply includes a relevant link — needs 2+ URLs AND more
 * than half the message to actually be link text before it trips.
 */
export function isLinkHeavyMessage(message: string): boolean {
  const urls = message.match(/https?:\/\/\S+|www\.\S+/giu) ?? [];
  if (urls.length < 2) return false;
  const linkChars = urls.join("").length;
  return linkChars / message.length > 0.5;
}
