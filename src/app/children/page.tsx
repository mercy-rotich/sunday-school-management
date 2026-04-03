"use client";

import { useState, useMemo, useCallback } from "react";
import { IC } from "@/components/ui/Icons";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
}

type ModalMode = "add" | "edit";

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SEED_CHILDREN: Child[] = [
  { id: "c1",  firstName: "Amara",   lastName: "Odhiambo", dateOfBirth: "2017-03-12", parentName: "Joyce Odhiambo",  parentPhone: "+254712345678" },
  { id: "c2",  firstName: "Brian",   lastName: "Mwangi",   dateOfBirth: "2015-07-24", parentName: "Peter Mwangi",    parentPhone: "+254723456789" },
  { id: "c3",  firstName: "Cynthia", lastName: "Kamau",    dateOfBirth: "2018-01-09", parentName: "Grace Kamau",     parentPhone: "+254734567890" },
  { id: "c4",  firstName: "David",   lastName: "Otieno",   dateOfBirth: "2016-11-30", parentName: "John Otieno",     parentPhone: "+254745678901" },
  { id: "c5",  firstName: "Esther",  lastName: "Njoroge",  dateOfBirth: "2019-05-18", parentName: "Mary Njoroge",    parentPhone: "+254756789012" },
  { id: "c6",  firstName: "Felix",   lastName: "Waweru",   dateOfBirth: "2014-09-03", parentName: "Samuel Waweru",   parentPhone: "+254767890123" },
  { id: "c7",  firstName: "Grace",   lastName: "Achieng",  dateOfBirth: "2018-12-22", parentName: "Ruth Achieng",    parentPhone: "+254778901234" },
  { id: "c8",  firstName: "Hassan",  lastName: "Abdi",     dateOfBirth: "2016-04-15", parentName: "Fatuma Abdi",     parentPhone: "+254789012345" },
  { id: "c9",  firstName: "Irene",   lastName: "Mutua",    dateOfBirth: "2017-08-07", parentName: "Daniel Mutua",    parentPhone: "+254790123456" },
  { id: "c10", firstName: "James",   lastName: "Kariuki",  dateOfBirth: "2015-02-28", parentName: "Alice Kariuki",   parentPhone: "+254701234567" },
  { id: "c11", firstName: "Karen",   lastName: "Wanjiku",  dateOfBirth: "2019-10-11", parentName: "Joseph Wanjiku",  parentPhone: "+254711234568" },
  { id: "c12", firstName: "Liam",    lastName: "Omondi",   dateOfBirth: "2020-06-25", parentName: "Beatrice Omondi", parentPhone: "+254722345679" },
  { id: "c13", firstName: "Mary",    lastName: "Ndungu",   dateOfBirth: "2016-03-04", parentName: "Charles Ndungu",  parentPhone: "+254733456780" },
  { id: "c14", firstName: "Nathan",  lastName: "Kiprop",   dateOfBirth: "2018-07-19", parentName: "Rose Kiprop",     parentPhone: "+254744567891" },
  { id: "c15", firstName: "Olivia",  lastName: "Chebet",   dateOfBirth: "2017-12-01", parentName: "Edwin Chebet",    parentPhone: "+254755678902" },
];

const BLANK_FORM: FormState = {
  firstName: "", lastName: "", dateOfBirth: "", parentName: "", parentPhone: "",
};

const PAGE_SIZE = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

