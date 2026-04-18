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
  "Unknown number":      "bg-orange-900/20 text-orange-300 border-orange-900/50",
  "Ambiguous reference": "bg-amber-900/20  text-amber-300  border-amber-900/50",
  "3 children linked":   "bg-blue-900/20   text-blue-300   border-blue-900/50",
  "Manual override":     "bg-indigo-900/20 text-indigo-300 border-indigo-900/50",
  "Duplicate detected":  "bg-rose-900/20   text-rose-300   border-rose-900/50",
};

function ReasonBadge({ reason }: { reason: UnallocatedReason }) {
  return (
    <span className={`inline-block text-xs font-semibold border px-2.5 py-1 rounded-full whitespace-nowrap ${REASON_STYLES[reason]}`}>
      {reason}
    </span>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3.5 text-left text-xs font-bold tracking-wide uppercase text-slate-200 whitespace-nowrap border-b-2 border-slate-800 bg-slate-900/60">
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
    saveState === "saved" ? "bg-green-900/20" :
    index % 2 === 0       ? "bg-slate-900 hover:bg-slate-800/50" :
                            "bg-slate-900/50 hover:bg-slate-800/30";

  return (
    <tr className={`border-b border-slate-100 transition-colors duration-300 ${rowBg}`}>
      <td className="px-5 py-4 whitespace-nowrap">
        <p className="text-sm font-medium text-slate-100">
          {new Date(payment.receivedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <p className="text-xs text-slate-300 mt-0.5">
          {new Date(payment.receivedAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </td>
      <td className="px-5 py-4">
        <span className="flex items-center gap-1.5 font-mono text-sm text-slate-300">
          <IC.Phone className="size-3.5 shrink-0 text-slate-300" />
          {payment.phone}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="font-bold font-mono text-base text-slate-100">{fmt(payment.amount)}</span>
      </td>
      <td className="px-5 py-4">
        <code className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
          {payment.mpesaRef}
        </code>
      </td>
      <td className="px-5 py-4">
        <ReasonBadge reason={payment.reason} />
      </td>
      <td className="px-5 py-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={saveState !== "idle"}
          className={`min-w-[180px] rounded-xl border px-3 py-2.5 text-sm font-medium bg-slate-800 outline-none cursor-pointer
            focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
            ${selected ? "border-indigo-500 text-slate-100" : "border-slate-700 text-slate-300"}`}
        >
          <option value="" disabled>Select child…</option>
          {CHILDREN.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-4">
        <button
          onClick={handleSave}
          disabled={!selected || saveState !== "idle"}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap
            ${saveState === "saved"  ? "bg-green-900/20 text-green-300 cursor-default" :
              saveState === "saving" ? "bg-green-900/20 text-[#00A551] cursor-wait" :
              selected               ? "bg-[#00A551] text-white hover:bg-[#007A3C] active:scale-[0.97]" :
                                       "bg-slate-800 text-slate-300 cursor-not-allowed"}`}
        >
          {saveState === "saved"  ? <><IC.Check  className="size-4" /> Saved</>   :
           saveState === "saving" ? <><IC.Loader className="size-4 animate-spin" /> Saving…</> :
                                    <><IC.Save   className="size-4" /> Save</>}
        </button>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center">
      <div className="size-20 rounded-full bg-green-900/20 flex items-center justify-center mb-5">
        <div className="size-12 rounded-full bg-green-900/40 flex items-center justify-center">
          <IC.CheckCircle className="size-7 text-[#00A551]" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">All caught up!</h3>
      <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
        No pending payments to allocate. The Smart Defaults system handled everything automatically.
      </p>
      <div className="mt-5 flex items-center gap-2 text-sm text-[#00A551] font-semibold bg-green-900/20 border border-green-900/50 px-4 py-2.5 rounded-full">
        <IC.Check className="size-4" />
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
    { label: "Pending",     value: String(payments.length), icon: <IC.Alert  className="size-5 text-[#FF6B2B]" />, color: "text-[#FF6B2B]",  bg: "bg-orange-900/20" },
    { label: "Unallocated", value: fmt(totalAmount),         icon: <IC.Wallet className="size-5 text-[#00A551]" />, color: "text-[#00A551]", bg: "bg-green-900/20"  },
    { label: "Oldest",      value: oldestDate,               icon: <IC.Clock  className="size-5 text-slate-300"  />, color: "text-slate-300",  bg: "bg-slate-800"   },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-200">{s.label}</p>
            <p className={`text-xl font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PaymentAllocationPage() {
  const [payments, setPayments] = useState<TriagePayment[]>(SEED_PAYMENTS);
  const allocate = useCallback((id: string) => setPayments((prev) => prev.filter((p) => p.id !== id)), []);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-orange-900/30 flex items-center justify-center shrink-0">
              <IC.Alert className="size-5 text-[#FF6B2B]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Payment Allocation
            </h1>
          </div>
          <p className="text-sm text-slate-300 ml-[52px] leading-relaxed">
            Review and assign unallocated payments to children — each payment needs a recipient before it can be processed.
          </p>
        </div>
        {payments.length > 0 && (
          <div className="flex items-center gap-2 bg-orange-900/20 border border-orange-900/50 text-[#FF6B2B] text-sm font-bold px-4 py-2.5 rounded-full shrink-0 self-start">
            <span className="size-2 rounded-full bg-[#FF6B2B] animate-pulse" />
            {payments.length} pending
          </div>
        )}
      </div>

      <StatsBar payments={payments} />

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Unallocated Payments</h2>
            <p className="text-sm text-slate-300 mt-0.5">Each row is a payment the system could not confidently route</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-300">
            <IC.Info className="size-4 shrink-0" />
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
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/50 flex items-start sm:items-center gap-2">
            <IC.Info className="size-4 text-slate-300 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-200">Tip:</span> Unknown numbers can be linked to parents in the{" "}
              <span className="font-semibold text-[#00A551]">Children registry</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
