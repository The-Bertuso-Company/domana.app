import { create } from "zustand";

type ThemePref = "system" | "light" | "dark";
type AppState = {
  themePref: ThemePref;
  setThemePref: (v: ThemePref) => void;
};

export const useAppStore = create<AppState>((set) => ({
  themePref: "system",
  setThemePref: (v) => set({ themePref: v }),
}));
