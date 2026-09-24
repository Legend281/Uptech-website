import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { mockServicePages } from "@/lib/admin/mockData";
import { getReviewStatus } from "@/lib/admin/staleness";

/*
 * This will be a real, live-data internal tool on the production domain —
 * never something Google or Bing should index or crawl, mock-data preview
 * or not.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const overdueCount = mockServicePages.filter((page) => getReviewStatus(page) === "overdue").length;

  return (
    <>
      <AdminShell urgentCount={overdueCount}>{children}</AdminShell>
      {/*
       * Mounted once, as a sibling to AdminShell rather than nested inside
       * it — modals in this section (LeadFormDialog, ConfirmDialog,
       * LeadQuickViewModal) are plain fixed-position divs, not portals, so
       * keeping the Toaster outside their DOM subtree entirely is what
       * guarantees a toast fired from inside one never ends up trapped
       * behind its overlay.
       */}
      <Toaster richColors position="top-right" />
    </>
  );
}
