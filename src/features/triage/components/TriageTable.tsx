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
  <th className="px-4 py-2.5 text-left text-[10px] font-extrabold tracking-[0.07em] uppercase text-stone-400 whitespace-nowrap border-b-2 border-stone-100">
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
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-5/6" />
        <Skeleton className="h-8 w-4/6" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <div className="py-12 flex flex-col items-center gap-2 text-center">
        <div className="size-11 rounded-full bg-emerald-50 flex items-center justify-center">
          <IC.Check className="size-5 text-emerald-500" />
        </div>
        <p className="text-sm font-semibold text-emerald-700">All clear!</p>
        <p className="text-xs text-stone-400">No unallocated payments right now.</p>
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
              className={`border-b border-stone-50 transition-colors duration-300 ${
                saved[p.id]
                  ? "bg-emerald-50 opacity-60"
                  : i % 2 === 0
                  ? "bg-white hover:bg-stone-50"
                  : "bg-stone-50/60 hover:bg-stone-100/60"
              }`}
            >
              {/* M-Pesa Ref */}
              <td className="px-4 py-3">
                <code className="text-[11px] font-semibold bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
                  {p.mpesaRef}
                </code>
              </td>

              {/* Sender */}
              <td className="px-4 py-3">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
                  <IC.Phone className="size-3 shrink-0" />
                  {p.phone}
                </span>
              </td>

              {/* Amount */}
              <td className="px-4 py-3">
                <span className="font-bold font-mono text-[13px] text-stone-800">
                  {fmt(p.amount)}
                </span>
              </td>

              {/* Received */}
              <td className="px-4 py-3">
                <span className="text-[11px] text-stone-400">{fmtT(p.receivedAt)}</span>
              </td>

              {/* Flag */}
              <td className="px-4 py-3">
                <span className="inline-block text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {p.reason}
                </span>
              </td>

              {/* Child selector */}
              <td className="px-4 py-3">
                <select
                  value={sels[p.id] || ""}
                  onChange={(e) =>
                    setSels((s) => ({ ...s, [p.id]: e.target.value }))
                  }
                  disabled={saved[p.id]}
                  className={`min-w-[150px] rounded-lg border px-2.5 py-1.5 text-xs text-stone-700 bg-white outline-none
                    focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors
                    disabled:bg-emerald-50 disabled:cursor-not-allowed
                    ${sels[p.id] ? "border-sky-300" : "border-stone-200"}`}
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
              <td className="px-4 py-3">
                <button
                  onClick={() => handleSave(p.id)}
                  disabled={!sels[p.id] || saving[p.id] || saved[p.id]}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${
                      saved[p.id]
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : saving[p.id]
                        ? "bg-sky-100 text-sky-600 cursor-wait"
                        : sels[p.id]
                        ? "bg-sky-600 text-white hover:bg-sky-700 active:scale-95"
                        : "bg-stone-100 text-stone-300 cursor-not-allowed"
                    }`}
                >
                  {saved[p.id] ? (
                    <>
                      <IC.Check className="size-3" /> Saved
                    </>
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
