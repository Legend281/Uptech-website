import { MaterialIcon } from "@/components/icons/MaterialIcon";

type ComplianceDisclaimerProps = {
  lastReviewed: string;
  reviewedBy?: string;
  extraNote?: string;
};

/**
 * Mandatory Template C element per CLAUDE.md Section 4: visible disclaimer +
 * permanent "Last reviewed" date, since this content can go legally stale.
 *
 * `reviewedBy` default is "Uptech Consulting Management" per
 * Admin_Dashboard_Requirements.md Section 5's confirmed team answer — this
 * replaced an earlier unverified "Uptech Consulting Legal & Corporate
 * Administration Desk" placeholder that had never actually been confirmed
 * against a real company document. None of the 4 Template C pages override
 * this prop, so fixing the default here resolves all 4 at once. The field
 * stays editable per-page (via this prop) in case a different department
 * reviews a specific page in the future.
 *
 * The `lastReviewed` date is being migrated to real Supabase-backed data as
 * part of the Service Pages / Compliance Review admin module — until that
 * lands, each page still passes it as a hardcoded string literal (see each
 * page's own <ComplianceDisclaimer lastReviewed="..." /> call).
 */
export function ComplianceDisclaimer({
  lastReviewed,
  reviewedBy = "Uptech Consulting Management",
  extraNote,
}: ComplianceDisclaimerProps) {
  return (
    <section className="w-full py-8 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <MaterialIcon name="policy" className="text-[22px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compliance Notice</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This information is general guidance. Requirements may change — confirm current
              details with your Uptech Consulting consultant.
              {extraNote ? ` ${extraNote}` : ""}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
              <span>
                Last reviewed: <strong className="text-slate-700">{lastReviewed}</strong> by {reviewedBy}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
