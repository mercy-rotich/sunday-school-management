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
      card:  "bg-slate-900 border border-slate-800 border-l-4 border-l-[#00A551]",
      label: "text-green-300",
      value: "text-slate-100",
      sub:   "text-slate-300",
      well:  "bg-green-900/30 text-[#00A551]",
    },
    expense: {
      card:  "bg-slate-900 border border-slate-800 border-l-4 border-l-rose-500",
      label: "text-rose-300",
      value: "text-slate-100",
      sub:   "text-slate-300",
      well:  "bg-rose-900/20 text-rose-400",
    },
    net: {
      card:  "bg-green-900/20 border border-green-900/50 border-l-4 border-l-[#00A551]",
      label: "text-green-300",
      value: "text-[#00A551]",
      sub:   "text-green-300",
      well:  "bg-green-900/40 text-[#00A551]",
    },
  }[variant];

  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${styles.card}`}>
      <div className="flex items-start justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.label}`}>
          {label}
        </span>
        <div className={`size-10 rounded-xl flex items-center justify-center ${styles.well}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight font-mono ${styles.value}`}>{value}</p>
        <p className={`mt-1 text-sm ${styles.sub}`}>{sub}</p>
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
        icon={<IC.Trend className="size-5" />}
      />
      <MetricCard
        label="Total Expenses"
        value={fmt(METRICS.totalExpenses)}
        sub="All outflows · approved by admin"
        variant="expense"
        icon={<IC.ArrowRight className="size-5 rotate-90" />}
      />
      <MetricCard
        label="Net Balance (Available)"
        value={fmt(netBalance)}
        sub="Contributions minus all expenses"
        variant="net"
        icon={<IC.Wallet className="size-5" />}
      />
    </div>
  );
}
