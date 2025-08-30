import type { Bounds, Filters, Listing } from "../types/listing";

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

function mockFromBounds(bounds: Bounds, count = 36): Listing[] {
  const [w, s, e, n] = bounds;
  const items: Listing[] = [];
  for (let i = 0; i < count; i++) {
    const lat = rnd(s, n);
    const lon = rnd(w, e);
    items.push({
      id: `${Math.random().toString(36).slice(2)}${i}`,
      title: "Sample Home",
      price: Math.floor(rnd(1_500_000, 20_000_000)),
      lat,
      lon,
      bedrooms: Math.floor(rnd(1, 5)),
      baths: Math.floor(rnd(1, 4)),
      area_sqm: Math.floor(rnd(25, 200)),
      photos: ["https://picsum.photos/seed/" + i + "/400/300"],
      badges: Math.random() > 0.7 ? ["New", "Verified"].slice(0, Math.floor(rnd(1, 2))) : undefined,
      updatedAt: new Date().toISOString(),
    });
  }
  return items;
}

export async function fetchListings(params: {
  bounds?: Bounds;
  polygon?: any;
  filters?: Filters;
  sort?: string;
  page?: number;
}): Promise<Listing[]> {
  if (!params.bounds) return [];
  await new Promise((r) => setTimeout(r, 350)); // simulate latency
  return mockFromBounds(params.bounds, 36);
}
