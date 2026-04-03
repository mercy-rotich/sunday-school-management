import type { Child, TriagePayment, Birthday, BdayDeposit, ActivityItem } from "@/types";

export const MOCK_CHILDREN: Child[] = [
  { id: "c1", name: "Amara Odhiambo" },
  { id: "c2", name: "Brian Mwangi" },
  { id: "c3", name: "Cynthia Kamau" },
  { id: "c4", name: "David Otieno" },
  { id: "c5", name: "Esther Njoroge" },
  { id: "c6", name: "Felix Waweru" },
  { id: "c7", name: "Grace Achieng" },
  { id: "c8", name: "Hassan Abdi" },
];

export const MOCK_PAYMENTS: TriagePayment[] = [
  { id: "t1", mpesaRef: "RGJ4K8LM2N", phone: "+254799123456", amount: 1500, receivedAt: "2025-07-02T08:14:22Z", reason: "Unknown number" },
  { id: "t2", mpesaRef: "QHF2P9RT5W", phone: "+254711987654", amount: 500,  receivedAt: "2025-07-02T10:31:05Z", reason: "Ambiguous reference" },
  { id: "t3", mpesaRef: "BNM7X3KA1V", phone: "+254733445566", amount: 2000, receivedAt: "2025-07-03T07:55:44Z", reason: "3 children linked" },
  { id: "t4", mpesaRef: "LPQ8Y6CZ4E", phone: "+254755667788", amount: 750,  receivedAt: "2025-07-03T14:02:18Z", reason: "Unknown number" },
];

export const MOCK_BIRTHDAYS: Birthday[] = [
  { id: "b1", name: "Amara Odhiambo", date: "Jul 8",  age: 8,  daysUntil: 5  },
  { id: "b2", name: "Felix Waweru",    date: "Jul 14", age: 11, daysUntil: 11 },
  { id: "b3", name: "Grace Achieng",  date: "Jul 21", age: 7,  daysUntil: 18 },
  { id: "b4", name: "David Otieno",   date: "Jul 29", age: 9,  daysUntil: 26 },
];

export const MOCK_BDAY_DEPOSITS: BdayDeposit[] = [
  { id: "d1", childName: "Amara Odhiambo", amount: 500,  time: "Jul 1 · 09:12" },
  { id: "d2", childName: "Felix Waweru",    amount: 1000, time: "Jul 1 · 11:45" },
  { id: "d3", childName: "Grace Achieng",  amount: 500,  time: "Jul 1 · 14:20" },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", desc: "KES 1,000 auto-split: Brian & Cynthia Kamau",  time: "2h ago", type: "success"  },
  { id: "a2", desc: "BDAY deposit — Amara Odhiambo routed to fund", time: "3h ago", type: "birthday" },
  { id: "a3", desc: "KES 500 allocated to David Otieno",             time: "5h ago", type: "success"  },
  { id: "a4", desc: "New unallocated payment flagged for triage",    time: "6h ago", type: "alert"    },
];

export const MOCK_METRICS = {
  totalGeneral: 184500,
  birthdayFund: 23750,
};
