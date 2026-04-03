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
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <IC.BarChart className="size-4 text-blue-600" />
          </div>
          <h1 className="text-[20px] md:text-[22px] font-bold text-stone-800 tracking-tight">
            Financial Reports
          </h1>
        </div>
        <p className="text-[13px] text-stone-400 ml-[42px]">
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
