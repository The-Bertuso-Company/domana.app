import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MortgagePrefs {
  dpPct: number;
  rate: number;
  termYears: number;
  taxAnnualPct: number;   // % of price used if listing tax missing
  insAnnualPct: number;   // % of price used if listing insurance missing
  pmiRateAnnual: number;  // decimal (e.g., 0.005)
  pmiEnabled: boolean;
}

const KEY = "mortgage:prefs:v1";

function defaultPrefs(currency = process.env.EXPO_PUBLIC_CURRENCY || "USD"): MortgagePrefs {
  const c = (currency || "USD").toUpperCase();
  if (c === "PHP") {
    return { dpPct: 20, rate: 8.25, termYears: 20, taxAnnualPct: 0.006, insAnnualPct: 0.0015, pmiRateAnnual: 0.004, pmiEnabled: true };
  }
  return { dpPct: 20, rate: 6.75, termYears: 30, taxAnnualPct: 0.010, insAnnualPct: 0.0035, pmiRateAnnual: 0.005, pmiEnabled: true };
}

export function useMortgagePrefs() {
  const [prefs, setPrefs] = useState<MortgagePrefs>(defaultPrefs());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setPrefs({ ...defaultPrefs(), ...JSON.parse(raw) });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = useCallback(async (next: MortgagePrefs) => {
    setPrefs(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  return { prefs, save, loading };
}