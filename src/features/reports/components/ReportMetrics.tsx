"use client";

import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

const METRICS = {
  totalContributions: 376450,
  totalExpenses:      89200,
};
const netBalance = METRICS.totalContributions - METRICS.totalExpenses;

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  variant: "default" | "expense" | "net";
}

function MetricCard({ label, value, sub, icon, variant }: MetricCardProps) {
  const styles = {
    default: {
      card:  "bg-white border border-stone-200",
      label: "text-stone-400",
      value: "text-stone-800",
      sub:   "text-stone-400",
      well:  "bg-sky-50 text-sky-600",
    },
    expense: {
      card:  "bg-white border border-stone-200",
      label: "text-stone-400",
      value: "text-stone-800",
      sub:   "text-stone-400",
      well:  "bg-rose-50 text-rose-500",
    },
    net: {
      card:  "bg-emerald-50 border border-emerald-200",
      label: "text-emerald-700",
      value: "text-emerald-800",
      sub:   "text-emerald-600",
      well:  "bg-emerald-100 text-emerald-600",
    },
  }[variant];

  return (
    <div className={`rounded-xl p-5 flex flex-col gap-3 shadow-sm ${styles.card}`}>
      <div className="flex items-start justify-between">
        <span className={`text-[10px] font-extrabold tracking-[0.08em] uppercase ${styles.label}`}>
          {label}
        </span>
        <div className={`size-9 rounded-lg flex items-center justify-center ${styles.well}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight font-mono ${styles.value}`}>{value}</p>
        <p className={`mt-1 text-[11px] ${styles.sub}`}>{sub}</p>
      </div>
    </div>
  );
}

export function ReportMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Total General Contributions"
        value={fmt(METRICS.totalContributions)}
        sub="All time · since January 2024"
        variant="default"
        icon={<IC.Trend className="size-4" />}
      />
      <MetricCard
        label="Total Expenses"
        value={fmt(METRICS.totalExpenses)}
        sub="All outflows · approved by admin"
        variant="expense"
        icon={<IC.ArrowRight className="size-4 rotate-90" />}
      />
      <MetricCard
        label="Net Balance (Available)"
        value={fmt(netBalance)}
        sub="Contributions minus all expenses"
        variant="net"
        icon={<IC.Wallet className="size-4" />}
      />
    </div>
  );
}