"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CurrentUserProvider, useCurrentUserStatus } from "@/components/admin/providers/CurrentUserProvider";
import { MfaChallengeScreen } from "@/components/admin/MfaChallengeScreen";
import { StaffProvider } from "@/components/admin/providers/StaffProvider";
import { LeadsProvider } from "@/components/admin/providers/LeadsProvider";
import { ActivityProvider } from "@/components/admin/providers/ActivityProvider";
import { ServicePagesProvider } from "@/components/admin/providers/ServicePagesProvider";
import { JobPostingsProvider } from "@/components/admin/providers/JobPostingsProvider";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
      <MaterialIcon name="progress_activity" className="animate-spin text-[28px] text-slate-400" />
    </div>
  );
}

/**
 * Hit the moment a real Supabase Auth user exists but has no matching
 * profiles row (e.g. an account created in the dashboard before someone
 * remembered to insert the row — see supabase/003_staff_auth.sql's own
 * comment on how a new staff account is provisioned). Without this, that
 * account would sit on FullPageSpinner forever with no way to tell why or
 * get out.
 */
function NoProfileState() {
  const { signOut } = useCurrentUserStatus();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F7F8FA] px-4 text-center">
      <MaterialIcon name="person_off" className="text-[28px] text-slate-400" />
      <p className="max-w-sm text-sm text-slate-600">
        You&apos;re signed in, but no staff profile is set up for this account yet. Ask an Administrator to add one
        (Supabase dashboard → profiles table).
      </p>
      <button type="button" onClick={() => void signOut()} className="text-sm font-semibold text-teal-700 hover:text-teal-800">
        Sign out
      </button>
    </div>
  );
}

/** Everything below the session gate — only mounts once a real, loaded AdminUser exists, so every consumer's useCurrentUser() call is guaranteed non-null. */
function AuthenticatedShell({ children }: { children: ReactNode }) {
  const { currentUser, loading, mfaPending } = useCurrentUserStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <FullPageSpinner />;
  if (mfaPending) return <MfaChallengeScreen />;
  if (!currentUser) return <NoProfileState />;

  return (
    <StaffProvider>
      <LeadsProvider>
        <ActivityProvider>
          <ServicePagesProvider>
            <JobPostingsProvider>
              {/* reducedMotion="user" makes every motion.* / AnimatePresence animation in this section defer to the OS-level prefers-reduced-motion setting automatically. */}
              <MotionConfig reducedMotion="user">
                <div className="min-h-screen bg-[#F7F8FA]">
                  <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <div className="lg:pl-72">
                    {/* Reads its own urgent count from ServicePagesProvider now, live — a server-computed prop here would freeze at build time and never reflect a Resolve action. */}
                    <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
                    <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                  </div>
                </div>
              </MotionConfig>
            </JobPostingsProvider>
          </ServicePagesProvider>
        </ActivityProvider>
      </LeadsProvider>
    </StaffProvider>
  );
}

/** /admin/login renders standalone — no sidebar, no topbar, no data providers (there's no session yet for them to fetch anything with). middleware.ts is what actually keeps an unauthenticated visitor off every other /admin route. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login" || pathname === "/admin/set-password") return <>{children}</>;

  return (
    <CurrentUserProvider>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </CurrentUserProvider>
  );
}
