"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionsMenu, type RowAction } from "@/components/admin/RowActionsMenu";
import { ModuleHeader, PrimaryActionButton, SearchInput, CARD_SURFACE, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { useOnboardingSubmissions } from "@/components/admin/providers/OnboardingProvider";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useStaff } from "@/components/admin/providers/StaffProvider";
import { downloadOnboardingCSV } from "@/lib/admin/exportOnboarding";
import { formatRelativeTime } from "@/lib/admin/formatRelativeTime";
import type { OnboardingSubmission } from "@/lib/admin/types";

const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } } };

/** A masked value with its own reveal toggle — the same posture as every password field elsewhere in this dashboard: never shown by default, one click to check it. */
function SecretField({ label, value }: { label: string; value: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <span className={labelClasses}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-sm text-navy-950">
          {shown ? value : "••••••••••••"}
        </span>
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? `Hide ${label}` : `Show ${label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <MaterialIcon name={shown ? "visibility_off" : "visibility"} className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={labelClasses}>{label}</span>
      <span className="text-sm text-navy-950">{value || "—"}</span>
    </div>
  );
}

function ReferenceCard({ index, reference }: { index: number; reference: OnboardingSubmission["references"][number] }) {
  const hasAnything = reference.name || reference.titleAndCompany || reference.email || reference.phone;
  if (!hasAnything) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Reference {index}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DetailRow label="Name" value={reference.name} />
        <DetailRow label="Relationship" value={reference.relationship} />
        <div className="sm:col-span-2">
          <DetailRow label="Title & Company" value={reference.titleAndCompany} />
        </div>
        <DetailRow label="Email" value={reference.email} />
        <DetailRow label="Phone" value={reference.phone} />
      </div>
    </div>
  );
}

function DetailModal({ submission, onClose }: { submission: OnboardingSubmission; onClose: () => void }) {
  const currentUser = useCurrentUser();
  const staff = useStaff();
  const { assignAccountManager, setApplicationPassword } = useOnboardingSubmissions();
  const [applicationPasswordDraft, setApplicationPasswordDraft] = useState(submission.applicationPassword ?? "");
  const [savingPassword, setSavingPassword] = useState(false);
  const eligibleManagers = staff.filter((u) => u.department === "career-services-operations" && u.role !== "viewer");

  async function handleAssign(id: string) {
    const result = await assignAccountManager(submission.id, id || undefined, currentUser);
    if (!result.ok) toast.error("Couldn't assign", { description: result.reasons[0] });
    else toast.success("Account manager updated");
  }

  async function handleSavePassword() {
    setSavingPassword(true);
    const result = await setApplicationPassword(submission.id, applicationPasswordDraft, currentUser);
    setSavingPassword(false);
    if (!result.ok) toast.error("Couldn't save", { description: result.reasons[0] });
    else toast.success("Application password saved");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Case #{submission.caseNumber}</span>
            <h2 className="font-sans text-base font-bold text-navy-950">
              {submission.firstName} {submission.lastName}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="mb-4">
            <span className={labelClasses}>Account Manager</span>
            <select
              value={submission.accountManagerId ?? ""}
              onChange={(e) => void handleAssign(e.target.value)}
              className={`${inputClasses} mt-1.5 w-full bg-white`}
            >
              <option value="">Unassigned</option>
              {eligibleManagers.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow label="Gender" value={submission.gender} />
            <DetailRow label="Contact" value={submission.contact} />
            <DetailRow label="Email" value={submission.email} />
            <DetailRow label="Date of Birth" value={submission.dateOfBirth} />
            <DetailRow label="Nationality" value={submission.nationality} />
            <DetailRow label="Ethnicity" value={submission.ethnicity} />
            <DetailRow label="Residency Status" value={submission.residencyStatus} />
            <DetailRow label="Security Clearance" value={submission.securityClearance} />
            <div className="sm:col-span-2">
              <DetailRow label="Address" value={submission.address} />
            </div>
            <DetailRow label="Preferred Job Title(s)" value={submission.preferredJobTitles} />
            <DetailRow label="Preferred Job Location" value={submission.preferredJobLocation} />
            <DetailRow label="Expected Salary Range" value={submission.expectedSalaryRange} />
            <DetailRow label="Submitted" value={new Date(submission.submittedAt).toLocaleString()} />
          </div>

          {(submission.resumeUrl || submission.linkedinPhotoUrl) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {submission.resumeUrl && (
                <a href={submission.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                  <MaterialIcon name="description" className="text-[16px]" /> Resume
                </a>
              )}
              {submission.linkedinPhotoUrl && (
                <a href={submission.linkedinPhotoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                  <MaterialIcon name="photo_camera" className="text-[16px]" /> LinkedIn Photo
                </a>
              )}
            </div>
          )}

          {submission.references.some((r) => r.name || r.email) && (
            <div className="mt-5 space-y-2.5">
              <p className={labelClasses}>References</p>
              {submission.references.map((r, i) => (
                <ReferenceCard key={i} index={i + 1} reference={r} />
              ))}
            </div>
          )}

          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
              <MaterialIcon name="lock" className="text-[14px]" />
              Account credentials — handle with care
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SecretField label="LinkedIn Email" value={submission.linkedinEmail} />
              <SecretField label="LinkedIn Password" value={submission.linkedinPassword} />
              {submission.emailPassword && <SecretField label="Email Password" value={submission.emailPassword} />}
            </div>
            <div className="mt-3 border-t border-amber-200 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Password <span className="font-normal normal-case text-slate-400">— set by Uptech once created</span>
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={applicationPasswordDraft}
                  onChange={(e) => setApplicationPasswordDraft(e.target.value)}
                  placeholder="Not set yet"
                  className={`${inputClasses} flex-1 bg-white font-mono`}
                />
                <button
                  type="button"
                  onClick={() => void handleSavePassword()}
                  disabled={savingPassword || applicationPasswordDraft === (submission.applicationPassword ?? "")}
                  className="rounded-lg bg-navy-950 px-3.5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { submissions, deleteSubmission } = useOnboardingSubmissions();
  const currentUser = useCurrentUser();
  const staff = useStaff();
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<OnboardingSubmission | null>(null);
  const [deleting, setDeleting] = useState<OnboardingSubmission | null>(null);

  if (!canAccessOnboarding(currentUser)) {
    return (
      <div className={`flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-14 text-center text-sm text-slate-500 ${CARD_SURFACE}`}>
        <MaterialIcon name="lock" className="text-[32px] text-slate-300" />
        <p>This holds sensitive client data — only an Administrator or the Career Services team can open it.</p>
      </div>
    );
  }

  const filtered = submissions.filter((s) => {
    if (!query.trim()) return true;
    const haystack = `${s.firstName} ${s.lastName} ${s.email} ${s.preferredJobTitles} ${s.caseNumber}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function managerName(id: string | undefined) {
    return staff.find((u) => u.id === id)?.name;
  }

  function actionsFor(submission: OnboardingSubmission): RowAction[] {
    return [
      { label: "View details", icon: "visibility", onSelect: () => setViewing(submission) },
      { label: "Delete", icon: "delete", tone: "danger", onSelect: () => setDeleting(submission) },
    ];
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants}>
          <ModuleHeader
            title="Client Onboarding"
            summary={
              <>
                <AnimatedNumber value={submissions.length} /> submission{submissions.length === 1 ? "" : "s"} from the Profile
                Marketing intake form.
              </>
            }
            action={
              submissions.length > 0 && (
                <PrimaryActionButton icon="download" label="Download as Excel" onClick={() => downloadOnboardingCSV(filtered, staff)} />
              )
            }
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <SearchInput id="onboarding-search" value={query} onChange={setQuery} label="Search by name, email, case #, or job title…" />
        </motion.div>

        <motion.section variants={itemVariants} className={`rounded-xl border border-slate-200 bg-white ${CARD_SURFACE}`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-slate-500">
              <MaterialIcon name={submissions.length === 0 ? "assignment_ind" : "search_off"} className="text-[32px] text-slate-300" />
              <p>
                {submissions.length === 0
                  ? "No submissions yet — new ones arrive automatically once the onboarding form is connected."
                  : `Nothing matches "${query}".`}
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th scope="col" className="px-5 py-2.5">Case</th>
                  <th scope="col" className="px-3 py-2.5">Name</th>
                  <th scope="col" className="hidden px-3 py-2.5 md:table-cell">Account Manager</th>
                  <th scope="col" className="hidden px-3 py-2.5 lg:table-cell">Preferred Role</th>
                  <th scope="col" className="hidden px-3 py-2.5 sm:table-cell">Submitted</th>
                  <th scope="col" className="w-12 px-3 py-2.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((s) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      onClick={() => setViewing(s)}
                    >
                      <td className="px-5 py-3 text-sm font-semibold tabular-nums text-slate-500">#{s.caseNumber}</td>
                      <td className="px-3 py-3">
                        <p className="truncate font-sans text-sm font-semibold text-navy-950">{s.firstName} {s.lastName}</p>
                        <p className="truncate text-xs text-slate-500">{s.email}</p>
                      </td>
                      <td className="hidden px-3 py-3 text-sm text-slate-600 md:table-cell">
                        {managerName(s.accountManagerId) ?? <span className="text-slate-400">Unassigned</span>}
                      </td>
                      <td className="hidden truncate px-3 py-3 text-sm text-slate-600 lg:table-cell">{s.preferredJobTitles}</td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-slate-500 sm:table-cell">{formatRelativeTime(s.submittedAt)}</td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <RowActionsMenu actions={actionsFor(s)} label="Submission actions" />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.section>
      </motion.div>

      {viewing && <DetailModal submission={viewing} onClose={() => setViewing(null)} />}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this submission?"
        description={deleting ? `"${deleting.firstName} ${deleting.lastName}"'s onboarding submission (case #${deleting.caseNumber}) will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Submission"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          const result = await deleteSubmission(deleting.id, currentUser);
          if (!result.ok) toast.error("Couldn't delete", { description: result.reasons[0] });
          else toast.success("Submission deleted");
          setDeleting(null);
        }}
      />
    </>
  );
}

/** Mirrors supabase/022_onboarding_submissions.sql's own RLS exactly — Viewers get nothing here regardless of department, unlike everywhere else in this dashboard. The database would refuse the read either way; this just tells someone why the page looks empty instead of leaving them guessing. */
function canAccessOnboarding(user: { role: string; department: string }): boolean {
  return user.role === "administrator" || (user.role === "editor" && user.department === "career-services-operations");
}
