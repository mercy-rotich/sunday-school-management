"use client";

import { IC } from "@/components/ui/Icons";

interface BirthdayChild {
  id: string;
  name: string;
  ageTurning: number;
  exactDate: string;
  parentPhone: string;
  daysUntil: number;
}

const MOCK_BIRTHDAYS: BirthdayChild[] = [
  { id: "b1", name: "Amara Odhiambo",  ageTurning: 8,  exactDate: "2025-07-08", parentPhone: "+254712345678", daysUntil: 5  },
  { id: "b2", name: "Felix Waweru",    ageTurning: 11, exactDate: "2025-07-14", parentPhone: "+254767890123", daysUntil: 11 },
  { id: "b3", name: "Grace Achieng",   ageTurning: 7,  exactDate: "2025-07-21", parentPhone: "+254778901234", daysUntil: 18 },
  { id: "b4", name: "David Otieno",    ageTurning: 9,  exactDate: "2025-07-29", parentPhone: "+254745678901", daysUntil: 26 },
  { id: "b5", name: "Karen Wanjiku",   ageTurning: 6,  exactDate: "2025-07-31", parentPhone: "+254711234568", daysUntil: 28 },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function DaysChip({ days }: { days: number }) {
  const urgent = days <= 7;
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
      urgent
        ? "bg-rose-50 text-rose-600 border-rose-200"
        : "bg-stone-50 text-stone-500 border-stone-200"
    }`}>
      {days === 0 ? "🎉 Today!" : `${days}d away`}
    </span>
  );
}

export function MonthlyBirthdays() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full">

      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold text-stone-800">This Month&apos;s Birthdays</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {MOCK_BIRTHDAYS.length} children celebrate in July 2025
          </p>
        </div>
        <div className="size-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <IC.Cake className="size-4 text-violet-500" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[480px]">
          <thead>
            <tr>
              {["Child", "Turning", "Date", "Parent Phone", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400 border-b border-stone-100 bg-stone-50/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_BIRTHDAYS.map((child, i) => (
              <tr
                key={child.id}
                className={`border-b border-stone-50 last:border-b-0 transition-colors ${
                  i % 2 === 0 ? "bg-white hover:bg-stone-50/60" : "bg-stone-50/30 hover:bg-stone-100/40"
                }`}
              >
                {/* Name */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {child.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-[13px] font-semibold text-stone-800 whitespace-nowrap">
                      {child.name}
                    </span>
                  </div>
                </td>

                {/* Age */}
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                    🎂 {child.ageTurning}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-3">
                  <span className="text-[12px] text-stone-600 whitespace-nowrap">
                    {formatDate(child.exactDate)}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                    <IC.Phone className="size-2.5 shrink-0" />
                    {child.parentPhone}
                  </span>
                </td>

                {/* Days until */}
                <td className="px-5 py-3">
                  <DaysChip days={child.daysUntil} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center gap-2">
        <IC.Info className="size-3.5 text-stone-300 shrink-0" />
        <p className="text-[11px] text-stone-400">
          SMS sent to parents on the 1st — contributions auto-route when reference is <span className="font-bold text-stone-600">BDAY</span>
        </p>
      </div>
    </div>
  );
}