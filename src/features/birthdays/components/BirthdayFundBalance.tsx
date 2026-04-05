"use client";

import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

const BALANCE        = 23750;
const DEPOSITS_COUNT = 14;
const LAST_UPDATED   = "Jul 1, 2025";

export function BirthdayFundBalance() {
  return (
    <div className="bg-gradient-to-br from-[#00A551] to-[#007A3C] rounded-2xl p-5 md:p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* Left — balance */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center">
              <IC.Wallet className="size-5 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-green-100">
              Current Birthday Fund Balance
            </span>
          </div>
          <p className="text-4xl md:text-5xl font-bold font-mono tracking-tight leading-none">
            {fmt(BALANCE)}
          </p>
          <p className="text-sm text-green-200 mt-2">
            Last updated · {LAST_UPDATED}
          </p>
        </div>

        {/* Right — stats pills */}
        <div className="flex flex-row sm:flex-col gap-3">
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 min-w-[120px]">
            <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-0.5">
              Deposits
            </p>
            <p className="text-2xl font-bold font-mono text-white">{DEPOSITS_COUNT}</p>
            <p className="text-xs text-green-200">This month</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 min-w-[120px]">
            <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-0.5">
              Avg. Deposit
            </p>
            <p className="text-2xl font-bold font-mono text-white">
              {fmt(Math.round(BALANCE / DEPOSITS_COUNT))}
            </p>
            <p className="text-xs text-green-200">Per parent</p>
          </div>
        </div>

      </div>

      {/* Info strip */}
      <div className="mt-5 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-green-100">
        <span className="flex items-center gap-1.5">
          <IC.Info className="size-4 shrink-0" />
          Parents send M-Pesa with reference <span className="font-bold text-white ml-1">BDAY</span>
        </span>
        <span className="flex items-center gap-1.5">
          <IC.Clock className="size-4 shrink-0" />
          SMS reminders go out on the 1st of each month
        </span>
      </div>
    </div>
  );
}
