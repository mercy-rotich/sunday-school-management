import type { ReactNode } from "react";
import type { MetricVariant } from "@/types";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  variant?: MetricVariant;
  icon: ReactNode;
}

const VARIANTS: Record<MetricVariant, {
  card: string;
  label: string;
  value: string;
  sub: string;
  well: string;
  pulse: string | null;
}> = {
  default: {
    card:  "bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800",
    label: "text-xs font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wide",
    value: "text-2xl font-bold text-slate-900 dark:text-slate-50",
    sub:   "text-sm text-slate-600 dark:text-slate-300",
    well:  "flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 size-10",
    pulse: null,
  },
  birthday: {
    card:  "bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800",
    label: "text-xs font-semibold text-slate-600 dark:text-slate-200 uppercase tracking-wide",
    value: "text-2xl font-bold text-slate-900 dark:text-slate-50",
    sub:   "text-sm text-slate-600 dark:text-slate-300",
    well:  "flex items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 size-10",
    pulse: null,
  },
  alert: {
    card:  "bg-rose-50 dark:bg-rose-900/10 rounded-xl shadow-card border border-rose-200 dark:border-rose-800",
    label: "text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide",
    value: "text-2xl font-bold text-rose-800 dark:text-rose-200",
    sub:   "text-sm text-rose-700 dark:text-rose-300",
    well:  "flex items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 size-10 relative",
    pulse: "absolute -top-1 -right-1 size-3 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 animate-pulse-soft",
  },
};

export function MetricCard({ label, value, sub, variant = "default", icon }: MetricCardProps) {
  const v = VARIANTS[variant];
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${v.card}`}>
      <div className="flex items-start justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wide ${v.label}`}>
          {label}
        </span>
        <div className={`relative ${v.well}`}>
          {icon}
          {v.pulse && <span className={v.pulse} />}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-bold tracking-tight ${v.value}`}>{value}</p>
        {sub && <p className={`mt-1.5 text-sm font-medium ${v.sub}`}>{sub}</p>}
      </div>
    </div>
  );
}
