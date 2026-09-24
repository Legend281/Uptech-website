"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockJobPostings } from "@/lib/admin/mockData";
import type { JobPosting, JobPostingStatus } from "@/lib/admin/types";

const STORAGE_KEY = "uco-admin-job-postings-v1";

/** Everything but id/status/postedAt/postedById/applicationsReceived — those are set by the provider, not typed in from the form. */
export type NewJobPostingInput = Pick<JobPosting, "title" | "department" | "location" | "employmentType" | "description" | "requirements" | "contactEmail">;

type JobPostingsContextValue = {
  postings: JobPosting[];
  addPosting: (input: NewJobPostingInput, postedById: string) => JobPosting;
  editPosting: (id: string, input: NewJobPostingInput) => void;
  deletePosting: (id: string) => void;
  setStatus: (id: string, status: JobPostingStatus) => void;
  clonePosting: (id: string, postedById: string) => JobPosting;
  updateApplications: (id: string, applicationsReceived: number, notes: string | undefined) => void;
};

const JobPostingsContext = createContext<JobPostingsContextValue | null>(null);

function loadPostings(): JobPosting[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockJobPostings;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as JobPosting[]) : mockJobPostings;
  } catch {
    return mockJobPostings;
  }
}

function savePostings(postings: JobPosting[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(postings));
  } catch {
    // Best-effort only — a private window or blocked storage shouldn't break the page.
  }
}

function makePostingId(): string {
  return `job-manual-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function JobPostingsProvider({ children }: { children: ReactNode }) {
  // Seeded with the static mock set on first render so server and client markup match; the real localStorage read happens after mount, below.
  const [postings, setPostings] = useState<JobPosting[]>(mockJobPostings);

  useEffect(() => {
    setPostings(loadPostings());
  }, []);

  function updatePosting(id: string, patch: Partial<JobPosting>) {
    setPostings((prev) => {
      const next = prev.map((posting) => (posting.id === id ? { ...posting, ...patch } : posting));
      savePostings(next);
      return next;
    });
  }

  function addPosting(input: NewJobPostingInput, postedById: string): JobPosting {
    const posting: JobPosting = {
      id: makePostingId(),
      ...input,
      status: "draft",
      postedAt: new Date().toISOString(),
      postedById,
      applicationsReceived: 0,
    };
    setPostings((prev) => {
      const next = [posting, ...prev];
      savePostings(next);
      return next;
    });
    return posting;
  }

  function editPosting(id: string, input: NewJobPostingInput) {
    updatePosting(id, input);
  }

  function deletePosting(id: string) {
    setPostings((prev) => {
      const next = prev.filter((posting) => posting.id !== id);
      savePostings(next);
      return next;
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
  function clonePosting(id: string, postedById: string): JobPosting {
    const source = postings.find((posting) => posting.id === id);
    const cloned: JobPosting = {
      id: makePostingId(),
      title: source?.title ?? "Untitled role",
      department: source?.department ?? "",
      location: source?.location ?? "",
      employmentType: source?.employmentType ?? "",
      description: source?.description ?? "",
      requirements: source?.requirements ?? [],
      contactEmail: source?.contactEmail,
      status: "draft",
      postedAt: new Date().toISOString(),
      postedById,
      applicationsReceived: 0,
    };
    setPostings((prev) => {
      const next = [cloned, ...prev];
      savePostings(next);
      return next;
    });
    return cloned;
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
