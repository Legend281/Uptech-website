import type { OnboardingSubmission } from "./types";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const COLUMNS = [
  "Case #",
  "Account Manager",
  "First Name",
  "Last Name",
  "Gender",
  "Contact",
  "Email",
  "Email Password",
  "LinkedIn Email",
  "LinkedIn Password",
  "Application Password",
  "Address",
  "Date of Birth",
  "Nationality",
  "Ethnicity",
  "Residency Status",
  "Security Clearance",
  "Preferred Job Titles",
  "Preferred Job Location",
  "Expected Salary Range",
  "Resume",
  "LinkedIn Photo",
  "Reference 1 Name", "Reference 1 Title & Company", "Reference 1 Relationship", "Reference 1 Email", "Reference 1 Phone",
  "Reference 2 Name", "Reference 2 Title & Company", "Reference 2 Relationship", "Reference 2 Email", "Reference 2 Phone",
  "Reference 3 Name", "Reference 3 Title & Company", "Reference 3 Relationship", "Reference 3 Email", "Reference 3 Phone",
  "Submitted At",
] as const;

/** Exports exactly the submissions passed in — the caller decides scope (filtered view or the full set), this never re-derives it. */
export function onboardingToCSV(submissions: OnboardingSubmission[], staff: { id: string; name: string }[]): string {
  const rows = submissions.map((s) => {
    const manager = staff.find((u) => u.id === s.accountManagerId)?.name ?? "";
    const [r1, r2, r3] = s.references;
    const fields = [
      s.caseNumber,
      manager,
      s.firstName,
      s.lastName,
      s.gender,
      s.contact,
      s.email,
      s.emailPassword ?? "",
      s.linkedinEmail,
      s.linkedinPassword,
      s.applicationPassword ?? "",
      s.address,
      s.dateOfBirth,
      s.nationality,
      s.ethnicity,
      s.residencyStatus,
      s.securityClearance,
      s.preferredJobTitles,
      s.preferredJobLocation,
      s.expectedSalaryRange,
      s.resumeUrl ?? "",
      s.linkedinPhotoUrl ?? "",
      r1.name ?? "", r1.titleAndCompany ?? "", r1.relationship ?? "", r1.email ?? "", r1.phone ?? "",
      r2.name ?? "", r2.titleAndCompany ?? "", r2.relationship ?? "", r2.email ?? "", r2.phone ?? "",
      r3.name ?? "", r3.titleAndCompany ?? "", r3.relationship ?? "", r3.email ?? "", r3.phone ?? "",
      s.submittedAt,
    ];
    return fields.map((value) => csvEscape(String(value))).join(",");
  });
  return [COLUMNS.join(","), ...rows].join("\r\n");
}

/** Browser-only — builds the CSV, triggers a download via a throwaway object URL, then cleans it up immediately. Opens directly in Excel. */
export function downloadOnboardingCSV(submissions: OnboardingSubmission[], staff: { id: string; name: string }[]): void {
  const csv = onboardingToCSV(submissions, staff);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `client-onboarding-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Download an individual client onboarding record as an Excel-ready CSV file. */
export function downloadSingleSubmissionCSV(submission: OnboardingSubmission, staff: { id: string; name: string }[]): void {
  const csv = onboardingToCSV([submission], staff);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeName = `${submission.firstName}-${submission.lastName}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
  link.download = `case-${submission.caseNumber}-${safeName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

