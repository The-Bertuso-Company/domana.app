import { useQuery } from "@tanstack/react-query";
import type { Listing } from "../types/listing";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Comp = Pick<Listing, "id" | "price" | "beds" | "baths" | "sqft" | "type" | "images" | "latitude" | "longitude"> & {
  distanceKm?: number;
};

type Params = {
  radiusKm?: number;
  pricePct?: number;   // +/- pct (e.g. 0.15 => ±15%)
  metaTolerance?: number; // beds/baths ±N, sqft ±N%
};

const DEFAULTS: Required<Params> = {
  radiusKm: 3,
  pricePct: 0.15,
  metaTolerance: 1,
};

// ---- Fetchers ----
async function fetchServerComps(listingId: string, params: Required<Params>): Promise<Comp[]> {
  const url = `${API_URL}/listings/${encodeURIComponent(listingId)}/comps?radius_km=${params.radiusKm}&price_pct=${params.pricePct}&meta_tol=${params.metaTolerance}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load comps");
  return res.json();
}

// ---- Dev Fallback Generator (deterministic-ish) ----
function prng(seed: number) {
  return () => (seed = (seed * 48271) % 0x7fffffff) / 0x7fffffff;
}
function hashCode(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return Math.abs(h); }

function genFallbackComps(base: Listing, params: Required<Params>): Comp[] {
  const seed = hashCode(base.id);
  const rnd = prng(seed || 7);
  const count = 8;

  const imgs = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-1e4c4a5baf17?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop"
  ];

  const out: Comp[] = [];
  for (let i = 0; i < count; i++) {
    const priceDelta = 1 + (rnd() * 2 - 1) * params.pricePct; // ±pricePct
    const sqftDelta = 1 + (rnd() * 2 - 1) * 0.18; // ±18%
    const beds = Math.max(1, Math.round((base.beds ?? 3) + (rnd() * 2 - 1) * params.metaTolerance));
    const baths = Math.max(1, Math.round((base.baths ?? 2) + (rnd() * 2 - 1) * params.metaTolerance));
    const sqft = Math.max(400, Math.round((base.sqft ?? 1800) * sqftDelta));
    const price = Math.max(25000, Math.round((base.price || 350000) * priceDelta / 1000) * 1000);

    // shift lat/lng slightly within radius
    let latitude = base.latitude, longitude = base.longitude, distanceKm: number | undefined = undefined;
    if (latitude != null && longitude != null) {
      const bearing = rnd() * 2 * Math.PI;
      const dist = rnd() * params.radiusKm!; // 0..radius
      const dLat = (dist / 111) * Math.cos(bearing);
      const dLng = (dist / (111 * Math.cos((latitude * Math.PI) / 180))) * Math.sin(bearing);
      latitude = latitude + dLat;
      longitude = longitude + dLng;
      distanceKm = Math.round(dist * 10) / 10;
    }

    out.push({
      id: `${base.id}-C${i + 1}`,
      price,
      beds,
      baths,
      sqft,
      type: base.type || "Single Family",
      images: [imgs[Math.floor(rnd() * imgs.length)]],
      latitude,
      longitude,
      distanceKm,
    });
  }
  return out.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
}

// ---- Hook ----
export function useCompsByListing(base: Listing, p?: Params) {
  const params: Required<Params> = { ...DEFAULTS, ...p };
  return useQuery({
    queryKey: ["compsByListing", base.id, params],
    queryFn: async () => {
      if (API_URL) return fetchServerComps(base.id, params);
      await new Promise(r => setTimeout(r, 200));
      return genFallbackComps(base, params);
    },
    staleTime: 30 * 60 * 1000,
  });
}