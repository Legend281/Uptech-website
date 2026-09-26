"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { InfoNotice, ModuleHeader } from "@/components/admin/FormParts";
import { AssignmentSettings } from "@/components/admin/settings/AssignmentSettings";
import { CompanySettings, NotificationSettings, ReviewCycleSettings } from "@/components/admin/settings/OtherSettings";
import { UsersSettings } from "@/components/admin/settings/UsersSettings";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useSettings } from "@/components/admin/providers/SettingsProvider";
import { canEditSystemSettings } from "@/lib/admin/settings";

type Tab = "assignment" | "users" | "notifications" | "reviews" | "company";

const tabs: { value: Tab; label: string; icon: string; adminOnly: boolean }[] = [
  { value: "assignment", label: "Lead assignment", icon: "alt_route", adminOnly: true },
  { value: "users", label: "Users & roles", icon: "manage_accounts", adminOnly: true },
  { value: "notifications", label: "Your notifications", icon: "notifications", adminOnly: false },
  { value: "reviews", label: "Compliance review cycles", icon: "event_repeat", adminOnly: true },
  { value: "company", label: "Company details", icon: "apartment", adminOnly: true },
];

/*
 * Admin_Content_Pages_Spec.md Section 4. System configuration rather than
 * content, so it gets extra care: every section saves explicitly (no
 * change applies while you're still typing), each shows what's unsaved,
 * and every change is logged. Non-Administrators only see their own
 * notification preferences.
 */
export default function SettingsPage() {
  const currentUser = useCurrentUser();
  const { loaded } = useSettings();
  const isAdmin = canEditSystemSettings(currentUser);
  const visibleTabs = tabs.filter((t) => isAdmin || !t.adminOnly);
  const [tab, setTab] = useState<Tab>("assignment");
  const active = visibleTabs.some((t) => t.value === tab) ? tab : visibleTabs[0].value;

  return (
    <>
      <ModuleHeader
        title="Settings"
        summary={isAdmin ? "System configuration. Changes here affect everyone, so each one is recorded in the Activity feed." : "Your personal preferences. The rest of Settings is for Administrators."}
      />
      <InfoNotice>Settings are saved in this browser only for now.</InfoNotice>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col">
          {visibleTabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              aria-current={active === t.value ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                active === t.value ? "bg-navy-950 text-white" : "text-slate-600 hover:bg-white hover:text-navy-950"
              }`}
            >
              <MaterialIcon name={t.icon} className="text-[18px]" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {/* Forms start from saved values, so wait until they're read. */}
          {!loaded ? (
            <p className="text-sm text-slate-500">Loading settings…</p>
          ) : (
            <>
              {active === "assignment" && <AssignmentSettings />}
              {active === "users" && <UsersSettings />}
              {active === "notifications" && <NotificationSettings key={currentUser.id} />}
              {active === "reviews" && <ReviewCycleSettings />}
              {active === "company" && <CompanySettings />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
