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
    card:  "card-premium border-l-4 border-l-[#00A551]",
    label: "label-section text-[#007A3C]",
    value: "text-gradient-primary font-mono",
    sub:   "text-gray-500",
    well:  "icon-box-primary size-12",
    pulse: null,
  },
  birthday: {
    card:  "card-premium border-l-4 border-l-[#FF6B2B]",
    label: "label-section text-[#E05520]",
    value: "text-gradient-secondary font-mono",
    sub:   "text-gray-500",
    well:  "icon-box-secondary size-12",
    pulse: null,
  },
  alert: {
    card:  "card-premium border-l-4 border-l-red-500 bg-red-50/30",
    label: "label-section text-red-600",
    value: "text-red-800 font-mono",
    sub:   "text-red-500",
    well:  "flex items-center justify-center rounded-xl bg-red-100 text-red-500 size-12",
    pulse: "absolute -top-1 -right-1 size-3 rounded-full bg-red-500 border-2 border-white animate-pulse",
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
        <p className={`text-2xl font-bold tracking-tight ${v.value}`}>{value}</p>
        {sub && <p className={`mt-1 text-sm ${v.sub}`}>{sub}</p>}
      </div>
    </div>
  );
}
