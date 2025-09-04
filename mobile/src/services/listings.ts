import type { Bounds, Filters, Listing } from "../types/listing";
import { polygonBbox, pointInside } from "../utils/polygon";

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

function mockFromBounds(bounds: Bounds, count = 36): Listing[] {
  const [w, s, e, n] = bounds;
  const items: Listing[] = [];
  for (let i = 0; i < count; i++) {
    const lat = rnd(s, n);
    const lon = rnd(w, e);
    items.push(baseListing(lat, lon, i));
  }
  return items;
}

function baseListing(lat: number, lon: number, i: number): Listing {
  return {
    id: `${Math.random().toString(36).slice(2)}${i}`,
    title: "Sample Home",
    price: Math.floor(rnd(1_500_000, 20_000_000)),
    lat,
    lon,
    bedrooms: Math.floor(rnd(1, 5)),
    baths: Math.floor(rnd(1, 4)),
    area_sqm: Math.floor(rnd(25, 200)),
    photos: ["https://picsum.photos/seed/" + i + "/400/300"],
    badges: Math.random() > 0.7 ? ["New", "Verified"].slice(0, 1) : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchListings(params: {
  bounds?: Bounds;
  polygon?: any;
  filters?: Filters;
  sort?: string;
  page?: number;
}): Promise<Listing[]> {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  // If polygon provided, generate inside polygon bbox and filter
  if (params.polygon) {
    const bb = polygonBbox(params.polygon);
    if (!bb) return [];
    const [w, s, e, n] = bb;
    const pool: Listing[] = [];
    // create a larger pool then filter inside polygon
    const tries = 120;
    for (let i = 0; i < tries; i++) {
      const lat = rnd(s, n);
      const lon = rnd(w, e);
      if (pointInside(lat, lon, params.polygon)) {
        pool.push(baseListing(lat, lon, i));
      }
      if (pool.length >= 48) break;
    }
    return pool;
  }

  // fallback to bounds
  if (params.bounds) {
    return mockFromBounds(params.bounds, 36);
  }
  return [];
}
