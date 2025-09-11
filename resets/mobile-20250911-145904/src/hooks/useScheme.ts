/* src/hooks/useScheme.ts */
import * as React from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

export type Scheme = "light" | "dark";
export type Override = "system" | "light" | "dark";

type Store = {
  override: Override;
  setOverride: (o: Override) => void;
  cycle: () => void; // system -> light -> dark -> system
};

export const useSchemeStore = create<Store>((set, get) => ({
  override: "system",
  setOverride: (o) => set({ override: o }),
  cycle: () => {
    const order: Override[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(get().override) + 1) % order.length];
    set({ override: next });
  },
}));

export function useScheme(): Scheme {
  const override = useSchemeStore((s) => s.override);
  const [sys, setSys] = React.useState<ColorSchemeName>(Appearance.getColorScheme() ?? "light");
  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSys(colorScheme ?? "light");
    });
    return () => sub.remove();
  }, []);
  const selected = override === "system" ? sys : override;
  return selected === "dark" ? "dark" : "light";
}
