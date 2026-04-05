"use client";

import { usePathname } from "next/navigation";
import { IC } from "@/components/ui/Icons";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/children":  "Children",
  "/birthdays": "Birthday Fund",
  "/triage":    "Triage Queue",
  "/reports":   "Reports",
};

export function TopHeader() {
  const pathname  = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";
  const month     = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg text-gray-900">{pageTitle}</span>
        <span className="text-gray-300 hidden sm:inline">·</span>
        <span className="text-sm text-gray-500 hidden sm:inline">{month}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="btn-modern hidden sm:inline-flex">
          <IC.Download className="size-4" />Export
        </button>
        <button className="relative size-11 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all duration-150 active:scale-95">
          <IC.Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-[#FF6B2B] border border-white" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="bg-[#00A551] flex items-center justify-center rounded-xl size-10 text-white text-sm font-extrabold shadow-sm shrink-0">T</div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">Welcome, Teacher</p>
            <p className="text-xs text-gray-500 mt-0.5">Admin · KE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