function formatDob(dob: string): string {
  return new Date(dob).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function genId(): string {
  return `c${Date.now()}`;
}

// ─── Age Pill ─────────────────────────────────────────────────────────────────
function AgePill({ age }: { age: number }) {
  return (
    <span className="inline-flex items-center text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded-full ml-1.5 whitespace-nowrap">
      {age}y
    </span>
  );
}

// ─── Action Menu ──────────────────────────────────────────────────────────────
function ActionMenu({
  child,
  onEdit,
  onDelete,
}: {
  child: Child;
  onEdit: (c: Child) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="size-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer border-0 bg-transparent"
      >
        <IC.MoreHorizontal className="size-4" />
      </button>
      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-36 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => { onEdit(child); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
            >
              <IC.Edit className="size-3.5 text-stone-400" />
              Edit Child
            </button>
            <div className="h-px bg-stone-100 mx-2" />
            <button
              onClick={() => { onDelete(child.id); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
            >
              <IC.Trash className="size-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
interface ModalProps {
  mode: ModalMode;
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function ChildModal({ mode, form, onChange, onSave, onClose }: ModalProps) {
  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    form.parentName.trim() &&
    form.parentPhone.trim();

  const inputCls =
    "w-full border border-stone-200 rounded-lg px-3 py-2 text-[13px] text-stone-800 bg-white outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors placeholder:text-stone-300";
  const labelCls = "block text-[11px] font-bold tracking-wide uppercase text-stone-500 mb-1.5";

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center">
              {mode === "add"
                ? <IC.UserPlus className="size-4 text-sky-600" />
                : <IC.Edit className="size-4 text-sky-600" />}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-stone-800">
                {mode === "add" ? "Add New Child" : "Edit Child"}
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {mode === "add"
                  ? "Register a new child in the directory"
                  : "Update the child's information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <IC.X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name</label>
              <input
                className={inputCls}
                placeholder="e.g. Amara"
                value={form.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input
                className={inputCls}
                placeholder="e.g. Odhiambo"
                value={form.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input
              type="date"
              className={inputCls}
              value={form.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Parent / Guardian</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Parent name */}
          <div>
            <label className={labelCls}>Parent Name</label>
            <input
              className={inputCls}
              placeholder="e.g. Joyce Odhiambo"
              value={form.parentName}
              onChange={(e) => onChange("parentName", e.target.value)}
            />
          </div>

          {/* Parent phone */}
          <div>
            <label className={labelCls}>
              Parent Phone{" "}
              <span className="text-sky-500 normal-case font-normal tracking-normal">
                (M-Pesa matching key)
              </span>
            </label>
            <input
              className={inputCls}
              placeholder="+254712345678"
              value={form.parentPhone}
              onChange={(e) => onChange("parentPhone", e.target.value)}
            />
            <p className="text-[10px] text-stone-400 mt-1.5">
              This number must match the M-Pesa sender phone exactly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!isValid}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all
              ${isValid
                ? "bg-sky-600 text-white hover:bg-sky-700 active:scale-[0.98] cursor-pointer"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"}`}
          >
            {mode === "add" ? "Add Child" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  child,
  onConfirm,
  onClose,
}: {
  child: Child;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="size-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <IC.Trash className="size-6 text-rose-500" />
          </div>
          <h2 className="text-[16px] font-bold text-stone-800 mb-2">Remove Child?</h2>
          <p className="text-[13px] text-stone-500 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-stone-700">
              {child.firstName} {child.lastName}
            </span>{" "}
            from the directory? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-100 bg-stone-50/50">
      <p className="text-[11px] text-stone-400 hidden sm:block">
        Page {current} of {total}
      </p>
      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-0 bg-transparent cursor-pointer"
        >
          <IC.ChevL className="size-3.5" /> Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`size-8 rounded-lg text-[12px] font-bold transition-colors border-0 cursor-pointer
              ${p === current
                ? "bg-sky-600 text-white"
                : "text-stone-500 hover:bg-stone-100 bg-transparent"}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-0 bg-transparent cursor-pointer"
        >
          Next <IC.ChevR className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Children Table ───────────────────────────────────────────────────────────
function ChildrenTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Child[];
  onEdit: (c: Child) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="size-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
          <IC.Users className="size-7 text-stone-300" />
        </div>
        <p className="text-[14px] font-semibold text-stone-500">No children found</p>
        <p className="text-[12px] text-stone-400 mt-1">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            {["Child's Name", "Date of Birth", "Parent / Guardian", "Phone Number (M-Pesa key)", "Actions"].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-[10px] font-extrabold tracking-[0.08em] uppercase text-stone-400 whitespace-nowrap border-b-2 border-stone-100 bg-stone-50/60"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((child, i) => {
            const age = calcAge(child.dateOfBirth);
            return (
              <tr
                key={child.id}
                className={`border-b border-stone-100 transition-colors ${
                  i % 2 === 0 ? "bg-white hover:bg-stone-50/60" : "bg-stone-50/30 hover:bg-stone-100/40"
                }`}
              >
                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                      {child.firstName[0]}{child.lastName[0]}
                    </div>
                    <span className="text-[13px] font-semibold text-stone-800">
                      {child.firstName} {child.lastName}
                    </span>
                  </div>
                </td>

                {/* DOB + Age */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-[12px] text-stone-600">{formatDob(child.dateOfBirth)}</span>
                  <AgePill age={age} />
                </td>

                {/* Parent */}
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-stone-700">{child.parentName}</span>
                </td>

                {/* Phone — highlighted as M-Pesa key */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <IC.Phone className="size-3 text-sky-500 shrink-0" />
                    <span className="font-mono text-[12px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                      {child.parentPhone}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <ActionMenu child={child} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChildrenPage() {
  const [children,  setChildren]  = useState<Child[]>(SEED_CHILDREN);
  const [query,     setQuery]     = useState("");
  const [page,      setPage]      = useState(1);
  const [modal,     setModal]     = useState<{ open: boolean; mode: ModalMode; editing: Child | null }>({
    open: false, mode: "add", editing: null,
  });
  const [form,      setForm]      = useState<FormState>(BLANK_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  // Filtered list
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return children;
    return children.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.parentName.toLowerCase().includes(q) ||
        c.parentPhone.includes(q)
    );
  }, [children, query]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page on search
  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setPage(1);
  }, []);

  // Form field update
  const handleFormChange = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Open add modal
  const openAdd = useCallback(() => {
    setForm(BLANK_FORM);
    setModal({ open: true, mode: "add", editing: null });
  }, []);

  // Open edit modal
  const openEdit = useCallback((child: Child) => {
    setForm({
      firstName:   child.firstName,
      lastName:    child.lastName,
      dateOfBirth: child.dateOfBirth,
      parentName:  child.parentName,
      parentPhone: child.parentPhone,
    });
    setModal({ open: true, mode: "edit", editing: child });
  }, []);

  // Save (add or edit)
  const handleSave = useCallback(() => {
    if (modal.mode === "add") {
      const newChild: Child = { id: genId(), ...form };
      setChildren((prev) => [newChild, ...prev]);
    } else if (modal.editing) {
      setChildren((prev) =>
        prev.map((c) => (c.id === modal.editing!.id ? { ...c, ...form } : c))
      );
    }
    setModal({ open: false, mode: "add", editing: null });
    setForm(BLANK_FORM);
  }, [modal, form]);

  // Delete
  const handleDelete = useCallback((id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
  }, []);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
              <IC.Users className="size-4 text-sky-600" />
            </div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-stone-800 tracking-tight">
              Children Directory
            </h1>
          </div>
          <p className="text-[13px] text-stone-400 ml-[42px]">
            {children.length} registered children · M-Pesa auto-allocation relies on this data
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-[13px] font-bold rounded-xl hover:bg-sky-700 active:scale-[0.98] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <IC.Plus className="size-4" />
          <span>Add New Child</span>
        </button>
      </div>

      {/* Search + Stats row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <IC.Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, parent, or phone number…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-[13px] text-stone-700 outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors placeholder:text-stone-300"
          />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-stone-400 bg-white border border-stone-200 rounded-xl px-4 py-2.5 shrink-0">
          <IC.Filter className="size-3.5" />
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-bold text-stone-800">Registered Children</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Phone numbers are used as the M-Pesa matching key for Smart Defaults
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <IC.Info className="size-3.5 shrink-0" />
            <span>Showing {pageSlice.length} of {filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <ChildrenTable
          items={pageSlice}
          onEdit={openEdit}
          onDelete={(id) => {
            const child = children.find((c) => c.id === id);
            if (child) setDeleteTarget(child);
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination current={safePage} total={totalPages} onChange={setPage} />
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <ChildModal
          mode={modal.mode}
          form={form}
          onChange={handleFormChange}
          onSave={handleSave}
          onClose={() => setModal({ open: false, mode: "add", editing: null })}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteModal
          child={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}