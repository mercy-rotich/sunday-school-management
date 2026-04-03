"use client";

import { IC } from "@/components/ui/Icons";
import { fmt, fmtT } from "@/lib/utils";

interface BdayDeposit {
  id: string;
  childName: string;
  senderPhone: string;
  amount: number;
  receivedAt: string;
  mpesaRef: string;
}

const MOCK_DEPOSITS: BdayDeposit[] = [
  { id: "d1",  childName: "Amara Odhiambo", senderPhone: "+254712345678", amount: 500,  receivedAt: "2025-07-01T09:12:00Z", mpesaRef: "BDAY001KE" },
  { id: "d2",  childName: "Felix Waweru",   senderPhone: "+254767890123", amount: 1000, receivedAt: "2025-07-01T10:45:00Z", mpesaRef: "BDAY002KE" },
  { id: "d3",  childName: "Grace Achieng",  senderPhone: "+254778901234", amount: 500,  receivedAt: "2025-07-01T11:20:00Z", mpesaRef: "BDAY003KE" },
  { id: "d4",  childName: "David Otieno",   senderPhone: "+254745678901", amount: 750,  receivedAt: "2025-07-01T13:05:00Z", mpesaRef: "BDAY004KE" },
  { id: "d5",  childName: "Karen Wanjiku",  senderPhone: "+254711234568", amount: 500,  receivedAt: "2025-07-01T14:30:00Z", mpesaRef: "BDAY005KE" },
  { id: "d6",  childName: "Brian Mwangi",   senderPhone: "+254723456789", amount: 1000, receivedAt: "2025-07-01T15:10:00Z", mpesaRef: "BDAY006KE" },
  { id: "d7",  childName: "Esther Njoroge", senderPhone: "+254756789012", amount: 500,  receivedAt: "2025-07-01T16:00:00Z", mpesaRef: "BDAY007KE" },
];

export function RecentBdayDeposits() {
  const total = MOCK_DEPOSITS.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold text-stone-800">Recent BDAY Deposits</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {MOCK_DEPOSITS.length} deposits · {fmt(total)} total
          </p>
        </div>
        <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <IC.ArrowRight className="size-4 text-emerald-500 rotate-[225deg]" />
        </div>
      </div>

      {/* Deposit list */}
      <div className="flex-1 flex flex-col divide-y divide-stone-50">
        {MOCK_DEPOSITS.map((deposit) => (
          <div key={deposit.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50/60 transition-colors">
            {/* Icon */}
            <div className="size-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <IC.Check className="size-4 text-emerald-500" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-stone-800 truncate">{deposit.childName}</p>
              <p className="text-[10px] font-mono text-stone-400 mt-0.5 truncate">{deposit.senderPhone}</p>
              <p className="text-[10px] text-stone-300 mt-0.5">{fmtT(deposit.receivedAt)}</p>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className="text-[14px] font-bold font-mono text-emerald-700">
                +{fmt(deposit.amount)}
              </p>
              <code className="text-[9px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded mt-1 inline-block">
                {deposit.mpesaRef}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Footer total */}
      <div className="px-5 py-3 border-t border-stone-100 bg-emerald-50/50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
          This Month Total
        </span>
        <span className="text-[15px] font-bold font-mono text-emerald-700">{fmt(total)}</span>
      </div>
    </div>
  );
}