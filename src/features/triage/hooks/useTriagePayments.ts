"use client";

import { useState, useEffect, useCallback } from "react";
import { MOCK_PAYMENTS } from "@/lib/mockData";
import type { TriagePayment } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// In a real project this would be:
//
//   import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//
//   export function useTriagePayments() {
//     const queryClient = useQueryClient();
//
//     const { data, isLoading } = useQuery({
//       queryKey: ["triage-payments"],
//       queryFn: () => fetch("/api/payments/unallocated").then(r => r.json()),
//     });
//
//     const { mutate: allocate } = useMutation({
//       mutationFn: ({ paymentId, childId }: { paymentId: string; childId: string }) =>
//         fetch(`/api/payments/${paymentId}/allocate`, {
//           method: "POST",
//           body: JSON.stringify({ childId }),
//         }),
//       onSuccess: () => queryClient.invalidateQueries({ queryKey: ["triage-payments"] }),
//     });
//
//     return { data, isLoading, allocate };
//   }
// ─────────────────────────────────────────────────────────────────────────────

export function useTriagePayments() {
  const [data, setData] = useState<TriagePayment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(MOCK_PAYMENTS.map((p) => ({ ...p })));
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const allocate = useCallback((id: string) => {
    setData((prev) => prev?.filter((p) => p.id !== id) ?? null);
  }, []);

  return { data, isLoading, allocate };
}
