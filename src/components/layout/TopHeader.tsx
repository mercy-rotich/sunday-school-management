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
    <header className="h-14 bg-white border-b border-stone-100 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[15px] text-stone-800">{pageTitle}</span>
        <span className="text-stone-300">·</span>
        <span className="text-[13px] text-stone-400">{month}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-[12px] font-medium text-stone-500 hover:border-stone-300 hover:text-stone-700 transition-colors cursor-pointer">
          <IC.Download className="size-3.5" />Export
        </button>
        <button className="relative size-8 rounded-lg border border-stone-100 bg-stone-50 flex items-center justify-center text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer">
          <IC.Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-400 border border-stone-50" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">T</div>
          <div>
            <p className="text-[12px] font-semibold text-stone-800 leading-none">Welcome, Teacher</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Admin · KE</p>
          </div>
        </div>
      </div>
    </header>
  );
}