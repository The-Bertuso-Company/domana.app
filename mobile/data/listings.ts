// data/listings.ts
export type Listing = { id: string; title: string };

export const LISTINGS: Listing[] = [
  { id: "ph-1001", title: "2BR in BGC" },
  { id: "ph-1002", title: "House in Cebu" },
];

export const getListingById = (id: string) => LISTINGS.find((l) => l.id === id);
