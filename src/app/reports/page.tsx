"use client";

import { ReportMetrics } from "@/features/reports/components/ReportMetrics";
import { MonthlyBreakdown } from "@/features/reports/components/MonthlyBreakdown";
import { ExpensesTable } from "@/features/reports/components/ExpensesTable";
import { IC } from "@/components/ui/Icons";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="size-10 rounded-xl bg-indigo-900/30 flex items-center justify-center shrink-0">
            <IC.BarChart className="size-5 text-indigo-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Financial Reports
          </h1>
        </div>
        <p className="text-sm text-slate-300 ml-[52px]">
          Overview of expenses and monthly financial breakdown
        </p>
      </div>

      {/* Metrics */}
      <ReportMetrics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlyBreakdown />
        <ExpensesTable />
      </div>
    </div>
  );
}
