"use client";

import { BirthdayFundBalance } from "@/features/birthdays/components/BirthdayFundBalance";
import { MonthlyBirthdays } from "@/features/birthdays/components/MonthlyBirthdays";
import { RecentBdayDeposits } from "@/features/birthdays/components/RecentBdayDeposits";
import { IC } from "@/components/ui/Icons";

export default function BirthdayFundPage() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <IC.Cake className="size-4 text-violet-600" />
          </div>
          <h1 className="text-[20px] md:text-[22px] font-bold text-stone-800 tracking-tight">
            Birthday Fund Management
          </h1>
        </div>
        <p className="text-[13px] text-stone-400 ml-[42px]">
          Automated BDAY contributions — parents text using the reference &quot;BDAY&quot; on the 1st of each month
        </p>
      </div>

      {/* Balance Card */}
      <BirthdayFundBalance />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Birthdays — takes 2 of 3 cols on desktop */}
        <div className="lg:col-span-2">
          <MonthlyBirthdays />
        </div>
        {/* Recent Deposits */}
        <div className="lg:col-span-1">
          <RecentBdayDeposits />
        </div>
      </div>

    </div>
  );
}