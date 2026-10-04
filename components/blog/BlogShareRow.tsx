"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const iconButtonClasses =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-navy-950";

// lucide-react ships no brand/logo icons by design — same path data as the
// footer's own LinkedIn glyph (components/Footer.tsx), so this matches
// rather than introduces a second LinkedIn mark.
function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.738-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

/** Share links need no JS at all (they're plain share-intent URLs) except "copy link," which is why only this one small island is a client component rather than the whole page. */
export function BlogShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable — the link is still visible in the address bar, so this is a nice-to-have, not a failure worth surfacing.
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={iconButtonClasses}
      >
        <LinkedInGlyph />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={iconButtonClasses}
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
      <button type="button" onClick={copyLink} aria-label="Copy link" className={iconButtonClasses}>
        {copied ? <Check className="h-4 w-4 text-emerald-600" strokeWidth={2} /> : <Link2 className="h-4 w-4" strokeWidth={2} />}
      </button>
    </div>
  );
}
