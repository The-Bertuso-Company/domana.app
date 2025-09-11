import { useQuery } from "@tanstack/react-query";
import type { Listing } from "../types/listing";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const devSample: Listing = {
  id: "DEMO-123",
  address: { line1: "123 Demo St", city: "Crystal Lake", state: "IL", country: "US", postalCode: "60014" },
  price: 459000,
  beds: 4,
  baths: 3,
  sqft: 2320,
  lot_sqft: 8712,
  type: "Single Family",
  year_built: 2004,
  latitude: 42.241, longitude: -88.316,
  images: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c9fb?q=80&w=1600&auto=format&fit=crop"
  ],
  hoa_dues: 0,
  property_tax_annual: 6850,
  status: "ACTIVE",
  days_on_domana: 7,
  source: "dev-fallback",
  updated_at: new Date().toISOString(),
  listed_at: new Date(Date.now() - 7*864e5).toISOString()
};

async function fetchListing(id: string): Promise<Listing> {
  if (!API_URL) {
    // Dev fallback so the screen works before your API is wired.
    await new Promise(r => setTimeout(r, 350));
    return { ...devSample, id };
  }
  const res = await fetch(`${API_URL}/listings/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to load listing ${id}`);
  return res.json();
}

export function useListingById(id: string) {
  return useQuery({
    queryKey: ["listingById", id],
    queryFn: () => fetchListing(id),
    staleTime: 5 * 60 * 1000,
  });
}
