"use client";

import { useState, useCallback, useMemo } from "react";
import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

type UnallocatedReason =
  | "Unknown number"
  | "Ambiguous reference"
  | "3 children linked"
  | "Manual override"
  | "Duplicate detected";

type SaveState = "idle" | "saving" | "saved";

interface Child { id: string; name: string; }

interface TriagePayment {
  id: string;
  receivedAt: string;
  phone: string;
  amount: number;
  mpesaRef: string;
  reason: UnallocatedReason;
}

const CHILDREN: Child[] = [
  { id: "c1",  name: "Amara Odhiambo" },
  { id: "c2",  name: "Brian Mwangi"   },
  { id: "c3",  name: "Cynthia Kamau"  },
  { id: "c4",  name: "David Otieno"   },
  { id: "c5",  name: "Esther Njoroge" },
  { id: "c6",  name: "Felix Waweru"   },
  { id: "c7",  name: "Grace Achieng"  },
  { id: "c8",  name: "Hassan Abdi"    },
  { id: "c9",  name: "Irene Mutua"    },
  { id: "c10", name: "James Kariuki"  },
];

const SEED_PAYMENTS: TriagePayment[] = [
  { id: "t1", receivedAt: "2025-07-03T08:14:22Z", phone: "+254799123456", amount: 1500, mpesaRef: "RGJ4K8LM2N", reason: "Unknown number"     },
  { id: "t2", receivedAt: "2025-07-03T10:31:05Z", phone: "+254711987654", amount: 500,  mpesaRef: "QHF2P9RT5W", reason: "Ambiguous reference" },
  { id: "t3", receivedAt: "2025-07-03T07:55:44Z", phone: "+254733445566", amount: 2000, mpesaRef: "BNM7X3KA1V", reason: "3 children linked"   },
  { id: "t4", receivedAt: "2025-07-02T14:02:18Z", phone: "+254755667788", amount: 750,  mpesaRef: "LPQ8Y6CZ4E", reason: "Unknown number"      },
  { id: "t5", receivedAt: "2025-07-02T16:45:00Z", phone: "+254722334455", amount: 1000, mpesaRef: "XYZ1A2B3C4", reason: "Duplicate detected"  },
];

const REASON_STYLES: Record<UnallocatedReason, string> = {
  "Unknown number":      "bg-orange-50 text-orange-700 border-orange-200",
  "Ambiguous reference": "bg-amber-50  text-amber-700  border-amber-200",
  "3 children linked":   "bg-violet-50 text-violet-700 border-violet-200",
  "Manual override":     "bg-sky-50    text-sky-700    border-sky-200",
  "Duplicate detected":  "bg-rose-50   text-rose-700   border-rose-200",
};

function ReasonBadge({ reason }: { reason: UnallocatedReason }) {
  return (
    <span className={`inline-block text-[10px] font-semibold border px-2 py-0.5 rounded-full whitespace-nowrap ${REASON_STYLES[reason]}`}>
      {reason}
    </span>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400 whitespace-nowrap border-b-2 border-stone-100 bg-stone-50/60">
      {children}
    </th>
  );
}

