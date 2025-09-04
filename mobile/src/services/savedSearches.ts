import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Bounds, Filters, Sort } from "../types/listing";
import type { SavedSearch } from "../types/savedSearch";
import { stableStringify, hashString } from "../utils/stable";
import { polygonBbox } from "../utils/polygon";

const KEY = "domana:savedSearches:v1";

export async function listSavedSearches(): Promise<SavedSearch[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveAll(list: SavedSearch[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export function makeFingerprint(opts: { filters: Filters; bounds?: Bounds | null; polygon?: any | null; sort: Sort }): string {
  const base = {
    filters: opts.filters ?? {},
    sort: opts.sort ?? "relevance",
    bounds: opts.polygon ? null : opts.bounds ?? null,
    polygon: opts.polygon ? opts.polygon : null,
  };
  return hashString(stableStringify(base));
}

// generate a friendly name like: "Custom area • 2–3 BR • ₱2M–₱6M"
export function suggestName(p: { filters: Filters; polygon?: any | null; bounds?: Bounds | null }): string {
  const parts: string[] = [];
  parts.push(p.polygon ? "Custom area" : "Map area");
  if (p.filters?.beds) parts.push(`${p.filters.beds}+ BR`);
  if (p.filters?.baths) parts.push(`${p.filters.baths}+ BA`);
  const fm = p.filters?.priceMin, fx = p.filters?.priceMax;
  const peso = (n: number) => "₱" + n.toLocaleString();
  if (fm && fx) parts.push(`${peso(fm)}–${peso(fx)}`);
  else if (fm) parts.push(`≥ ${peso(fm)}`);
  else if (fx) parts.push(`≤ ${peso(fx)}`);
  return parts.join(" • ");
}

export async function saveCurrentSearch(input: {
  name?: string;
  filters: Filters;
  bounds?: Bounds | null;
  polygon?: any | null;
  sort: Sort;
}): Promise<{ saved: SavedSearch; list: SavedSearch[] }> {
  const list = await listSavedSearches();
  const fingerprint = makeFingerprint(input);
  const existing = list.find((s) => s.fingerprint === fingerprint);
  if (existing) {
    // already saved; return as-is
    return { saved: existing, list };
  }
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const name = input.name && input.name.trim().length ? input.name : suggestName(input);
  let bounds = input.bounds ?? null;
  if (input.polygon && !bounds) {
    const bb = polygonBbox(input.polygon);
    if (bb) bounds = bb as any;
  }
  const saved: SavedSearch = {
    id,
    name,
    filters: input.filters ?? {},
    bounds,
    polygon: input.polygon ?? null,
    sort: input.sort ?? "relevance",
    createdAt: new Date().toISOString(),
    alertEnabled: false,
    fingerprint,
  };
  const next = [saved, ...list].slice(0, 50); // cap 50
  await saveAll(next);
  return { saved, list: next };
}

export async function toggleAlert(id: string, enabled: boolean): Promise<SavedSearch[]> {
  const list = await listSavedSearches();
  const next = list.map((s) => (s.id === id ? { ...s, alertEnabled: enabled } : s));
  await saveAll(next);
  return next;
}

export async function removeSavedSearch(id: string): Promise<SavedSearch[]> {
  const list = await listSavedSearches();
  const next = list.filter((s) => s.id !== id);
  await saveAll(next);
  return next;
}
