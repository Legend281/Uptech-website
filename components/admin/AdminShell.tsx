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
import { SettingsProvider } from "@/components/admin/providers/SettingsProvider";
import { LeadsProvider } from "@/components/admin/providers/LeadsProvider";
import { ActivityProvider } from "@/components/admin/providers/ActivityProvider";
import { ServicePagesProvider } from "@/components/admin/providers/ServicePagesProvider";
import { JobPostingsProvider } from "@/components/admin/providers/JobPostingsProvider";
import { TestimonialsProvider } from "@/components/admin/providers/TestimonialsProvider";
import { TeamMembersProvider } from "@/components/admin/providers/TeamMembersProvider";
import { FaqItemsProvider } from "@/components/admin/providers/FaqItemsProvider";
import { AdditionalServicesProvider } from "@/components/admin/providers/AdditionalServicesProvider";
import { OnboardingProvider } from "@/components/admin/providers/OnboardingProvider";
import { BlogPostsProvider } from "@/components/admin/providers/BlogPostsProvider";
import { PartnerLogosProvider } from "@/components/admin/providers/PartnerLogosProvider";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
      <MaterialIcon name="progress_activity" className="animate-spin text-[28px] text-slate-400" />
    </div>
  );
}

/**
 * Hit when a real Supabase Auth user can't read their own profiles row.
 * RLS makes two different cases look identical from here: no row exists
 * (account created outside the invite flow), or the row exists but is
 * deactivated (current_staff_role() returns null, so even reading your own
 * profile is refused). The copy covers both rather than guessing.
 */
function NoProfileState() {
  const { signOut } = useCurrentUserStatus();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F7F8FA] px-4 text-center">
      <MaterialIcon name="person_off" className="text-[28px] text-slate-400" />
      <p className="max-w-sm text-sm text-slate-600">
        You&apos;re signed in, but this account doesn&apos;t have dashboard access. It may have been deactivated, or never set
        up as a staff account. Ask an Administrator to check it under Staff.
      </p>
      <button type="button" onClick={() => void signOut()} className="text-sm font-semibold text-teal-700 hover:text-teal-800">
        Sign out
      </button>
    </div>
  );
}

/*
 * Everything below the session gate — only mounts once a real, loaded
 * AdminUser exists, so every consumer's useCurrentUser() call is guaranteed
 * non-null. Provider order matters, outermost first: Staff (everyone reads
 * the roster) -> Settings (assignment pools) -> the real data modules ->
 * the four content modules your teammate built (Testimonials/Team
 * Members/FAQ Items), which read Settings for their own assignment pools.
 */
function AuthenticatedShell({ children }: { children: ReactNode }) {
  const { currentUser, loading, mfaPending } = useCurrentUserStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <FullPageSpinner />;
  if (mfaPending) return <MfaChallengeScreen />;
  if (!currentUser) return <NoProfileState />;

  return (
    <StaffProvider>
      {/* ActivityProvider comes before Settings/Testimonials/TeamMembers/FaqItems — each of those logs into it internally via useLogActivity(), so it has to be an ancestor, not a sibling. */}
      <ActivityProvider>
        <SettingsProvider>
          <LeadsProvider>
            <ServicePagesProvider>
              <JobPostingsProvider>
                <TestimonialsProvider>
                  <TeamMembersProvider>
                    <FaqItemsProvider>
                      <AdditionalServicesProvider>
                        <OnboardingProvider>
                          <BlogPostsProvider>
                            <PartnerLogosProvider>
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
                            </PartnerLogosProvider>
                          </BlogPostsProvider>
                        </OnboardingProvider>
                      </AdditionalServicesProvider>
                    </FaqItemsProvider>
                  </TeamMembersProvider>
                </TestimonialsProvider>
              </JobPostingsProvider>
            </ServicePagesProvider>
          </LeadsProvider>
        </SettingsProvider>
      </ActivityProvider>
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
