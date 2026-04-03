"use client";

import { IC } from "@/components/ui/Icons";
import { fmt } from "@/lib/utils";

type ExpenseCategory = "Supplies" | "Event" | "Welfare" | "Utilities" | "Training";

interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  approvedBy: string;
}

const MOCK_EXPENSES: Expense[] = [
  { id: "e1",  date: "2025-07-02", category: "Supplies",   description: "Craft materials — July term",          amount: 3500,  approvedBy: "Teacher Grace" },
  { id: "e2",  date: "2025-06-28", category: "Event",      description: "End of term party food & drinks",      amount: 8200,  approvedBy: "Teacher Grace" },
  { id: "e3",  date: "2025-06-15", category: "Welfare",    description: "Hospital visit gift for Otieno family", amount: 2000,  approvedBy: "Teacher Grace" },
  { id: "e4",  date: "2025-06-10", category: "Utilities",  description: "Printing — attendance registers",      amount: 850,   approvedBy: "Teacher Grace" },
  { id: "e5",  date: "2025-05-25", category: "Training",   description: "Sunday School teachers' seminar",      amount: 12000, approvedBy: "Teacher Grace" },
  { id: "e6",  date: "2025-05-18", category: "Supplies",   description: "Bibles for new children (×5)",         amount: 4500,  approvedBy: "Teacher Grace" },
  { id: "e7",  date: "2025-04-30", category: "Event",      description: "Easter Sunday celebration",            amount: 9800,  approvedBy: "Teacher Grace" },
  { id: "e8",  date: "2025-04-12", category: "Welfare",    description: "Support — bereaved family",            amount: 5000,  approvedBy: "Teacher Grace" },
];

const CATEGORY_STYLES: Record<ExpenseCategory, string> = {
  Supplies:  "bg-sky-50   text-sky-700   border-sky-200",
  Event:     "bg-violet-50 text-violet-700 border-violet-200",
  Welfare:   "bg-amber-50  text-amber-700  border-amber-200",
  Utilities: "bg-stone-50  text-stone-600  border-stone-200",
  Training:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function CategoryBadge({ category }: { category: ExpenseCategory }) {
  return (
    <span className={`inline-block text-[10px] font-semibold border px-2 py-0.5 rounded-full whitespace-nowrap ${CATEGORY_STYLES[category]}`}>
      {category}
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

export function ExpensesTable() {
  const total = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold text-stone-800">Recent Expenses</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">
            All approved outflows from the general fund
          </p>
        </div>
        <span className="text-[12px] font-bold font-mono text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg">
          -{fmt(total)}
        </span>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              <TH>Date</TH>
              <TH>Category</TH>
              <TH>Description</TH>
              <TH>Amount (KES)</TH>
            </tr>
          </thead>
          <tbody>
            {MOCK_EXPENSES.map((exp, i) => (
              <tr
                key={exp.id}
                className={`border-b border-stone-50 last:border-b-0 transition-colors ${
                  i % 2 === 0 ? "bg-white hover:bg-stone-50/60" : "bg-stone-50/30 hover:bg-stone-100/40"
                }`}
              >
                <td className="px-5 py-3 whitespace-nowrap">
                  <p className="text-[12px] font-medium text-stone-700">
                    {new Date(exp.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <CategoryBadge category={exp.category} />
                </td>
                <td className="px-5 py-3">
                  <p className="text-[12px] text-stone-700">{exp.description}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Approved by {exp.approvedBy}</p>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className="text-[13px] font-bold font-mono text-rose-600">
                    -{fmt(exp.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Total Shown
        </span>
        <span className="text-[14px] font-bold font-mono text-rose-600">-{fmt(total)}</span>
      </div>
    </div>
  );
}