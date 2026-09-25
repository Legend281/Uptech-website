"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ActivityProvider } from "@/components/admin/providers/ActivityProvider";
import { CurrentUserProvider } from "@/components/admin/providers/CurrentUserProvider";
import { SettingsProvider } from "@/components/admin/providers/SettingsProvider";
import { LeadsProvider } from "@/components/admin/providers/LeadsProvider";
import { TestimonialsProvider } from "@/components/admin/providers/TestimonialsProvider";
import { TeamMembersProvider } from "@/components/admin/providers/TeamMembersProvider";
import { FaqItemsProvider } from "@/components/admin/providers/FaqItemsProvider";

/*
 * Provider order matters, outermost first:
 *   Activity  — everything below logs into it (Admin_Content_Pages_Spec.md 0.2)
 *   Users     — account changes log; everyone else reads the current user
 *   Settings  — reads the users list for assignment pools
 *   Leads     — auto-assignment reads Settings
 *   content modules
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ActivityProvider>
      <CurrentUserProvider>
        <SettingsProvider>
          <LeadsProvider>
            <TestimonialsProvider>
              <TeamMembersProvider>
                <FaqItemsProvider>
                  <div className="min-h-screen bg-[#F7F8FA]">
                    <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:pl-72">
                      <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
                      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                    </div>
                  </div>
                </FaqItemsProvider>
              </TeamMembersProvider>
            </TestimonialsProvider>
          </LeadsProvider>
        </SettingsProvider>
      </CurrentUserProvider>
    </ActivityProvider>
  );
}
