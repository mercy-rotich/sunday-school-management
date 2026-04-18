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
  Supplies:  "bg-green-900/20   text-green-300  border-green-900/50",
  Event:     "bg-orange-900/20  text-orange-300  border-orange-900/50",
  Welfare:   "bg-amber-900/20   text-amber-300  border-amber-900/50",
  Utilities: "bg-slate-800    text-slate-300   border-slate-700",
  Training:  "bg-blue-900/20    text-blue-300   border-blue-900/50",
};

function CategoryBadge({ category }: { category: ExpenseCategory }) {
  return (
    <span className={`inline-block text-xs font-semibold border px-2.5 py-1 rounded-full whitespace-nowrap ${CATEGORY_STYLES[category]}`}>
      {category}
    </span>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-bold tracking-wide uppercase text-slate-200 whitespace-nowrap border-b-2 border-slate-800 bg-slate-900/60">
      {children}
    </th>
  );
}

export function ExpensesTable() {
  const total = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Recent Expenses</h2>
          <p className="text-sm text-slate-300 mt-0.5">
            All approved outflows from the general fund
          </p>
        </div>
        <span className="text-sm font-bold font-mono text-rose-300 bg-rose-900/20 border border-rose-900/50 px-3 py-1.5 rounded-xl">
          -{fmt(total)}
        </span>
      </div>

      {/* Table */}
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
                className={`border-b border-slate-800 last:border-b-0 transition-colors ${
                  i % 2 === 0 ? "bg-slate-900 hover:bg-slate-800/50" : "bg-slate-900/50 hover:bg-slate-800/30"
                }`}
              >
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <p className="text-sm font-medium text-slate-300">
                    {new Date(exp.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <CategoryBadge category={exp.category} />
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-slate-300">{exp.description}</p>
                  <p className="text-xs text-slate-300 mt-0.5">Approved by {exp.approvedBy}</p>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-sm font-bold font-mono text-rose-400">
                    -{fmt(exp.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Total Shown
        </span>
        <span className="text-base font-bold font-mono text-rose-400">-{fmt(total)}</span>
      </div>
    </div>
  );
}
