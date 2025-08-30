/* src/lib/query.tsx */
import * as React from "react";
import { AppState } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";

// Single client instance (stable across fast refresh)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

// Keep focus state in sync so React Query knows when to refetch
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener("change", (state) =>
    handleFocus(state === "active")
  );
  return () => sub.remove();
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
