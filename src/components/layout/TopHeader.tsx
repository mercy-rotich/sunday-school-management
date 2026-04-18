"use client";

import { usePathname } from "next/navigation";
import { IC } from "@/components/ui/Icons";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/children":  "Children",
  "/birthdays": "Birthday Fund",
  "/triage":    "Payment Allocation",
  "/reports":   "Reports",
};

export function TopHeader() {
  const pathname  = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";
  const month     = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="font-semibold text-lg text-slate-900 dark:text-white">{pageTitle}</h1>
        <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
        <span className="text-sm text-slate-500 dark:text-slate-300 hidden sm:inline">{month}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-700 hidden sm:inline-flex">
          <IC.Download className="size-4" />Export
        </button>
        <button className="relative size-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <IC.Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-rose-500 border border-white dark:border-slate-900 animate-pulse-soft" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="bg-primary-600 flex items-center justify-center rounded-lg size-9 text-white text-xs font-bold shadow-sm shrink-0">T</div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">Welcome, Teacher</p>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">Admin · KE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
