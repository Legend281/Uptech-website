import type { ReactNode } from "react";

/*
 * FAQ answers support light formatting (Admin_Content_Pages_Spec.md 3.1 —
 * compliance answers need to point at forms, deadlines and filing portals):
 *
 *   blank line          new paragraph
 *   "- " at line start  bullet point
 *   **text**            bold
 *   [text](url)         link — https:, mailto:, tel:, or a site path "/..."
 *
 * Rendered to React elements, never injected as HTML, so an answer can't
 * carry markup or scripts. A link with any other scheme (javascript:, data:,
 * plain http:) is shown as its text only. Existing plain-text answers
 * render exactly as before: one paragraph.
 */

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function isSafeFaqHref(href: string): boolean {
  return /^(https:\/\/|mailto:|tel:)/i.test(href) || (href.startsWith("/") && !href.startsWith("//"));
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${match.index}`;
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-slate-800">
          {match[1]}
        </strong>,
      );
    } else {
      const [label, href] = [match[2], match[3]];
      if (isSafeFaqHref(href)) {
        const external = href.startsWith("https://");
        nodes.push(
          <a
            key={key}
            href={href}
            className="font-semibold text-blue-accent underline-offset-2 hover:underline"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(label);
      }
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function FaqAnswer({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
        if (isList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.slice(2), `${blockIndex}-${lineIndex}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={blockIndex}>{renderInline(lines.join(" "), `${blockIndex}`)}</p>;
      })}
    </div>
  );
}
