import { useEffect, useState, useCallback } from "react";
import type { CalcPrefs } from "../types/calc";
import { defaultPrefs } from "../lib/finance";
import { loadJson, saveJson } from "../lib/storage";

const KEY = "calcPrefs";

export function useCalcPrefs() {
  const [prefs, setPrefs] = useState<CalcPrefs>(defaultPrefs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadJson<CalcPrefs>(KEY);
      if (saved) setPrefs({ ...defaultPrefs, ...saved });
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (next: CalcPrefs) => {
    setPrefs(next);
    await saveJson(KEY, next);
  }, []);

  const reset = useCallback(async () => {
    setPrefs(defaultPrefs);
    await saveJson(KEY, defaultPrefs);
  }, []);

  return { prefs, setPrefs: save, reset, loading, defaultPrefs };
}