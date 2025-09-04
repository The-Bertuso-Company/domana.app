import { useSavedStore } from "./store";
import type { SavedHome, SavedSearch } from "./types";

export const useSavedHomes = () =>
  useSavedStore((s) => s.homes);
export const useSavedSearches = () =>
  useSavedStore((s) => s.searches);

export const useSavedActions = () => {
  const addHome = useSavedStore((s) => s.addHome);
  const removeHome = useSavedStore((s) => s.removeHome);
  const toggleHome = useSavedStore((s) => s.toggleHome);
  const setHomeNoteCount = useSavedStore((s) => s.setHomeNoteCount);
  const addHomeTag = useSavedStore((s) => s.addHomeTag);
  const removeHomeTag = useSavedStore((s) => s.removeHomeTag);
  const addSearch = useSavedStore((s) => s.addSearch);
  const updateSearch = useSavedStore((s) => s.updateSearch);
  const removeSearch = useSavedStore((s) => s.removeSearch);
  return { addHome, removeHome, toggleHome, setHomeNoteCount, addHomeTag, removeHomeTag, addSearch, updateSearch, removeSearch };
};

export type { SavedHome, SavedSearch };
