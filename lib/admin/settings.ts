import { RESPONSE_SLA_HOURS } from "./leadStaleness";
import type { AdminUser, Department } from "./types";

/*
 * System settings — Admin_Content_Pages_Spec.md Section 4. Everything a
 * change here can break is validated in this file, not in the page, so the
 * rules hold no matter which screen writes them.
 */

// 4.1 Lead auto-assignment ------------------------------------------------------

export type AssignmentMode = "round-robin" | "manual";

export type DepartmentAssignment = {
  /** Round-robin's pause switch: off keeps the pool and order but assigns nobody until switched back on. */
  enabled: boolean;
  mode: AssignmentMode;
  /** Who takes turns. Only active Editors and Administrators of the department can be in it. */
  poolUserIds: string[];
  /** Flag an uncontacted new lead after this many hours. Capped at the public 24-hour promise. */
  escalationHours: number;
};

// 4.3 Notifications ---------------------------------------------------------------

export type NotificationEvent = "lead-assigned" | "lead-overdue" | "review-due";
export type NotificationChannel = "email" | "inApp";
export type NotificationPrefs = Record<NotificationEvent, Record<NotificationChannel, boolean>>;

export const notificationEventLabels: Record<NotificationEvent, { label: string; hint: string }> = {
  "lead-assigned": { label: "A lead is assigned to me", hint: "Including auto-assignment." },
  "lead-overdue": { label: "A lead I own passes its escalation window", hint: "Uncontacted past the department's window." },
  "review-due": { label: "A compliance page in my department is due for review", hint: "When it enters its due-soon window." },
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  "lead-assigned": { email: true, inApp: true },
  "lead-overdue": { email: true, inApp: true },
  "review-due": { email: false, inApp: true },
};

// 4.4 Compliance review cycles ---------------------------------------------------------
// The cadence/due-soon values themselves now live directly on each real
// service_pages row (components/admin/providers/ServicePagesProvider.tsx +
// supabase/011_service_pages_due_soon_days.sql), not duplicated into this
// Settings blob — only the shared type and its validator stay here.

export type ReviewCycle = { cadenceDays: number; dueSoonDays: number };

// 4.5 Company details --------------------------------------------------------------------

export type CompanyDetails = {
  contactEmail: string;
  whatsappNumber: string;
  phoneNumber: string;
  cameroonEntity: string;
  cameroonAddress: string;
  usEntity: string;
  usAddress: string;
  linkedinUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  xUrl: string;
};

/** Never editable: CLAUDE.md fixes the written name, and this is the one place it's shown as the source of truth. */
export const COMPANY_DISPLAY_NAME = "Uptech Consulting";
export const COMPANY_LEGAL_NAME = "Uptech Consulting & Outsourcing Cameroon";

export type Settings = {
  assignment: Record<Department, DepartmentAssignment>;
  notifications: Record<string, NotificationPrefs>;
  company: CompanyDetails;
};

/*
 * Defaults = what the site and dashboard do today, so turning Settings on
 * changes nothing until someone changes a setting. Company details are the
 * values currently hard-coded across the site; the social links there are
 * still "#" placeholders, so they start empty rather than invented.
 */
export const DEFAULT_SETTINGS: Settings = {
  assignment: {
    // Manual = today's behaviour. Picking round-robin switches it on; "enabled" is only the pause switch for round-robin.
    "career-services-operations": { enabled: true, mode: "manual", poolUserIds: [], escalationHours: RESPONSE_SLA_HOURS },
    "business-formalisation-compliance": { enabled: true, mode: "manual", poolUserIds: [], escalationHours: RESPONSE_SLA_HOURS },
  },
  notifications: {},
  company: {
    contactEmail: "infos@uptechconsulting.com",
    whatsappNumber: "+237 678 597 593",
    phoneNumber: "+237 678 597 593",
    cameroonEntity: "Cameroon S.A., Buea",
    cameroonAddress: "",
    usEntity: "US S-Corp, Stafford, Texas",
    usAddress: "",
    linkedinUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    xUrl: "",
  },
};

export function canEditSystemSettings(user: AdminUser): boolean {
  return user.role === "administrator";
}

/** Who may sit in a department's assignment pool: active, not a Viewer (Viewers can't work leads), same department. */
export function isPoolEligible(user: AdminUser, department: Department): boolean {
  return user.active !== false && user.role !== "viewer" && user.department === department;
}

export function validateAssignment(value: DepartmentAssignment, users: AdminUser[], department: Department): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(value.escalationHours) || value.escalationHours < 1 || value.escalationHours > RESPONSE_SLA_HOURS) {
    errors.push(`The escalation window has to be between 1 and ${RESPONSE_SLA_HOURS} hours. The site promises a reply within one business day, so it can flag sooner than that, never later.`);
  }
  if (value.enabled && value.mode === "round-robin") {
    const eligible = value.poolUserIds.filter((id) => {
      const user = users.find((u) => u.id === id);
      return user && isPoolEligible(user, department);
    });
    if (eligible.length === 0) errors.push("Round-robin needs at least one active Editor or Administrator in the pool.");
  }
  return errors;
}

export function validateReviewCycle(cycle: ReviewCycle): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(cycle.cadenceDays) || cycle.cadenceDays < 30 || cycle.cadenceDays > 730) {
    errors.push("Review every 30 to 730 days.");
  }
  if (!Number.isInteger(cycle.dueSoonDays) || cycle.dueSoonDays < 1 || cycle.dueSoonDays >= cycle.cadenceDays) {
    errors.push("The “due soon” warning has to start at least 1 day before, and within, the review cycle.");
  }
  return errors;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+\d[\d\s]{6,18}$/;

export function validateCompany(details: CompanyDetails): string[] {
  const errors: string[] = [];
  if (!EMAIL.test(details.contactEmail.trim())) errors.push("The contact email isn't a valid address.");
  if (!PHONE.test(details.whatsappNumber.trim())) errors.push("The WhatsApp number needs the country code, e.g. +237 6XX XXX XXX.");
  if (details.phoneNumber.trim() && !PHONE.test(details.phoneNumber.trim())) errors.push("The phone number needs the country code.");
  for (const [label, url] of [
    ["LinkedIn", details.linkedinUrl],
    ["Facebook", details.facebookUrl],
    ["TikTok", details.tiktokUrl],
    ["X", details.xUrl],
  ] as const) {
    if (url.trim() && !url.trim().startsWith("https://")) errors.push(`The ${label} link needs to start with https://.`);
  }
  return errors;
}

/**
 * Round-robin: the next eligible pool member after whoever went last
 * (lastAssignedUserId — the owner of the department's most recent assigned
 * lead, worked out from the leads themselves, so no pointer has to be
 * stored where only Administrators can write), wrapping around. Skips people who have since been deactivated, moved
 * department or become Viewers — they stay in the saved pool list, but
 * never receive a lead.
 */
export function nextAssignee(
  config: DepartmentAssignment,
  users: AdminUser[],
  department: Department,
  lastAssignedUserId?: string,
): string | undefined {
  if (!config.enabled || config.mode !== "round-robin") return undefined;
  const eligible = config.poolUserIds.filter((id) => {
    const user = users.find((u) => u.id === id);
    return user && isPoolEligible(user, department);
  });
  if (eligible.length === 0) return undefined;
  const lastIndex = lastAssignedUserId ? eligible.indexOf(lastAssignedUserId) : -1;
  return eligible[(lastIndex + 1) % eligible.length];
}
