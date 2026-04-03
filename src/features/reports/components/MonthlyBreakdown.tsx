"use client";

import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

interface MonthRow {
  month: string;
  totalIn: number;
  totalOut: number;
}

const MOCK_MONTHLY: MonthRow[] = [
  { month: "Jul 2025", totalIn: 184500, totalOut: 3500  },
  { month: "Jun 2025", totalIn: 42300,  totalOut: 11050 },
  { month: "May 2025", totalIn: 38750,  totalOut: 16500 },
  { month: "Apr 2025", totalIn: 45200,  totalOut: 14800 },
  { month: "Mar 2025", totalIn: 29800,  totalOut: 8200  },
  { month: "Feb 2025", totalIn: 19400,  totalOut: 6500  },
  { month: "Jan 2025", totalIn: 16500,  totalOut: 7200  },
];

function NetChip({ net }: { net: number }) {
  const positive = net >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
      positive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-rose-50 text-rose-700 border-rose-200"
    }`}>
      {positive ? "+" : ""}{fmt(net)}
    </span>
  );
}

export function MonthlyBreakdown() {
  const grandIn  = MOCK_MONTHLY.reduce((s, r) => s + r.totalIn,  0);
  const grandOut = MOCK_MONTHLY.reduce((s, r) => s + r.totalOut, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold text-stone-800">Monthly Breakdown</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Inflows vs outflows by month</p>
        </div>
        <div className="size-8 rounded-lg bg-stone-50 flex items-center justify-center">
          <IC.PieChart className="size-4 text-stone-400" />
        </div>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-4 gap-2 px-5 py-2 bg-stone-50/60 border-b border-stone-100">
        {["Month", "In", "Out", "Net"].map((h) => (
          <span key={h} className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col divide-y divide-stone-50 overflow-x-auto">
        {MOCK_MONTHLY.map((row, i) => {
          const net = row.totalIn - row.totalOut;
          const isCurrentMonth = i === 0;
          return (
            <div
              key={row.month}
              className={`grid grid-cols-4 gap-2 items-center px-5 py-3 min-w-[320px] transition-colors hover:bg-stone-50/60 ${
                isCurrentMonth ? "bg-sky-50/40" : ""
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-stone-700 whitespace-nowrap">{row.month}</span>
                {isCurrentMonth && (
                  <span className="text-[8px] font-bold bg-sky-100 text-sky-600 px-1 py-0.5 rounded uppercase tracking-wide">
                    Now
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold font-mono text-emerald-700 whitespace-nowrap">
                {fmt(row.totalIn)}
              </span>
              <span className="text-[11px] font-bold font-mono text-rose-600 whitespace-nowrap">
                -{fmt(row.totalOut)}
              </span>
              <NetChip net={net} />
            </div>
          );
        })}
      </div>

      {/* Grand totals */}
      <div className="border-t-2 border-stone-200 bg-stone-50">
        <div className="grid grid-cols-4 gap-2 px-5 py-3.5 min-w-[320px]">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 tracking-wide">Total</span>
          <span className="text-[11px] font-extrabold font-mono text-emerald-700">{fmt(grandIn)}</span>
          <span className="text-[11px] font-extrabold font-mono text-rose-600">-{fmt(grandOut)}</span>
          <NetChip net={grandIn - grandOut} />
        </div>
      </div>
    </div>
  );
}