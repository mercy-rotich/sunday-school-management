"use client";

import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

const BALANCE        = 23750;
const DEPOSITS_COUNT = 14;
const LAST_UPDATED   = "Jul 1, 2025";

export function BirthdayFundBalance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Fund Balance Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-200 mb-3">
          Fund Balance
        </p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
          {fmt(BALANCE)}
        </p>
        <p className="text-xs text-slate-300">
          Current balance
        </p>
      </div>

      {/* This Month Deposits Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-200 mb-3">
          This Month
        </p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
          {DEPOSITS_COUNT}
        </p>
        <p className="text-xs text-slate-300">
          Deposits received
        </p>
      </div>

      {/* Avg Deposit Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-200 mb-3">
          Avg. Deposit
        </p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
          {fmt(Math.round(BALANCE / DEPOSITS_COUNT))}
        </p>
        <p className="text-xs text-slate-300">
          Per parent
        </p>
      </div>
    </div>
  );
}
