import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SortBy = "added_desc" | "price_asc" | "price_desc" | "psf_asc" | "beds_desc" | "baths_desc" | "sqft_desc" | "distance_asc";

export type HomesFilters = {
  tagsMode: "any" | "all";
  tags: string[];
  verifiedOnly: boolean;
  hasNotes: boolean;
  priceMin?: number;
  priceMax?: number;
  showArchived?: boolean;
};

type UiState = {
  sortBy: SortBy;
  filters: HomesFilters;
  selectMode: boolean;
  selectedIds: Set<string>;
  setSortBy: (s: SortBy) => void;
  setFilters: (f: Partial<HomesFilters>) => void;
  clearFilters: () => void;
  enterSelect: (initialId?: string) => void;
  exitSelect: () => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
};

export const useSavedUi = create(
  persist<UiState>(
    (set, get) => ({
      sortBy: "added_desc",
      filters: { tagsMode: "any", tags: [], verifiedOnly: false, hasNotes: false, showArchived: false },
      selectMode: false,
      selectedIds: new Set<string>(),
      setSortBy: (s) => set({ sortBy: s }),
      setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),
      clearFilters: () => set({ filters: { tagsMode: "any", tags: [], verifiedOnly: false, hasNotes: false, showArchived: false } }),
      enterSelect: (initialId) => set((state) => { const n = new Set(state.selectedIds); if (initialId) n.add(initialId); return { selectMode: true, selectedIds: n }; }),
      exitSelect: () => set({ selectMode: false, selectedIds: new Set() }),
      toggleSelect: (id) => set((state) => { const n = new Set(state.selectedIds); if (n.has(id)) n.delete(id); else n.add(id); return { selectedIds: n }; }),
      clearSelection: () => set({ selectedIds: new Set() }),
    }),
    { name: "domana:saved:ui", version: 1, storage: createJSONStorage(() => AsyncStorage), partialize: (s) => ({ sortBy: s.sortBy, filters: s.filters }) }
  )
);
