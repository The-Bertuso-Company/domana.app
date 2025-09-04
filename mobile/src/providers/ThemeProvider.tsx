import { PropsWithChildren, useMemo } from "react";
import { useColorScheme } from "react-native";
import { createContext, useContext } from "react";
import { colors, spacing, radius, type } from "../theme/tokens";
import { useAppStore } from "../state/useAppStore";

type ThemeMode = "light" | "dark";
type Theme = {
  mode: ThemeMode;
  colors: typeof colors.light;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
};

const ThemeCtx = createContext<Theme | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const pref = useAppStore(s => s.themePref); // "system" | "light" | "dark"
  const mode: ThemeMode = pref === "system" ? system : pref;

  const value = useMemo<Theme>(() => ({
    mode,
    colors: mode === "dark" ? colors.dark : colors.light,
    spacing,
    radius,
    type
  }), [mode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
