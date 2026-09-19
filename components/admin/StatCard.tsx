import Link from "next/link";
import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Sparkline } from "@/components/admin/Sparkline";

export type StatCardAccent = "teal" | "blue" | "amber" | "rose" | "emerald";

const accentClasses: Record<StatCardAccent, { chip: string; spark: string }> = {
  teal: { chip: "bg-teal-50 text-teal-600", spark: "text-teal-500" },
  blue: { chip: "bg-blue-50 text-blue-accent", spark: "text-blue-accent" },
  amber: { chip: "bg-amber-50 text-amber-600", spark: "text-amber-500" },
  rose: { chip: "bg-rose-50 text-rose-600", spark: "text-rose-500" },
  emerald: { chip: "bg-emerald-50 text-emerald-600", spark: "text-emerald-500" },
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  accent: StatCardAccent;
  href?: string;
  delta?: string;
  trend?: number[];
};

function CardShell({ children, href }: { children: ReactNode; href?: string }) {
  const className =
    "flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow" +
    (href ? " hover:shadow-md" : "");
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}

export function StatCard({ label, value, icon, accent, href, delta, trend }: StatCardProps) {
  const colors = accentClasses[accent];
  return (
    <CardShell href={href}>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.chip}`}>
          <MaterialIcon name={icon} className="text-[20px]" />
        </div>
        {href && <MaterialIcon name="arrow_forward" className="text-[16px] text-slate-300" />}
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-navy-950">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      {delta && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <MaterialIcon name="trending_up" className="text-[14px]" />
          {delta}
        </p>
      )}
      {trend && <Sparkline points={trend} colorClassName={colors.spark} />}
    </CardShell>
  );
}
