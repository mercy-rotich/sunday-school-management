"use client";

import { useState, useCallback } from "react";
import { IC } from "@/components/ui/Icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOCK_CHILDREN } from "@/lib/mockData";
import { fmt, fmtT } from "@/lib/utils";
import type { TriagePayment } from "../types";

interface TriageTableProps {
  payments: TriagePayment[] | null;
  onAllocate: (id: string) => void;
  isLoading: boolean;
}

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-xs font-bold tracking-wide uppercase text-slate-200 whitespace-nowrap border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
    {children}
  </th>
);

export function TriageTable({ payments, onAllocate, isLoading }: TriageTableProps) {
  const [sels,   setSels]   = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved,  setSaved]  = useState<Record<string, boolean>>({});

  const handleSave = useCallback(
    (id: string) => {
      if (!sels[id]) return;
      setSaving((s) => ({ ...s, [id]: true }));
      setTimeout(() => {
        setSaving((s) => ({ ...s, [id]: false }));
        setSaved((s)  => ({ ...s, [id]: true  }));
        setTimeout(() => onAllocate(id), 550);
      }, 800);
    },
    [sels, onAllocate]
  );

  if (isLoading) {
    return (
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-5/6" />
        <Skeleton className="h-10 w-4/6" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <div className="py-12 flex flex-col items-center gap-2 text-center">
        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center">
          <IC.Check className="size-6 text-[#00A551]" />
        </div>
        <p className="text-sm font-semibold text-[#00A551]">All clear!</p>
        <p className="text-sm text-slate-300">No unallocated payments right now.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <TH>M-Pesa Ref</TH>
            <TH>Sender</TH>
            <TH>Amount</TH>
            <TH>Received</TH>
            <TH>Flag</TH>
            <TH>Allocate To</TH>
            <TH>Action</TH>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr
              key={p.id}
              className={`border-b border-slate-100 dark:border-slate-800 transition-colors duration-300 ${
                saved[p.id]
                  ? "bg-green-50 dark:bg-green-900/10 opacity-60"
                  : i % 2 === 0
                  ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  : "bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
              }`}
            >
              {/* M-Pesa Ref */}
              <td className="px-4 py-3.5">
                <code className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-lg">
                  {p.mpesaRef}
                </code>
              </td>

              {/* Sender */}
              <td className="px-4 py-3.5">
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                  <IC.Phone className="size-3.5 shrink-0" />
                  {p.phone}
                </span>
              </td>

              {/* Amount */}
              <td className="px-4 py-3.5">
                <span className="font-bold font-mono text-sm text-slate-800 dark:text-slate-100">
                  {fmt(p.amount)}
                </span>
              </td>

              {/* Received */}
              <td className="px-4 py-3.5">
                <span className="text-sm text-slate-300">{fmtT(p.receivedAt)}</span>
              </td>

              {/* Flag */}
              <td className="px-4 py-3.5">
                <span className="inline-block text-xs font-semibold bg-orange-50 text-[#E05520] border border-orange-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {p.reason}
                </span>
              </td>

              {/* Child selector */}
              <td className="px-4 py-3.5">
                <select
                  value={sels[p.id] || ""}
                  onChange={(e) =>
                    setSels((s) => ({ ...s, [p.id]: e.target.value }))
                  }
                  disabled={saved[p.id]}
                  className={`min-w-[160px] rounded-xl border px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 outline-none
                    focus:ring-2 focus:ring-[#00A551]/30 focus:border-[#00A551] transition-colors
                    disabled:bg-green-50 dark:disabled:bg-green-900/10 disabled:cursor-not-allowed
                    ${sels[p.id] ? "border-[#00A551]" : "border-slate-200 dark:border-slate-700"}`}
                >
                  <option value="">Select child…</option>
                  {MOCK_CHILDREN.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Save button */}
              <td className="px-4 py-3.5">
                <button
                  onClick={() => handleSave(p.id)}
                  disabled={!sels[p.id] || saving[p.id] || saved[p.id]}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all
                    ${
                      saved[p.id]
                        ? "bg-green-100 text-[#00A551] cursor-default"
                        : saving[p.id]
                        ? "bg-green-50 text-[#00A551] cursor-wait"
                        : sels[p.id]
                        ? "bg-[#00A551] text-white hover:bg-[#007A3C] active:scale-95"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    }`}
                >
                  {saved[p.id] ? (
                    <><IC.Check className="size-4" /> Saved</>
                  ) : saving[p.id] ? (
                    "Saving…"
                  ) : (
                    "Save"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
