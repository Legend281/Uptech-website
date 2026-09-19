import { serviceOptions } from "@/lib/serviceOptions";
import type { StatusTone } from "@/components/admin/StatusBadge";
import type { Lead, LeadStatus, LeadServiceValue } from "./types";

export function getLeadServiceLabel(service: Lead["service"]): string {
  return serviceOptions.find((option) => option.value === service)?.label ?? "Something else";
}

export const leadStatusMeta: Record<LeadStatus, { label: string; tone: StatusTone }> = {
  new: { label: "New", tone: "info" },
  contacted: { label: "Contacted", tone: "neutral" },
  qualified: { label: "Qualified", tone: "warning" },
  "consultation-booked": { label: "Booked", tone: "success" },
  won: { label: "Won", tone: "success" },
  lost: { label: "Lost", tone: "danger" },
};

/** Distinct accent per service so a Service pill never gets confused with a Status badge in the same row. */
const serviceAccentClasses: Record<LeadServiceValue, string> = {
  "career-marketing": "bg-teal-50 text-teal-700",
  "business-formalisation-cameroon": "bg-sky-50 text-sky-700",
  "business-formalisation-us": "bg-blue-50 text-blue-accent",
  "business-formalisation": "bg-slate-100 text-slate-600",
  "tax-compliance-businesses": "bg-amber-50 text-amber-700",
  "cnps-compliance": "bg-indigo-50 text-indigo-700",
  other: "bg-slate-100 text-slate-600",
};

export function getServiceAccentClasses(service: LeadServiceValue): string {
  return serviceAccentClasses[service];
}

/** A calmer dot-marker version of the same per-service colors, for contexts (like a dense table) that already have a Status pill and don't need a second competing pill shape. */
const serviceDotClasses: Record<LeadServiceValue, string> = {
  "career-marketing": "bg-teal-500",
  "business-formalisation-cameroon": "bg-sky-500",
  "business-formalisation-us": "bg-blue-accent",
  "business-formalisation": "bg-slate-400",
  "tax-compliance-businesses": "bg-amber-500",
  "cnps-compliance": "bg-indigo-500",
  other: "bg-slate-400",
};

export function getServiceDotClass(service: LeadServiceValue): string {
  return serviceDotClasses[service];
}

const DAY_MS = 86_400_000;

export function countCreatedWithinDays(leads: Lead[], days: number, now: Date = new Date()): number {
  const cutoff = now.getTime() - days * DAY_MS;
  return leads.filter((lead) => new Date(lead.createdAt).getTime() >= cutoff).length;
}

export function countByStatusWithinDays(
  leads: Lead[],
  statuses: LeadStatus[],
  days: number,
  now: Date = new Date(),
): number {
  const cutoff = now.getTime() - days * DAY_MS;
  return leads.filter(
    (lead) => statuses.includes(lead.status) && new Date(lead.createdAt).getTime() >= cutoff,
  ).length;
}

/** The funnel a lead actually moves through — "lost" is an exit, not a stage, so it's excluded from the pipeline visualization. */
export const PIPELINE_STAGES: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "qualified", label: "Qualified" },
  { status: "consultation-booked", label: "Booked" },
  { status: "won", label: "Won" },
];

/** Buckets leads by day for the last N days — a real trend line from actual mock timestamps, not an invented shape, for the dashboard's sparklines. */
export function getDailyLeadCounts(leads: Lead[], days: number, now: Date = new Date()): number[] {
  const buckets = new Array(days).fill(0);
  for (const lead of leads) {
    const ageDays = Math.floor((now.getTime() - new Date(lead.createdAt).getTime()) / DAY_MS);
    const bucketIndex = days - 1 - ageDays;
    if (bucketIndex >= 0 && bucketIndex < days) buckets[bucketIndex] += 1;
  }
  return buckets;
}

/** Cool-to-warm progression (neutral slate at "New" through to emerald at "Won") so the bar's color itself communicates a deal getting better, not just an arbitrary palette. */
export const PIPELINE_STAGE_COLOR: Record<LeadStatus, string> = {
  new: "bg-slate-400",
  contacted: "bg-sky-400",
  qualified: "bg-blue-accent",
  "consultation-booked": "bg-teal-400",
  won: "bg-emerald-400",
  lost: "bg-rose-400",
};

export function getPipelineCounts(leads: Lead[]) {
  const eligible = leads.filter((lead) => lead.status !== "lost");
  return PIPELINE_STAGES.map((stage) => {
    const count = leads.filter((lead) => lead.status === stage.status).length;
    return {
      ...stage,
      count,
      percent: eligible.length === 0 ? 0 : Math.round((count / eligible.length) * 100),
    };
  });
}
