import { useEffect } from "react";
import { loadLastSearch, isStale } from "../utils/offlineCache";
import { useIsOnline } from "./useConnectivity";
import { useSearchStore } from "../store/useSearchStore";
import { track } from "../utils/analytics";

export function useHydrateLastSearchOffline() {
  const online = useIsOnline();
  const { setFilters, setBounds, setPolygon, setResults, setStatus, setCenter, setZoom } = useSearchStore() as any;

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (online) return; // only hydrate when offline
      const cache = await loadLastSearch();
      if (!cache || isStale(cache.timestamp)) return;
      if (!mounted) return;

      // Apply inputs
      setFilters(cache.inputs.filters ?? {});
      if (cache.inputs.polygon) setPolygon(cache.inputs.polygon);
      else if (cache.inputs.bounds) setBounds(cache.inputs.bounds);
      if (cache.inputs.center) setCenter(cache.inputs.center);
      if (typeof cache.inputs.zoom === "number") setZoom(cache.inputs.zoom);

      // Apply results
      setResults(cache.results ?? []);
      setStatus("success");

      const ageMs = Date.now() - new Date(cache.timestamp).getTime();
      track("offline_boot_used_cache", { age_hours: Math.round(ageMs / 3600000) });
    })();
    return () => { mounted = false; };
  }, [online, setFilters, setBounds, setPolygon, setResults, setStatus, setCenter, setZoom]);
}
