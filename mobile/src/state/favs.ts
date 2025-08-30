/* src/state/favs.ts */
import { create } from "zustand";
type S = { ids: Record<string, true>; toggle: (id: string) => void; has: (id: string) => boolean; };
export const useFavs = create<S>((set, get) => ({
  ids: {},
  toggle: (id) => set((s) => {
    const next = { ...s.ids };
    if (next[id]) delete next[id]; else next[id] = true;
    return { ids: next };
  }),
  has: (id) => !!get().ids[id],
}));
