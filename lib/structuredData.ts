import { SITE_URL } from "@/lib/siteUrl";

/*
 * schema.org JSON-LD builders — plain data, no JSX. Every field here is
 * either a fact already published elsewhere on the site (the real WhatsApp
 * number used sitewide, infos@uptechconsulting.com, the real logo) or
 * standard schema.org boilerplate. Nothing invented: no street address
 * (never confirmed beyond city/country), no social profiles (none exist
 * yet — CLAUDE.md's "never fabricate" rule applies to structured data
 * exactly as much as visible copy, since Google treats both as claims
 * about the business).
 */

const WHATSAPP_PHONE = "+237678597593";
const CONTACT_EMAIL = "infos@uptechconsulting.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Uptech Consulting & Outsourcing",
    url: SITE_URL,
    logo: `${SITE_URL}/UPTECH_LOG.png`,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: WHATSAPP_PHONE,
        email: CONTACT_EMAIL,
        areaServed: ["CM", "US"],
      },
    ],
    // Two real, distinct locations (Cameroon S.A. + USA S-Corp) — city/country
    // only, since no exact street address has ever been confirmed.
    location: [
      { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Buea", addressCountry: "CM" } },
      { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Stafford", addressRegion: "TX", addressCountry: "US" } },
    ],
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      // The current (last) crumb has no href in the visible Breadcrumb
      // component either — schema.org allows an itemListElement's last
      // entry to omit `item` for the current page.
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function jobPostingJsonLd(posting: {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  datePosted: string;
  validThrough?: string;
}) {
  // Google's employment-type enum is a fixed vocabulary — best-effort map
  // from this project's free-text employment_type column rather than a
  // hard requirement staff have to conform to when posting a role.
  const typeMap: Record<string, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACT",
    internship: "INTERN",
    temporary: "TEMPORARY",
  };
  const employmentType = typeMap[posting.employmentType.toLowerCase().replace(/\s+/g, "-")] ?? "OTHER";
  // Google's spec rejects "Remote" as a postal address locality — a fully
  // remote role needs jobLocationType instead of a jobLocation at all.
  const isRemote = /remote/i.test(posting.location);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: posting.title,
    description: posting.description,
    datePosted: posting.datePosted,
    ...(posting.validThrough ? { validThrough: posting.validThrough } : {}),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "Uptech Consulting & Outsourcing",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/UPTECH_LOG.png`,
    },
    // The admin dashboard's `location` field is one free-text string (e.g.
    // "Third Floor, Blackrose Building, Molyko Buea"), not separate
    // street/city/country fields, so it lands whole in addressLocality
    // rather than split into schema.org's finer-grained address parts.
    // Google may flag the missing addressCountry as an incompleteness
    // warning; that's a real limitation of the source data, not something
    // to paper over by guessing a country from the text.
    ...(isRemote
      ? { jobLocationType: "TELECOMMUTE" }
      : {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: posting.location },
          },
        }),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  coverImage?: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    // A real staff name by default (the admin form pre-fills the signed-in
    // author), so Person is the correct schema.org type here — not
    // Organization, which would misrepresent an individual byline.
    author: { "@type": "Person", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: "Uptech Consulting & Outsourcing",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/UPTECH_LOG.png` },
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };
}
