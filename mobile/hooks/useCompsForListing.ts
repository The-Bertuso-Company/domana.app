import { useQuery } from "@tanstack/react-query";
import type { Listing } from "../types/listing";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface CompItem extends Listing {
  distanceKm?: number;
}

export function useCompsForListing(listing: Listing) {
  return useQuery<CompItem[]>({
    queryKey: ["compsByListing", listing.id],
    queryFn: async () => {
      if (!API_URL) {
        // Dev fallback: synthesize ~6 comps near price/size and nearby coords
        const base = listing;
        const baseLat = base.latitude ?? 14.5995;
        const baseLng = base.longitude ?? 120.9842;
        const rand = (min: number, max: number) => Math.random() * (max - min) + min;
        const mk = (i: number): CompItem => {
          const dLat = rand(-0.02, 0.02);
          const dLng = rand(-0.02, 0.02);
          const lat = baseLat + dLat;
          const lng = baseLng + dLng;
          const price = Math.round((base.price || 300000) * (1 + rand(-0.12, 0.12)));
          const beds = (base.beds ?? 3) + Math.round(rand(-1, 1));
          const baths = (base.baths ?? 2) + Math.round(rand(-1, 1));
          const sqft = Math.max(600, Math.round((base.sqft ?? 1600) * (1 + rand(-0.18, 0.18))));
          const id = `DEMO-COMP-${i}-${base.id}`;
          return {
            id,
            address: {
              line1: `${100 + i} Sample Ave`,
              city: base.address.city || "Sample City",
              state: base.address.state,
              province: base.address.province,
              postalCode: base.address.postalCode,
              country: base.address.country,
            },
            price,
            beds, baths, sqft,
            lot_sqft: Math.round((base.lot_sqft ?? 5000) * (1 + rand(-0.2, 0.2))),
            type: base.type || "Single Family",
            year_built: (base.year_built ?? 2005) + Math.round(rand(-10, 10)),
            latitude: lat, longitude: lng,
            images: [
              "https://images.unsplash.com/photo-1560185008-b033106af2fb?q=80&w=1600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1600585154340-1e4ce9a06d0c?q=80&w=1600&auto=format&fit=crop",
            ],
            hoa_dues: 0,
            property_tax_annual: Math.round(price * 0.009),
            status: "ACTIVE",
            days_on_domana: Math.floor(rand(1, 45)),
            source: "dev-fallback",
            updated_at: new Date().toISOString(),
            listed_at: new Date(Date.now() - Math.floor(rand(1, 20))*86400000).toISOString(),
            distanceKm: haversine(baseLat, baseLng, lat, lng),
          };
        };
        await new Promise(r => setTimeout(r, 220));
        return Array.from({ length: 6 }, (_, i) => mk(i + 1)).sort((a,b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      }
      const res = await fetch(`${API_URL}/listings/${encodeURIComponent(listing.id)}/comps?limit=8`);
      if (!res.ok) throw new Error("Failed to load comps");
      const items: CompItem[] = await res.json();
      // Normalize optional distance field name variations
      for (const it of items) {
        const anyIt: any = it as any;
        it.distanceKm = it.distanceKm ?? anyIt.distance_km ?? anyIt.distance ?? undefined;
      }
      return items;
    },
    staleTime: 30 * 60 * 1000, // 30 min
  });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => d * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}