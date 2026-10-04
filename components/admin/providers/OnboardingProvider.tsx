"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLogActivity } from "@/components/admin/providers/ActivityProvider";
import { describeDbError, getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActionResult, AdminUser, OnboardingReference, OnboardingSubmission } from "@/lib/admin/types";

/*
 * Client Onboarding submissions (supabase/022_onboarding_submissions.sql) —
 * read-only from the dashboard's own perspective except for two fields:
 * accountManagerId (who's managing this case) and applicationPassword (set
 * by staff once Uptech has created it — never part of the client's own
 * submission). Everything else arrives through app/api/onboarding-webhook/
 * route.ts (the Google Form → Apps Script pipe); there is no "add" action.
 */

type Row = {
  id: string;
  case_number: number;
  account_manager_id: string | null;
  first_name: string;
  last_name: string;
  gender: string;
  contact: string;
  email: string;
  email_password: string | null;
  linkedin_email: string;
  linkedin_password: string;
  application_password: string | null;
  address: string;
  date_of_birth: string;
  nationality: string;
  ethnicity: string;
  residency_status: string;
  security_clearance: string;
  preferred_job_titles: string;
  preferred_job_location: string;
  expected_salary_range: string;
  resume_url: string | null;
  linkedin_photo_url: string | null;
  reference1_name: string | null;
  reference1_title_company: string | null;
  reference1_relationship: string | null;
  reference1_email: string | null;
  reference1_phone: string | null;
  reference2_name: string | null;
  reference2_title_company: string | null;
  reference2_relationship: string | null;
  reference2_email: string | null;
  reference2_phone: string | null;
  reference3_name: string | null;
  reference3_title_company: string | null;
  reference3_relationship: string | null;
  reference3_email: string | null;
  reference3_phone: string | null;
  google_response_email: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

function referenceFrom(row: Row, n: 1 | 2 | 3): OnboardingReference {
  return {
    name: row[`reference${n}_name`] ?? undefined,
    titleAndCompany: row[`reference${n}_title_company`] ?? undefined,
    relationship: row[`reference${n}_relationship`] ?? undefined,
    email: row[`reference${n}_email`] ?? undefined,
    phone: row[`reference${n}_phone`] ?? undefined,
  };
}

function rowToSubmission(row: Row): OnboardingSubmission {
  return {
    id: row.id,
    caseNumber: row.case_number,
    accountManagerId: row.account_manager_id ?? undefined,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    contact: row.contact,
    email: row.email,
    emailPassword: row.email_password ?? undefined,
    linkedinEmail: row.linkedin_email,
    linkedinPassword: row.linkedin_password,
    applicationPassword: row.application_password ?? undefined,
    address: row.address,
    dateOfBirth: row.date_of_birth,
    nationality: row.nationality,
    ethnicity: row.ethnicity,
    residencyStatus: row.residency_status,
    securityClearance: row.security_clearance,
    preferredJobTitles: row.preferred_job_titles,
    preferredJobLocation: row.preferred_job_location,
    expectedSalaryRange: row.expected_salary_range,
    resumeUrl: row.resume_url ?? undefined,
    linkedinPhotoUrl: row.linkedin_photo_url ?? undefined,
    references: [referenceFrom(row, 1), referenceFrom(row, 2), referenceFrom(row, 3)],
    googleResponseEmail: row.google_response_email ?? undefined,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type OnboardingContextValue = {
  submissions: OnboardingSubmission[];
  loading: boolean;
  loadError: string | null;
  assignAccountManager: (id: string, accountManagerId: string | undefined, user: AdminUser) => Promise<ActionResult>;
  setApplicationPassword: (id: string, applicationPassword: string, user: AdminUser) => Promise<ActionResult>;
  deleteSubmission: (id: string, user: AdminUser) => Promise<ActionResult>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<OnboardingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const logActivity = useLogActivity();

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient()
      .from("onboarding_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error) {
      console.error("[onboarding] Failed to load submissions:", error);
      setLoadError(describeDbError(error));
    } else if (data) {
      setSubmissions((data as Row[]).map(rowToSubmission));
      setLoadError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    function apply(hasSession: boolean) {
      if (hasSession) void refresh();
      else {
        setSubmissions([]);
        setLoadError(null);
        setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "TOKEN_REFRESHED") apply(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  function log(icon: string, description: string) {
    logActivity({ icon, description, relatedHref: "/admin/onboarding" });
  }

  async function assignAccountManager(id: string, accountManagerId: string | undefined, user: AdminUser): Promise<ActionResult> {
    const existing = submissions.find((s) => s.id === id);
    if (!existing) return { ok: false, reasons: ["This submission no longer exists."] };

    const { error } = await getSupabaseBrowserClient()
      .from("onboarding_submissions")
      .update({ account_manager_id: accountManagerId ?? null })
      .eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    log("manage_accounts", `${user.name} updated the account manager for ${existing.firstName} ${existing.lastName}'s case (#${existing.caseNumber}).`);
    return { ok: true };
  }

  async function setApplicationPassword(id: string, applicationPassword: string, user: AdminUser): Promise<ActionResult> {
    const existing = submissions.find((s) => s.id === id);
    if (!existing) return { ok: false, reasons: ["This submission no longer exists."] };

    const { error } = await getSupabaseBrowserClient()
      .from("onboarding_submissions")
      .update({ application_password: applicationPassword.trim() || null })
      .eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    log("edit_note", `${user.name} set the application password for ${existing.firstName} ${existing.lastName}'s case (#${existing.caseNumber}).`);
    return { ok: true };
  }

  async function deleteSubmission(id: string, user: AdminUser): Promise<ActionResult> {
    const existing = submissions.find((s) => s.id === id);
    if (!existing) return { ok: true };

    const { error } = await getSupabaseBrowserClient().from("onboarding_submissions").delete().eq("id", id);
    if (error) return { ok: false, reasons: [describeDbError(error)] };

    await refresh();
    log("delete", `${user.name} deleted the onboarding submission from ${existing.firstName} ${existing.lastName} (case #${existing.caseNumber}).`);
    return { ok: true };
  }

  return (
    <OnboardingContext.Provider value={{ submissions, loading, loadError, assignAccountManager, setApplicationPassword, deleteSubmission }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingSubmissions() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboardingSubmissions must be used within OnboardingProvider");
  return ctx;
}
