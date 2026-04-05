"use client";

import { IC } from "@/components/ui/Icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { fmt } from "@/lib/utils";
import type { BirthdayData } from "../types";

interface BirthdayModuleProps {
  data: BirthdayData | null;
  isLoading: boolean;
}

export function BirthdayModule({ data, isLoading }: BirthdayModuleProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const { birthdays, deposits } = data;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Upcoming birthdays ── */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
          Upcoming this month
        </p>
        <div className="flex flex-col gap-2">
          {birthdays.map((b) => (
            <div
              key={b.id}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl border ${
                b.daysUntil <= 7
                  ? "bg-orange-50 border-orange-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                  b.daysUntil <= 7
                    ? "bg-orange-100 text-[#FF6B2B]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <IC.Cake className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{b.name}</p>
                <p className="text-xs text-gray-400">
                  Turns {b.age} · {b.date}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                  b.daysUntil <= 7
                    ? "bg-orange-100 text-[#FF6B2B]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {b.daysUntil}d
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* ── Recent BDAY deposits ── */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
          Recent BDAY deposits
        </p>
        <div className="flex flex-col gap-2">
          {deposits.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between px-3 py-3 rounded-xl bg-green-50 border border-green-100"
            >
              <div>
                <p className="text-sm font-semibold text-green-800">{d.childName}</p>
                <p className="text-xs text-green-500">{d.time}</p>
              </div>
              <span className="text-sm font-bold font-mono text-[#00A551]">
                +{fmt(d.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
