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
        flex flex-col bg-slate-900 shrink-0
        transition-all duration-[280ms] ease-in-out
        w-[56px] ${collapsed ? "sm:w-[68px]" : "sm:w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-center sm:justify-start border-b border-white/[0.06] py-5 px-0 sm:px-5 gap-0 sm:gap-3">
        <div className="size-[34px] rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[15px] shrink-0 leading-none font-bold">
          ✝
        </div>
        <div className={`hidden ${collapsed ? "sm:hidden" : "sm:block"} ml-0`}>
          <p className="text-[14px] font-bold text-slate-100 leading-tight tracking-[-0.2px]">SundaySchool</p>
          <p className="text-[9px] font-medium text-slate-500 tracking-[0.08em] uppercase mt-0.5">Finance Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1.5 sm:px-2 py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, Icon, badge }) => {
          const active    = pathname === href || pathname.startsWith(href + "/");
          const showBadge = badge && unallocatedCount > 0;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`
                relative flex items-center justify-center rounded-lg
                transition-all duration-150 overflow-hidden py-2.5
                ${collapsed ? "sm:justify-center sm:px-0" : "sm:justify-start sm:gap-3 sm:px-3"}
                ${active
                  ? "[background:rgba(59,130,246,0.12)] text-blue-400"
                  : "bg-transparent text-slate-400 hover:text-slate-200 hover:[background:rgba(255,255,255,0.03)]"}
              `}
            >
              {active && <span className="absolute left-0 inset-y-0 w-[3.5px] bg-blue-500 rounded-r" />}
              <Icon className="size-[18px] shrink-0" />
              <span className={`text-[13px] leading-none hidden ${collapsed ? "sm:hidden" : "sm:block"} ${active ? "font-semibold text-blue-300" : "font-normal"} flex-1`}>
                {label}
              </span>
              {!collapsed && showBadge && (
                <span className="text-[10px] font-extrabold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none hidden sm:block">
                  {unallocatedCount}
                </span>
              )}
              {showBadge && (
                <span className="absolute top-[3px] right-[3px] size-2 rounded-full bg-amber-400 border-[1.5px] border-slate-900" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle — desktop only */}
      <div className={`border-t border-white/[0.06] py-3 hidden sm:flex ${collapsed ? "justify-center" : "justify-end px-3"}`}>
        <button
          onClick={onToggle}
          className="size-7 rounded-[6px] border-0 cursor-pointer flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.09] text-slate-500 hover:text-slate-300 transition-all duration-150"
        >
          {collapsed ? <IC.ChevR className="size-3.5" /> : <IC.ChevL className="size-3.5" />}
        </button>
      </div>
    </aside>
  );
}