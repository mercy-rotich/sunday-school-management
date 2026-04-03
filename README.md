# SundaySchool Finance Portal

Admin dashboard for the Sunday School Contribution Management System.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS — pure utility classes, zero custom CSS
- **State**: Redux Toolkit (UI state) + TanStack React Query (server state)
- **Icons**: Inline SVG (Lucide-compatible shapes)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Providers (Redux, React Query)
│   ├── providers.tsx           # Client-side provider wrapper
│   ├── page.tsx                # Redirects → /dashboard
│   └── dashboard/
│       └── page.tsx            # Main dashboard page
│
├── components/
│   ├── ui/
│   │   ├── Icons.tsx           # All SVG icon primitives
│   │   ├── MetricCard.tsx      # KPI card (default / birthday / alert variants)
│   │   └── Skeleton.tsx        # Animated loading placeholder
│   └── layout/
│       ├── Sidebar.tsx         # Collapsible nav (slate-900, Image 1 style)
│       └── TopHeader.tsx       # Top bar with export + profile
│
├── features/
│   ├── triage/
│   │   ├── components/
│   │   │   └── TriageTable.tsx         # Inline-allocate payments table
│   │   ├── hooks/
│   │   │   └── useTriagePayments.ts    # Fetch + allocate mutation
│   │   └── types.ts
│   └── birthdays/
│       ├── components/
│       │   └── BirthdayModule.tsx      # Upcoming birthdays + BDAY deposits
│       ├── hooks/
│       │   └── useBirthdayData.ts      # Birthday data fetch
│       └── types.ts
│
├── hooks/
│   └── useDashboardData.ts     # Aggregated metrics hook
│
├── store/
│   ├── index.ts                # Redux store config
│   └── slices/
│       └── uiSlice.ts          # Sidebar collapse + active nav state
│
├── lib/
│   ├── mockData.ts             # All mock data (swap with real API calls)
│   ├── utils.ts                # fmt(), fmtT() helpers
│   └── queryClient.ts          # TanStack Query client config
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

## Wiring to a Real Backend

Every data-fetching hook in `src/features/**/hooks/` and `src/hooks/` contains
a commented-out TanStack Query replacement. Swap the `useEffect` mock with the
`useQuery` / `useMutation` block shown in the comment, point the `queryFn` at
your Spring Boot endpoints, and the UI works identically.

## Styling Contract

- ✅ Pure Tailwind utility classes only
- ✅ Zero `<style>` tags
- ✅ Zero CSS modules
- ✅ Zero `style={{}}` props (no runtime inline styles)
- **Palette**: `slate-900` sidebar · `stone-50` page · `white` cards · `sky-600` primary · `emerald` success · `amber` warning · `violet` birthday
