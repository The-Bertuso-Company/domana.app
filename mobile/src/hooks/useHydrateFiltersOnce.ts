import { useEffect } from "react";
import { useSearchStore } from "../store/useSearchStore";
import { loadFilters } from "../utils/filterPersist";
import { normalizeFilters } from "../schemas/filters";

// call inside a screen to hydrate filters from storage on first mount
export function useHydrateFiltersOnce() {
  const { setFilters } = useSearchStore();
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const saved = await loadFilters();
      if (saved && isMounted) {
        setFilters(normalizeFilters(saved));
      }
    })();
    return () => { isMounted = false; };
  }, [setFilters]);
}
