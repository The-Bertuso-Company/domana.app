import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueries } from "@tanstack/react-query";
import type { Listing } from "../types/listing";
import { track } from "../lib/analytics";

const KEY = "compare:v1";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const MAX = 4;

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } finally { setLoading(false); }
  })(); }, []);

  const save = async (next: string[]) => { setIds(next); await AsyncStorage.setItem(KEY, JSON.stringify(next)); };

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const add = useCallback(async (id: string) => {
    if (ids.includes(id)) return;
    const next = [...ids, id].slice(0, MAX);
    await save(next);
    track("toggle_compare", { listingId: id, action: "add", count: next.length });
  }, [ids]);

  const remove = useCallback(async (id: string) => {
    const next = ids.filter(x => x !== id);
    await save(next);
    track("toggle_compare", { listingId: id, action: "remove", count: next.length });
  }, [ids]);

  const clear = useCallback(async () => { await save([]); track("clear_compare"); }, []);

  const toggle = useCallback(async (id: string) => { (ids.includes(id) ? remove : add)(id); }, [ids, add, remove]);

  return { loading, ids, has, add, remove, clear, toggle, max: MAX };
}

// Lightweight fetcher for compare screen (dev-safe)
async function fetchListingLight(id: string): Promise<Listing> {
  if (!API_URL) {
    // dev fallback
    return {
      id,
      address: { line1: `${id.slice(-4)} Demo Rd`, city: "Crystal Lake", state: "IL", country: "US", postalCode: "60014" },
      price: 400000 + Math.round(Math.random() * 150000),
      beds: 3 + Math.round(Math.random()),
      baths: 2 + Math.round(Math.random()),
      sqft: 1600 + Math.round(Math.random() * 1200),
      lot_sqft: 6000 + Math.round(Math.random() * 4000),
      type: "Single Family",
      year_built: 2000 + Math.round(Math.random() * 20),
      latitude: 42.24, longitude: -88.31,
      images: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop"],
      hoa_dues: 0,
      property_tax_annual: 5000 + Math.round(Math.random() * 3000),
      status: "ACTIVE",
      days_on_domana: Math.round(Math.random() * 40),
      source: "dev-compare",
      updated_at: new Date().toISOString(),
      listed_at: new Date().toISOString(),
    };
  }
  const res = await fetch(`${API_URL}/listings/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to load listing");
  return res.json();
}

export function useCompareListings(ids: string[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["listingById", id, "compare"],
      queryFn: () => fetchListingLight(id),
      staleTime: 5 * 60 * 1000,
    })),
  });
  const items = queries.map((q, i) => ({ id: ids[i], data: q.data as Listing | undefined, isLoading: q.isLoading }));
  const anyLoading = queries.some(q => q.isLoading);
  return { items, anyLoading };
}