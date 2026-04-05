"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IC } from "@/components/ui/Icons";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  unallocatedCount: number;
}

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/dashboard", Icon: IC.Grid,  badge: false },
  { label: "Children",      href: "/children",  Icon: IC.Users, badge: false },
  { label: "Birthday Fund", href: "/birthdays", Icon: IC.Gift,  badge: false },
  { label: "Triage Queue",  href: "/triage",    Icon: IC.Alert, badge: true  },
  { label: "Reports",       href: "/reports",   Icon: IC.Trend, badge: false },
];

export function Sidebar({ collapsed, onToggle, unallocatedCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        flex flex-col shrink-0 bg-[#0D2B1C]
        transition-all duration-[280ms] ease-in-out
        w-[60px] ${collapsed ? "sm:w-[72px]" : "sm:w-[224px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-center sm:justify-start border-b border-white/[0.08] py-5 px-0 sm:px-4 gap-0 sm:gap-3">
        <div className="size-9 rounded-xl bg-[#00A551] flex items-center justify-center text-white text-base shrink-0 leading-none font-extrabold shadow-sm">
          ✝
        </div>
        <div className={`hidden ${collapsed ? "sm:hidden" : "sm:block"}`}>
          <p className="text-sm font-bold text-white leading-tight">SundaySchool</p>
          <p className="text-xs text-[#4ade80] mt-0.5 font-medium">Finance Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, Icon, badge }) => {
          const active    = pathname === href || pathname.startsWith(href + "/");
          const showBadge = badge && unallocatedCount > 0;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`
                relative flex items-center justify-center rounded-xl
                transition-all duration-150 overflow-hidden py-3
                ${collapsed ? "sm:justify-center sm:px-0" : "sm:justify-start sm:gap-3 sm:px-3"}
                ${active
                  ? "bg-[#00A551] text-white shadow-sm"
                  : "text-green-300 hover:text-white hover:bg-[#1A4A2E]"}
              `}
            >
              <Icon className="size-5 shrink-0" />
              <span className={`text-sm hidden ${collapsed ? "sm:hidden" : "sm:block"} ${active ? "font-bold" : "font-medium"} flex-1`}>
                {label}
              </span>
              {!collapsed && showBadge && (
                <span className="text-xs font-bold bg-[#FF6B2B] text-white px-2 py-0.5 rounded-full leading-none hidden sm:block">
                  {unallocatedCount}
                </span>
              )}
              {showBadge && (
                <span className="absolute top-1 right-1 size-2.5 rounded-full bg-[#FF6B2B] border-2 border-[#0D2B1C]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle — desktop only */}
      <div className={`border-t border-white/[0.08] py-3 hidden sm:flex ${collapsed ? "justify-center" : "justify-end px-3"}`}>
        <button
          onClick={onToggle}
          className="size-8 rounded-lg cursor-pointer flex items-center justify-center bg-white/[0.07] hover:bg-[#00A551] text-green-400 hover:text-white transition-all duration-150"
        >
          {collapsed ? <IC.ChevR className="size-4" /> : <IC.ChevL className="size-4" />}
        </button>
      </div>
    </aside>
  );
}
