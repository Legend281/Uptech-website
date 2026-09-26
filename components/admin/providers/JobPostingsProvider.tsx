"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { JobPosting, JobPostingStatus } from "@/lib/admin/types";

/*
 * Real Supabase reads/writes — replaces the old localStorage-only store.
 * Publishing a posting here is what makes it live on the public Careers
 * page (app/careers/page.tsx reads status = 'published' rows directly),
 * so this is the one admin data type where "save" has a real, immediate
 * public-facing effect, not just an internal record.
 *
 * Same optimistic-write posture as LeadsProvider: update local state
 * immediately, fire the Supabase call after, log (don't retry/rollback) on
 * failure — see that file's own comment for why.
 */

type JobPostingRow = {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string[];
  status: JobPostingStatus;
  posted_at: string;
  posted_by_id: string | null;
  contact_email: string | null;
  apply_url: string | null;
  applications_received: number;
  notes: string | null;
  closing_date: string | null;
};

function fromRow(row: JobPostingRow): JobPosting {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type,
    description: row.description,
    requirements: row.requirements,
    status: row.status,
    postedAt: row.posted_at,
    postedById: row.posted_by_id ?? "",
    contactEmail: row.contact_email ?? undefined,
    applyUrl: row.apply_url ?? undefined,
    applicationsReceived: row.applications_received,
    notes: row.notes ?? undefined,
    closingDate: row.closing_date ?? undefined,
  };
}

/** Everything but id/status/postedAt/postedById/applicationsReceived — those are set by the provider, not typed in from the form. */
export type NewJobPostingInput = Pick<
  JobPosting,
  "title" | "department" | "location" | "employmentType" | "description" | "requirements" | "contactEmail" | "applyUrl" | "closingDate"
>;

type JobPostingsContextValue = {
  postings: JobPosting[];
  addPosting: (input: NewJobPostingInput, postedById: string) => Promise<JobPosting>;
  editPosting: (id: string, input: NewJobPostingInput) => void;
  deletePosting: (id: string) => void;
  setStatus: (id: string, status: JobPostingStatus) => void;
  clonePosting: (id: string, postedById: string) => Promise<JobPosting>;
  updateApplications: (id: string, applicationsReceived: number, notes: string | undefined) => void;
};

const JobPostingsContext = createContext<JobPostingsContextValue | null>(null);

export function JobPostingsProvider({ children }: { children: ReactNode }) {
  const [postings, setPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("job_postings")
      .select("*")
      .order("posted_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[job-postings] Failed to load postings:", error);
          return;
        }
        setPostings((data as JobPostingRow[]).map(fromRow));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updatePosting(id: string, patch: Partial<JobPosting>) {
    setPostings((prev) => prev.map((posting) => (posting.id === id ? { ...posting, ...patch } : posting)));

    const row: Record<string, unknown> = {};
    if ("title" in patch) row.title = patch.title;
    if ("department" in patch) row.department = patch.department;
    if ("location" in patch) row.location = patch.location;
    if ("employmentType" in patch) row.employment_type = patch.employmentType;
    if ("description" in patch) row.description = patch.description;
    if ("requirements" in patch) row.requirements = patch.requirements;
    if ("contactEmail" in patch) row.contact_email = patch.contactEmail ?? null;
    if ("applyUrl" in patch) row.apply_url = patch.applyUrl ?? null;
    if ("status" in patch) row.status = patch.status;
    if ("applicationsReceived" in patch) row.applications_received = patch.applicationsReceived;
    if ("notes" in patch) row.notes = patch.notes ?? null;
    if ("closingDate" in patch) row.closing_date = patch.closingDate ?? null;

    getSupabaseBrowserClient()
      .from("job_postings")
      .update(row)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[job-postings] Failed to save update for posting ${id}:`, error);
      });
  }

  async function addPosting(input: NewJobPostingInput, postedById: string): Promise<JobPosting> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("job_postings")
      .insert({
        title: input.title,
        department: input.department,
        location: input.location,
        employment_type: input.employmentType,
        description: input.description,
        requirements: input.requirements,
        contact_email: input.contactEmail ?? null,
        apply_url: input.applyUrl ?? null,
        closing_date: input.closingDate ?? null,
        status: "draft",
        posted_by_id: postedById,
        applications_received: 0,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to save the new posting.");
    }

    const posting = fromRow(data as JobPostingRow);
    setPostings((prev) => [posting, ...prev]);
    return posting;
  }

  function editPosting(id: string, input: NewJobPostingInput) {
    updatePosting(id, input);
  }

  function deletePosting(id: string) {
    setPostings((prev) => prev.filter((posting) => posting.id !== id));
    getSupabaseBrowserClient()
      .from("job_postings")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error(`[job-postings] Failed to delete posting ${id}:`, error);
      });
  }

  function setStatus(id: string, status: JobPostingStatus) {
    updatePosting(id, { status });
  }

  /*
   * A clone starts a new hiring cycle, not a continuation of the old one —
   * fresh id, back to Draft (details may need updating before it goes out
   * again), postedAt reset to now, and applications/notes cleared rather
   * than carried over from the previous run.
   */
  async function clonePosting(id: string, postedById: string): Promise<JobPosting> {
    const source = postings.find((posting) => posting.id === id);
    return addPosting(
      {
        title: source?.title ?? "Untitled role",
        department: source?.department ?? "",
        location: source?.location ?? "",
        employmentType: source?.employmentType ?? "",
        description: source?.description ?? "",
        requirements: source?.requirements ?? [],
        contactEmail: source?.contactEmail,
        applyUrl: source?.applyUrl,
      },
      postedById
    );
  }

  function updateApplications(id: string, applicationsReceived: number, notes: string | undefined) {
    updatePosting(id, { applicationsReceived, notes });
  }

  return (
    <JobPostingsContext.Provider value={{ postings, addPosting, editPosting, deletePosting, setStatus, clonePosting, updateApplications }}>
      {children}
    </JobPostingsContext.Provider>
  );
}

export function useJobPostings(): JobPosting[] {
  const ctx = useContext(JobPostingsContext);
  if (!ctx) throw new Error("useJobPostings must be used within JobPostingsProvider");
  return ctx.postings;
}

export function useJobPostingActions(): Omit<JobPostingsContextValue, "postings"> {
  const ctx = useContext(JobPostingsContext);
  if (!ctx) throw new Error("useJobPostingActions must be used within JobPostingsProvider");
  const { addPosting, editPosting, deletePosting, setStatus, clonePosting, updateApplications } = ctx;
  return { addPosting, editPosting, deletePosting, setStatus, clonePosting, updateApplications };
}
