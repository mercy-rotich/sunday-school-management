"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const [collapsed, setCollapsed] = useState(false);

  // Don't show shell layout on auth pages
  if (isAuthPage) {
    return <main className="flex-1 bg-slate-50 dark:bg-slate-950">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        unallocatedCount={5}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
        <TopHeader />
        <main className="flex-1 bg-slate-50 dark:bg-slate-950">{children}</main>
      </div>
    </div>
  );
}