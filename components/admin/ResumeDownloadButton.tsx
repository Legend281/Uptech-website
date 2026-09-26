"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const SIGNED_URL_TTL_SECONDS = 60 * 5; // 5 minutes — long enough to open, short enough not to matter if the tab is left open

/**
 * Shared by LeadQuickViewModal and LeadDetailContent. Works because every
 * authenticated staff member can read the resumes bucket (see
 * supabase/003_staff_auth.sql) — resumeUrl is a private storage path, not a
 * public link, so a fresh signed URL has to be generated per click rather
 * than rendered as a plain <a href>.
 */
export function ResumeDownloadButton({ resumeUrl }: { resumeUrl: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(resumeUrl, SIGNED_URL_TTL_SECONDS);
    setLoading(false);
    if (error || !data) {
      toast.error("Couldn't open resume", { description: error?.message ?? "Please try again." });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:border-teal-300 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <MaterialIcon name={loading ? "hourglass_top" : "description"} className="text-[14px]" />
      {loading ? "Opening…" : "Download Resume"}
    </button>
  );
}
