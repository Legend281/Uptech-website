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
 * FLAG FOR TEAM (raised during the CNPS Compliance page review, applies to
 * every page using this shared component, re-flagged during the 4-page
 * Business Formalisation & Compliance family audit): "Uptech Consulting
 * Legal & Corporate Administration Desk" is the default `reviewedBy`
 * attribution — confirm this is a real, existing internal department name
 * before it continues to appear on public pages. Not verified against any
 * company document; carried over from earlier page-building work without
 * confirmation. If it is NOT a real department/desk name, replace it with
 * accurate attribution (a real team name), or drop specific attribution
 * entirely and state "reviewed internally" instead — do not invent a
 * different-sounding name as a substitute guess. Left as-is until the team
 * answers; fixing it here resolves all 4 Template C pages at once.
 *
 * FLAG FOR TEAM: the `lastReviewed` date passed into this component by every
 * Template C page is currently a hardcoded string literal in that page's own
 * source (see each page's <ComplianceDisclaimer lastReviewed="..." />
 * call) — there is no Supabase wiring or admin-dashboard field behind it in
 * this codebase (no Supabase client exists anywhere in the project as of
 * this review). CLAUDE.md Section 8 calls for compliance pages to carry a
 * review-cadence flag "in the admin schema" — confirm with whoever owns the
 * admin dashboard build whether/when this becomes a real editable field,
 * rather than assuming it already is one.
 */
export function ComplianceDisclaimer({
  lastReviewed,
  reviewedBy = "Uptech Consulting Legal & Corporate Administration Desk",
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