function TriageRow({ payment, index, onAllocate }: {
  payment: TriagePayment;
  index: number;
  onAllocate: (id: string) => void;
}) {
  const [selected,  setSelected]  = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleSave = useCallback(() => {
    if (!selected || saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => onAllocate(payment.id), 600);
    }, 900);
  }, [selected, saveState, onAllocate, payment.id]);

  const rowBg =
    saveState === "saved" ? "bg-emerald-50" :
    index % 2 === 0       ? "bg-white hover:bg-stone-50/70" :
                            "bg-stone-50/40 hover:bg-stone-100/50";

  return (
    <tr className={`border-b border-stone-100 transition-colors duration-300 ${rowBg}`}>
      <td className="px-5 py-3.5 whitespace-nowrap">
        <p className="text-[12px] font-medium text-stone-700">
          {new Date(payment.receivedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <p className="text-[10px] text-stone-400 mt-0.5">
          {new Date(payment.receivedAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </td>
      <td className="px-5 py-3.5">
        <span className="flex items-center gap-1.5 font-mono text-[12px] text-stone-600">
          <IC.Phone className="size-3 shrink-0 text-stone-400" />
          {payment.phone}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="font-bold font-mono text-[14px] text-stone-800">{fmt(payment.amount)}</span>
      </td>
      <td className="px-5 py-3.5">
        <code className="text-[11px] font-semibold bg-stone-100 text-stone-500 px-2 py-1 rounded-md">
          {payment.mpesaRef}
        </code>
      </td>
      <td className="px-5 py-3.5">
        <ReasonBadge reason={payment.reason} />
      </td>
      <td className="px-5 py-3.5">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={saveState !== "idle"}
          className={`min-w-[170px] rounded-lg border px-3 py-1.5 text-[12px] font-medium bg-white outline-none cursor-pointer
            focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
            ${selected ? "border-sky-300 text-stone-800" : "border-stone-200 text-stone-400"}`}
        >
          <option value="" disabled>Select child…</option>
          {CHILDREN.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={handleSave}
          disabled={!selected || saveState !== "idle"}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-150 whitespace-nowrap
            ${saveState === "saved"  ? "bg-emerald-100 text-emerald-700 cursor-default" :
              saveState === "saving" ? "bg-sky-100 text-sky-600 cursor-wait" :
              selected               ? "bg-sky-600 text-white hover:bg-sky-700 active:scale-[0.97]" :
                                       "bg-stone-100 text-stone-300 cursor-not-allowed"}`}
        >
          {saveState === "saved"  ? <><IC.Check  className="size-3.5" /> Saved</>   :
           saveState === "saving" ? <><IC.Loader className="size-3.5 animate-spin" /> Saving…</> :
                                    <><IC.Save   className="size-3.5" /> Save</>}
        </button>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center">
      <div className="size-16 md:size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 md:mb-5">
        <div className="size-10 md:size-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <IC.CheckCircle className="size-6 md:size-7 text-emerald-500" />
        </div>
      </div>
      <h3 className="text-base md:text-lg font-bold text-stone-800 mb-2">All caught up!</h3>
      <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
        No pending payments to allocate. The Smart Defaults system handled everything automatically.
      </p>
      <div className="mt-5 flex items-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
        <IC.Check className="size-3.5" />
        System running smoothly
      </div>
    </div>
  );
}

function StatsBar({ payments }: { payments: TriagePayment[] }) {
  const totalAmount = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const oldestDate  = useMemo(() =>
    payments.length > 0
      ? new Date(Math.min(...payments.map((p) => new Date(p.receivedAt).getTime())))
          .toLocaleDateString("en-KE", { day: "numeric", month: "short" })
      : "—",
    [payments]
  );

  const stats = [
    { label: "Pending",    value: String(payments.length), icon: <IC.Alert  className="size-4 text-amber-500" />, color: "text-amber-700" },
    { label: "Unallocated", value: fmt(totalAmount),        icon: <IC.Wallet className="size-4 text-sky-500"   />, color: "text-sky-700"   },
    { label: "Oldest",     value: oldestDate,               icon: <IC.Clock  className="size-4 text-stone-400" />, color: "text-stone-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-stone-200 rounded-xl px-4 md:px-5 py-3.5 md:py-4 flex items-center gap-3 shadow-sm">
          <div className="size-9 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">{s.icon}</div>
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400">{s.label}</p>
            <p className={`text-lg md:text-xl font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TriageQueuePage() {
  const [payments, setPayments] = useState<TriagePayment[]>(SEED_PAYMENTS);
  const allocate = useCallback((id: string) => setPayments((prev) => prev.filter((p) => p.id !== id)), []);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <IC.Alert className="size-4 text-amber-600" />
            </div>
            <h1 className="text-[18px] md:text-[22px] font-bold text-stone-800 tracking-tight">
              Action Required
            </h1>
          </div>
          <p className="text-[13px] text-stone-400 ml-[42px] leading-relaxed">
            Unallocated payments — assign each to a child and hit{" "}
            <span className="font-semibold text-stone-500">Save</span>.
          </p>
        </div>
        {payments.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-bold px-4 py-2 rounded-full shrink-0 self-start">
            <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            {payments.length} pending
          </div>
        )}
      </div>

      <StatsBar payments={payments} />

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-bold text-stone-800">Unallocated Payments</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Each row is a payment the system could not confidently route</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <IC.Info className="size-3.5 shrink-0" />
            <span>Changes save immediately</span>
          </div>
        </div>

        {payments.length === 0 && <EmptyState />}

        {payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <TH>Date &amp; Time</TH>
                  <TH>Phone Number</TH>
                  <TH>Amount (KES)</TH>
                  <TH>M-Pesa Reference</TH>
                  <TH>Flag Reason</TH>
                  <TH>Assign To</TH>
                  <TH>Action</TH>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <TriageRow key={p.id} payment={p} index={i} onAllocate={allocate} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {payments.length > 0 && (
          <div className="px-4 md:px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-start sm:items-center gap-2">
            <IC.Info className="size-3.5 text-stone-300 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] text-stone-400">
              <span className="font-semibold text-stone-500">Tip:</span> Unknown numbers can be linked to parents in the{" "}
              <span className="font-semibold text-sky-600">Children registry</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}