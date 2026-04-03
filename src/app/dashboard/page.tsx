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
          icon={<IC.Trend className="size-4" />}
        />
        <MetricCard
          label="Birthday Fund Balance"
          value={dashLoading ? "—" : fmt(dash!.birthdayFund)}
          sub="BDAY reference payments · auto-routed"
          variant="birthday"
          icon={<IC.Gift className="size-4" />}
        />
        <MetricCard
          label="Action Required"
          value={`${liveCount} payment${liveCount !== 1 ? "s" : ""}`}
          sub="Awaiting manual allocation in triage"
          variant="alert"
          icon={<IC.Alert className="size-4" />}
        />
      </section>

      {/* Triage + Birthday — stacked on mobile, side by side on xl */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_316px] gap-4">

        {/* Triage */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-stone-800">Triage Queue</h2>
              {triage && triage.length > 0 && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {triage.length} pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Payments the system couldn&apos;t auto-allocate. Assign each to a child and save.
            </p>
          </div>
          <TriageTable payments={triage} onAllocate={allocate} isLoading={triageLoading} />
        </div>

        {/* Birthday Module */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-stone-100 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <IC.Cake className="size-4 text-violet-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-800 leading-none">Birthday Module</h2>
              <p className="text-[10px] text-stone-400 mt-0.5">July 2025</p>
            </div>
          </div>
          <div className="p-4">
            <BirthdayModule data={bdayData} isLoading={bdayLoading} />
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm px-4 md:px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <IC.Activity className="size-4 text-sky-500 shrink-0" />
          <h2 className="text-sm font-bold text-stone-800">Recent Activity</h2>
          <span className="text-stone-300 text-xs hidden sm:inline">
            · Latest automated &amp; manual events
          </span>
        </div>
        <div className="flex flex-col">
          {dashLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-7 mb-2" />)
            : dash!.activity.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-start sm:items-center gap-3 py-2.5 ${
                  i < dash!.activity.length - 1 ? "border-b border-stone-50" : ""
                }`}
              >
                <span className={`size-2 rounded-full shrink-0 mt-1.5 sm:mt-0 ${
                  item.type === "success"  ? "bg-emerald-400" :
                  item.type === "birthday" ? "bg-violet-400"  : "bg-amber-400"
                }`} />
                <span className="flex-1 text-[12px] text-stone-500">{item.desc}</span>
                <span className="text-[11px] text-stone-300 shrink-0">{item.time}</span>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
}