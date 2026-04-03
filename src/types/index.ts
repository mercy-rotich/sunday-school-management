// ─── Domain Types ───────────────────────────────────────────────────────────

export interface Child {
  id: string;
  name: string;
}

export interface TriagePayment {
  id: string;
  mpesaRef: string;
  phone: string;
  amount: number;
  receivedAt: string;
  reason: string;
  status?: "UNALLOCATED" | "ALLOCATED";
}

export interface Birthday {
  id: string;
  name: string;
  date: string;
  age: number;
  daysUntil: number;
}

export interface BdayDeposit {
  id: string;
  childName: string;
  amount: number;
  time: string;
}

export interface ActivityItem {
  id: string;
  desc: string;
  time: string;
  type: "success" | "birthday" | "alert";
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalGeneral: number;
  birthdayFund: number;
  unallocated: number;
  activity: ActivityItem[];
}

export interface BirthdayData {
  birthdays: Birthday[];
  deposits: BdayDeposit[];
}

// ─── UI / Store Types ────────────────────────────────────────────────────────

export interface UiState {
  sidebarCollapsed: boolean;
  activeNav: string;
}

export type MetricVariant = "default" | "birthday" | "alert";

export interface NavItem {
  id: string;
  label: string;
  badge: boolean;
}
