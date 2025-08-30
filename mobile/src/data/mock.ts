/* src/data/mock.ts */
import { Listing } from "@/src/types";

export const listings: Listing[] = [
  {
    id: "l-bg-01",
    title: "Condo in BGC",
    price: 8900000,
    bedrooms: 2,
    baths: 2,
    area_sqm: 68,
    lat: 14.5526,
    lng: 121.0437,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
    ],
    badges: ["New", "Near MRT"]
  },
  {
    id: "l-ceb-01",
    title: "House in Cebu",
    price: 5400000,
    bedrooms: 3,
    baths: 2,
    area_sqm: 120,
    lat: 10.3157,
    lng: 123.8854,
    images: [
      "https://images.unsplash.com/photo-1560448075-bb4caa6c0f11?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop"
    ],
    badges: ["For sale"]
  },
  {
    id: "l-mdl-01",
    title: "Studio in Mandaluyong",
    price: 2900000,
    bedrooms: 1,
    baths: 1,
    area_sqm: 24,
    lat: 14.5826,
    lng: 121.0401,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop"
    ],
    badges: ["Deal"]
  }
];

export function getListing(id: string) {
  return listings.find(l => l.id === id);
}
