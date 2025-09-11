import React, { createContext, useContext } from "react";
import { colors } from "./colors";
import { font } from "./typography";
import { spacing } from "./spacing";

const theme = { colors, font, spacing };
const ThemeCtx = createContext(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
