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
    card:  "bg-white border border-stone-200",
    label: "text-stone-400",
    value: "text-stone-800",
    sub:   "text-stone-400",
    well:  "bg-sky-50 text-sky-600",
    pulse: null,
  },
  birthday: {
    card:  "bg-white border border-stone-200",
    label: "text-stone-400",
    value: "text-stone-800",
    sub:   "text-stone-400",
    well:  "bg-violet-50 text-violet-600",
    pulse: null,
  },
  alert: {
    card:  "bg-amber-50 border border-amber-200",
    label: "text-amber-700",
    value: "text-amber-900",
    sub:   "text-amber-600",
    well:  "bg-amber-100 text-amber-600",
    pulse: "absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-amber-400 border-2 border-amber-50 animate-pulse",
  },
};

export function MetricCard({ label, value, sub, variant = "default", icon }: MetricCardProps) {
  const v = VARIANTS[variant];
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-3 shadow-sm ${v.card}`}>
      <div className="flex items-start justify-between">
        <span className={`text-[10px] font-extrabold tracking-[0.08em] uppercase ${v.label}`}>
          {label}
        </span>
        <div className={`relative size-9 rounded-lg flex items-center justify-center ${v.well}`}>
          {icon}
          {v.pulse && <span className={v.pulse} />}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight font-mono ${v.value}`}>{value}</p>
        {sub && <p className={`mt-1 text-[11px] ${v.sub}`}>{sub}</p>}
      </div>
    </div>
  );
}
