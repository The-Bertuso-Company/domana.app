import { useEffect, useMemo, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { track } from "../lib/analytics";

const KEY = "shortlist:v1";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

type ShortlistSet = Record<string, true>;

export function useShortlist() {
  const [map, setMap] = useState<ShortlistSet>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setMap(JSON.parse(raw));
    } finally { setLoading(false); }
  })(); }, []);

  const ids = useMemo(() => Object.keys(map), [map]);
  const isSaved = useCallback((id: string) => !!map[id], [map]);

  const saveLocal = async (next: ShortlistSet) => {
    setMap(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = useCallback(async (id: string) => {
    const next = { ...map, [id]: true };
    await saveLocal(next);
    track("save_shortlist", { listingId: id, action: "add" });
    // Optional server sync (best-effort)
    try {
      if (API_URL) {
        await fetch(`${API_URL}/me/shortlist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      }
    } catch {}
  }, [map]);

  const remove = useCallback(async (id: string) => {
    const next = { ...map }; delete next[id];
    await saveLocal(next);
    track("save_shortlist", { listingId: id, action: "remove" });
    try {
      if (API_URL) { await fetch(`${API_URL}/me/shortlist/${encodeURIComponent(id)}`, { method: "DELETE" }); }
    } catch {}
  }, [map]);

  const toggle = useCallback(async (id: string) => { (map[id] ? remove : add)(id); }, [map, add, remove]);

  return { loading, ids, isSaved, add, remove, toggle };
}