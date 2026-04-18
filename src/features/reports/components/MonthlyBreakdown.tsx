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
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full border whitespace-nowrap ${
      positive
        ? "bg-green-900/20 text-green-300 border-green-900/50"
        : "bg-rose-900/20 text-rose-300 border-rose-900/50"
    }`}>
      {positive ? "+" : ""}{fmt(net)}
    </span>
  );
}

export function MonthlyBreakdown() {
  const grandIn  = MOCK_MONTHLY.reduce((s, r) => s + r.totalIn,  0);
  const grandOut = MOCK_MONTHLY.reduce((s, r) => s + r.totalOut, 0);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Monthly Breakdown</h2>
          <p className="text-sm text-slate-300 mt-0.5">Inflows vs outflows by month</p>
        </div>
        <div className="size-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <IC.PieChart className="size-5 text-slate-300" />
        </div>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-4 gap-2 px-5 py-2.5 bg-slate-900/60 border-b border-slate-800">
        {["Month", "In", "Out", "Net"].map((h) => (
          <span key={h} className="text-xs font-bold uppercase tracking-wide text-slate-200">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col divide-y divide-slate-800 overflow-x-auto">
        {MOCK_MONTHLY.map((row, i) => {
          const net = row.totalIn - row.totalOut;
          const isCurrentMonth = i === 0;
          return (
            <div
              key={row.month}
              className={`grid grid-cols-4 gap-2 items-center px-5 py-3.5 min-w-[320px] transition-colors hover:bg-slate-800/50 ${
                isCurrentMonth ? "bg-green-900/15" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200 whitespace-nowrap">{row.month}</span>
                {isCurrentMonth && (
                  <span className="text-xs font-bold bg-green-900/40 text-green-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide border border-green-900/50">
                    Now
                  </span>
                )}
              </div>
              <span className="text-sm font-bold font-mono text-[#00A551] whitespace-nowrap">
                {fmt(row.totalIn)}
              </span>
              <span className="text-sm font-bold font-mono text-rose-400 whitespace-nowrap">
                -{fmt(row.totalOut)}
              </span>
              <NetChip net={net} />
            </div>
          );
        })}
      </div>

      {/* Grand totals */}
      <div className="border-t-2 border-slate-800 bg-slate-900/50">
        <div className="grid grid-cols-4 gap-2 px-5 py-4 min-w-[320px]">
          <span className="text-xs font-bold uppercase text-slate-200 tracking-wide">Total</span>
          <span className="text-sm font-bold font-mono text-[#00A551]">{fmt(grandIn)}</span>
          <span className="text-sm font-bold font-mono text-rose-400">-{fmt(grandOut)}</span>
          <NetChip net={grandIn - grandOut} />
        </div>
      </div>
    </div>
  );
}
