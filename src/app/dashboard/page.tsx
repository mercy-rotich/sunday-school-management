"use client";

import { MetricCard } from "@/components/ui/MetricCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { TriageTable } from "@/features/triage/components/TriageTable";
import { BirthdayModule } from "@/features/birthdays/components/BirthdayModule";
import { useTriagePayments } from "@/features/triage/hooks/useTriagePayments";
import { useBirthdayData } from "@/features/birthdays/hooks/useBirthdayData";
import { useDashboardData } from "@/hooks/useDashboardData";
import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

export default function DashboardPage() {
  const { data: triage,   isLoading: triageLoading, allocate } = useTriagePayments();
  const { data: bdayData, isLoading: bdayLoading }             = useBirthdayData();
  const liveCount                                              = triage ? triage.length : 4;
  const { data: dash,     isLoading: dashLoading }             = useDashboardData(liveCount);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* Metrics — 1 col mobile, 3 col desktop */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Total General Contributions"
          value={dashLoading ? "—" : fmt(dash!.totalGeneral)}
          sub="All allocated payments · July 2025"
          variant="default"
          icon={<IC.Trend className="size-5" />}
        />
        <MetricCard
          label="Birthday Fund Balance"
          value={dashLoading ? "—" : fmt(dash!.birthdayFund)}
          sub="BDAY reference payments · auto-routed"
          variant="birthday"
          icon={<IC.Gift className="size-5" />}
        />
        <MetricCard
          label="Action Required"
          value={`${liveCount} payment${liveCount !== 1 ? "s" : ""}`}
          sub="Awaiting manual allocation in Payment Allocation"
          variant="alert"
          icon={<IC.Alert className="size-5" />}
        />
      </section>

      {/* Triage + Birthday — stacked on mobile, side by side on xl */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_316px] gap-4">

        {/* Payment Allocation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 dark:bg-slate-800/50">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Payment Allocation</h2>
                {triage && triage.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs font-semibold ring-1 ring-rose-600/20 dark:ring-rose-600/20">
                    {triage.length} pending
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                Payments that couldn&apos;t be auto-assigned. Review and assign each to a child.
              </p>
            </div>
          </div>
          <TriageTable payments={triage} onAllocate={allocate} isLoading={triageLoading} />
        </div>

        {/* Birthday Module */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800/50">
            <div className="size-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <IC.Cake className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">Birthday Module</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-0.5">July 2025</p>
            </div>
          </div>
          <div className="p-4">
            <BirthdayModule data={bdayData} isLoading={bdayLoading} />
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800 px-4 md:px-5 py-4">
        <div className="flex items-center gap-2 mb-4">
          <IC.Activity className="size-5 text-primary-600 dark:text-primary-400 shrink-0" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          <span className="text-slate-300 text-sm hidden sm:inline">
            · Latest automated &amp; manual events
          </span>
        </div>
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {dashLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 my-1" />)
            : dash!.activity.map((item) => (
              <div key={item.id} className="flex items-start sm:items-center gap-3 py-3">
                <span className={`size-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                  item.type === "success"  ? "bg-primary-500" :
                  item.type === "birthday" ? "bg-amber-500" : "bg-yellow-400"
                }`} />
                <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">{item.desc}</span>
                <span className="text-sm text-slate-400 dark:text-slate-300 shrink-0">{item.time}</span>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
}
