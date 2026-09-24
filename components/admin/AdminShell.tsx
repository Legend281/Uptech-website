"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CurrentUserProvider } from "@/components/admin/providers/CurrentUserProvider";
import { LeadsProvider } from "@/components/admin/providers/LeadsProvider";

export function AdminShell({ urgentCount, children }: { urgentCount: number; children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CurrentUserProvider>
      <LeadsProvider>
        <div className="min-h-screen bg-[#F7F8FA]">
          <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:pl-72">
            <AdminTopbar urgentCount={urgentCount} onOpenSidebar={() => setSidebarOpen(true)} />
            <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </LeadsProvider>
    </CurrentUserProvider>
  );
}
