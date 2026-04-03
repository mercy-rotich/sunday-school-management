"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-stone-50 overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        unallocatedCount={5}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
        <TopHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}