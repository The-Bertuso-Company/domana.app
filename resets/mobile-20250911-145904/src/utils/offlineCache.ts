import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Bounds, Filters, Sort, Listing } from "../types/listing";

const KEY = "domana:lastSearch:v1";

export type LastSearchCache = {
  timestamp: string;
  inputs: {
    filters: Filters;
    bounds?: Bounds | null;
    polygon?: any | null;
    sort: Sort;
    center?: { lat: number; lon: number } | null;
    zoom?: number;
  };
  results: Listing[];
};

export async function saveLastSearch(cache: LastSearchCache) {
  try {
    // Trim results if huge (safety)
    const trimmed = { ...cache, results: cache.results.slice(0, 400) };
    await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {}
}

export async function loadLastSearch(): Promise<LastSearchCache | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !parsed?.inputs) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isStale(ts: string, days = 7) {
  const t = new Date(ts).getTime();
  if (!t) return true;
  return Date.now() - t > days * 24 * 60 * 60 * 1000;
}
