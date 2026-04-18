"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { store } from "@/store";
import { useState, useEffect, type ReactNode } from "react";
import { rehydrate } from "@/features/auth/authSlice";
import { initDarkMode } from "@/store/slices/uiSlice";

function StoreInitializer({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    store.dispatch(rehydrate());
    store.dispatch(initDarkMode());
    setReady(true);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StoreInitializer>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 500,
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#fff" },
                style: { background: "#f0fdf4", color: "#065f46", border: "1px solid #bbf7d0" },
              },
              error: {
                iconTheme: { primary: "#f43f5e", secondary: "#fff" },
                style: { background: "#fff1f2", color: "#9f1239", border: "1px solid #fecdd3" },
              },
            }}
          />
        </StoreInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
