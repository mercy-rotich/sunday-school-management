"use client";

import { useState, useEffect } from "react";
import { MOCK_BIRTHDAYS, MOCK_BDAY_DEPOSITS } from "@/lib/mockData";
import type { BirthdayData } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Real project replacement:
//
//   import { useQuery } from "@tanstack/react-query";
//
//   export function useBirthdayData() {
//     return useQuery<BirthdayData>({
//       queryKey: ["birthday-data"],
//       queryFn: () => fetch("/api/birthdays").then(r => r.json()),
//     });
//   }
// ─────────────────────────────────────────────────────────────────────────────

export function useBirthdayData() {
  const [data, setData] = useState<BirthdayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        birthdays: MOCK_BIRTHDAYS,
        deposits:  MOCK_BDAY_DEPOSITS,
      });
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
}
