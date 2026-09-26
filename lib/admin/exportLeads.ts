import type { Lead } from "./types";
import { getLeadServiceLabel } from "./register";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const COLUMNS = [
  "Name",
  "Email",
  "Phone",
  "Company",
  "Service",
  "Type",
  "Department",
  "Status",
  "Source",
  "Language",
  "Message",
  "Created At",
  "First Contacted At",
  "Assigned To",
  "Consent At",
] as const;

/** Exports exactly the leads passed in — the caller decides whether that's the currently filtered view or the full set, this never re-derives scope on its own. */
export function leadsToCSV(leads: Lead[], staff: { id: string; name: string }[]): string {
  const rows = leads.map((lead) => {
    const assignee = staff.find((user) => user.id === lead.assignedToId)?.name ?? "";
    const fields = [
      lead.name,
      lead.email,
      lead.phone,
      lead.company ?? "",
      getLeadServiceLabel(lead.service),
      lead.type,
      lead.department ?? "",
      lead.status,
      lead.source,
      lead.language,
      lead.message,
      lead.createdAt,
      lead.firstContactedAt ?? "",
      assignee,
      lead.consentAt ?? "",
    ];
    return fields.map((value) => csvEscape(String(value))).join(",");
  });
  return [COLUMNS.join(","), ...rows].join("\r\n");
}

/** Browser-only — builds the CSV, triggers a download via a throwaway object URL, then cleans it up immediately. */
export function downloadLeadsCSV(leads: Lead[], staff: { id: string; name: string }[]): void {
  const csv = leadsToCSV(leads, staff);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
