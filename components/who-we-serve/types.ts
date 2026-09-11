import type { FaqItem } from "@/components/FaqAccordion";
import type { images } from "@/lib/images";

export type ImageKey = keyof typeof images;

/**
 * Icon keys rather than lucide components: the card grid is a client
 * component, and a component reference cannot cross the server → client
 * boundary. The grid resolves the key itself.
 */
export type WayIcon = "briefcase" | "receipt" | "rocket" | "server" | "shield-check" | "users";

export type Way = {
  key: string;
  icon: WayIcon;
  title: string;
  /** Short scope qualifier shown on the card, e.g. "IT & tech roles only". */
  scope?: string;
  description: string;
  /** Destination page. Omit for a pillar that is named but not currently offered. */
  href?: string;
  /** Shown in place of "Learn more" when there is no destination. */
  status?: string;
};

export type PersonaContent = {
  slug: "individuals" | "businesses";
  breadcrumbLabel: string;
  breadcrumbTag: string;
  hero: {
    eyebrow: string;
    /** Three lines: plain, teal, sky — the site-wide hero rhythm. */
    headline: [string, string, string];
    lead: string;
    /** A scope disclosure that must be read before the cards, not after. */
    note: string;
    situations: string[];
    image: ImageKey;
  };
  ways: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Way[];
    /** Shown when more than one card is selected. */
    multiNeedMessage: string;
    /** Shown when the single selected card has no destination page. */
    noDestinationMessage: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    pointsHeading: string;
    points: string[];
    image: ImageKey;
  };
  faq: FaqItem[];
  close: {
    heading: string;
    body: string;
  };
  /** One label for every consultation CTA on the page, so the ask never changes mid-scroll. */
  ctaLabel: string;
};
