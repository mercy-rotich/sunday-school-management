"use client";

import { useState, useEffect } from "react";
import { MOCK_METRICS, MOCK_ACTIVITY } from "@/lib/mockData";
import type { DashboardMetrics } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Real project replacement:
//
//   import { useQuery } from "@tanstack/react-query";
//
//   export function useDashboardData(liveUnallocated: number) {
//     const { data, isLoading } = useQuery<Omit<DashboardMetrics, "unallocated">>({
//       queryKey: ["dashboard-metrics"],
//       queryFn: () => fetch("/api/dashboard/metrics").then(r => r.json()),
//     });
//     return {
//       data: data ? { ...data, unallocated: liveUnallocated } : null,
//       isLoading,
//     };
//   }
// ─────────────────────────────────────────────────────────────────────────────

export function useDashboardData(liveUnallocated: number) {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        totalGeneral: MOCK_METRICS.totalGeneral,
        birthdayFund: MOCK_METRICS.birthdayFund,
        unallocated:  liveUnallocated,
        activity:     MOCK_ACTIVITY,
      });
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [liveUnallocated]);

  return { data, isLoading };
}
