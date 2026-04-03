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
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  if (!data) return null;

  const { birthdays, deposits } = data;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Upcoming birthdays ── */}
      <div>
        <p className="text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400 mb-3">
          Upcoming this month
        </p>
        <div className="flex flex-col gap-2">
          {birthdays.map((b) => (
            <div
              key={b.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                b.daysUntil <= 7
                  ? "bg-violet-50 border-violet-200"
                  : "bg-stone-50 border-stone-100"
              }`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                  b.daysUntil <= 7
                    ? "bg-violet-100 text-violet-600"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                <IC.Cake className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 truncate">{b.name}</p>
                <p className="text-[10px] text-stone-400">
                  Turns {b.age} · {b.date}
                </p>
              </div>
              <span
                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  b.daysUntil <= 7
                    ? "bg-violet-100 text-violet-700"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {b.daysUntil}d
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* ── Recent BDAY deposits ── */}
      <div>
        <p className="text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400 mb-3">
          Recent BDAY deposits
        </p>
        <div className="flex flex-col gap-2">
          {deposits.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100"
            >
              <div>
                <p className="text-xs font-semibold text-emerald-800">{d.childName}</p>
                <p className="text-[10px] text-emerald-400">{d.time}</p>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700">
                +{fmt(d.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
