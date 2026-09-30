"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useLeads } from "@/components/admin/providers/LeadsProvider";
import { useJobPostings } from "@/components/admin/providers/JobPostingsProvider";
import { useOnboardingSubmissions } from "@/components/admin/providers/OnboardingProvider";
import { useStaff } from "@/components/admin/providers/StaffProvider";
import { getNavGroups } from "@/lib/admin/nav";

type ResultItem = {
  id: string;
  group: string;
  icon: string;
  label: string;
  sublabel?: string;
  onSelect: () => void;
};

/**
 * Go-anywhere search across the data that actually lives in this dashboard
 * — not a fuzzy AI search, a plain substring match, because every result
 * has to be something the person can immediately see is right. Job
 * Postings and Client Onboarding have no per-record route yet (both are
 * list-plus-modal pages, not /[id] routes like Leads), so those results
 * land on the list page rather than a specific open record — a real
 * limitation, not a bug, until those pages grow real URLs of their own.
 *
 * Leads and Client Onboarding data already come out of their providers
 * pre-scoped by RLS to what the signed-in person can see (Onboarding most
 * strictly — see supabase/022_onboarding_submissions.sql), so no extra
 * permission filtering is needed here for those. Staff results are
 * Administrator-only, matching the "Staff" nav item's own adminOnly flag.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const leads = useLeads();
  const jobPostings = useJobPostings();
  const { submissions } = useOnboardingSubmissions();
  const staff = useStaff();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  const navResults: ResultItem[] = useMemo(() => {
    const items: ResultItem[] = [];
    for (const group of getNavGroups(0, 0, 0, 0, 0, 0)) {
      for (const item of group.items) {
        if (item.soon || !item.href) continue;
        if (item.adminOnly && currentUser.role !== "administrator") continue;
        if (item.restrictedToDepartment && currentUser.role !== "administrator" && currentUser.department !== item.restrictedToDepartment) continue;
        items.push({ id: `nav-${item.href}`, group: "Go to", icon: item.icon, label: item.label, onSelect: () => go(item.href as string) });
      }
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const results: ResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navResults.slice(0, 6);

    const out: ResultItem[] = [];

    for (const item of navResults) {
      if (item.label.toLowerCase().includes(q)) out.push(item);
    }

    for (const lead of leads) {
      const haystack = `${lead.name} ${lead.email} ${lead.phone} ${lead.company ?? ""}`.toLowerCase();
      if (haystack.includes(q)) {
        out.push({
          id: `lead-${lead.id}`,
          group: "Leads",
          icon: "inbox",
          label: lead.name,
          sublabel: lead.email,
          onSelect: () => go(`/admin/leads/${lead.id}`),
        });
      }
    }

    for (const posting of jobPostings) {
      const haystack = `${posting.title} ${posting.department ?? ""} ${posting.location}`.toLowerCase();
      if (haystack.includes(q)) {
        out.push({
          id: `job-${posting.id}`,
          group: "Job Postings",
          icon: "work",
          label: posting.title,
          sublabel: posting.location,
          onSelect: () => go("/admin/job-postings"),
        });
      }
    }

    for (const submission of submissions) {
      const fullName = `${submission.firstName} ${submission.lastName}`;
      const haystack = `${fullName} ${submission.email} case ${submission.caseNumber}`.toLowerCase();
      if (haystack.includes(q)) {
        out.push({
          id: `onboarding-${submission.id}`,
          group: "Client Onboarding",
          icon: "assignment_ind",
          label: fullName,
          sublabel: `Case #${submission.caseNumber}`,
          onSelect: () => go("/admin/onboarding"),
        });
      }
    }

    if (currentUser.role === "administrator") {
      for (const person of staff) {
        if (person.name.toLowerCase().includes(q)) {
          out.push({
            id: `staff-${person.id}`,
            group: "Staff",
            icon: "badge",
            label: person.name,
            sublabel: person.location,
            onSelect: () => go("/admin/staff"),
          });
        }
      }
    }

    return out.slice(0, 20);
  }, [query, navResults, leads, jobPostings, submissions, staff, currentUser.role]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        results[activeIndex]?.onSelect();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, results, activeIndex, onClose]);

  if (!open) return null;

  let runningIndex = -1;
  const groups = new Map<string, ResultItem[]>();
  for (const item of results) {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group)!.push(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12dvh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div data-lenis-prevent className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
          <MaterialIcon name="search" className="shrink-0 text-[18px] text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, job postings, clients, staff…"
            autoComplete="off"
            className="w-full border-none text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Nothing matches &quot;{query}&quot;.</p>
          ) : (
            [...groups.entries()].map(([group, items]) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="px-4 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{group}</p>
                {items.map((item) => {
                  runningIndex += 1;
                  const index = runningIndex;
                  const active = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => item.onSelect()}
                      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors ${
                        active ? "bg-teal-50 text-teal-900" : "text-slate-700"
                      }`}
                    >
                      <MaterialIcon name={item.icon} className={`shrink-0 text-[16px] ${active ? "text-teal-600" : "text-slate-400"}`} />
                      <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                      {item.sublabel && <span className="shrink-0 truncate text-xs text-slate-400">{item.sublabel}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
