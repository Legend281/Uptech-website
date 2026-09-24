"use client";

import { useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CurrentUserProvider } from "@/components/admin/providers/CurrentUserProvider";
import { LeadsProvider } from "@/components/admin/providers/LeadsProvider";
import { ActivityProvider } from "@/components/admin/providers/ActivityProvider";
import { ServicePagesProvider } from "@/components/admin/providers/ServicePagesProvider";
import { JobPostingsProvider } from "@/components/admin/providers/JobPostingsProvider";

export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CurrentUserProvider>
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
    </CurrentUserProvider>
  );
}
