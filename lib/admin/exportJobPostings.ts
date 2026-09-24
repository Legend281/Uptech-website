import type { JobPosting } from "./types";

/** The exact shape components/OpenPositions.tsx expects — field names matched on purpose (employmentType → type) so this output can be dropped straight into the public site's data with no manual reshaping. */
export type PublicJobPosting = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string[];
};

function toPublicShape(posting: JobPosting): PublicJobPosting {
  return {
    title: posting.title,
    department: posting.department,
    location: posting.location,
    type: posting.employmentType,
    description: posting.description,
    requirements: posting.requirements.length > 0 ? posting.requirements : undefined,
  };
}

/**
 * Hard-filters to Published, by construction, not by caller discipline — a
 * Draft can never end up in what gets copied to the live site through this
 * function, even if a caller passes the full unfiltered list in by mistake.
 */
export function downloadPublishedPostingsJson(postings: JobPosting[], filename = "job-postings.json") {
  const published = postings.filter((posting) => posting.status === "published").map(toPublicShape);
  const blob = new Blob([JSON.stringify(published, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
