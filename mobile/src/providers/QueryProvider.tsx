// mobile/src/providers/QueryProvider.tsx
import React, { useEffect } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";

const client = new QueryClient();

function AppStateBridge() {
  useEffect(() => {
    // Focus manager (foreground / background)
    const sub = AppState.addEventListener("change", (state) =>
      focusManager.setFocused(state === "active")
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    // Online manager (network up/down)
    const unsub = NetInfo.addEventListener((s) =>
      onlineManager.setOnline(!!s.isConnected)
    );
    return () => unsub();
  }, []);

  return null;
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <AppStateBridge />
      {children}
    </QueryClientProvider>
  );
};
