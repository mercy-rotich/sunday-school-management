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
        <div className="flex items-center gap-3 mb-1">
          <div className="size-10 rounded-xl bg-[#FF6B2B]/10 flex items-center justify-center shrink-0">
            <IC.Cake className="size-5 text-[#FF6B2B]" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Birthday Fund Management
          </h1>
        </div>
        <p className="text-sm text-gray-500 ml-[52px]">
          Automated BDAY contributions — parents text using the reference &quot;BDAY&quot; on the 1st of each month
        </p>
      </div>

      {/* Balance Card */}
      <BirthdayFundBalance />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <MonthlyBirthdays />
        </div>
        <div className="lg:col-span-1">
          <RecentBdayDeposits />
        </div>
      </div>

    </div>
  );
}
