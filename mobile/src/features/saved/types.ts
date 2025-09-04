export type Tag = string;

export interface SavedHomeSnapshot {
  price?: number;          // list price in currency units
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: number;
  addressLine?: string;    // "123 Main St, City"
  verifiedTier?: number;   // 0=unknown, 1..3 increasing trust
  reduced?: boolean;
  distanceKm?: number;     // optional, if known relative to user/map center
}

export interface SavedHome {
  listingId: string;
  createdAt: string;           // ISO
  lastSeenAt?: string;         // ISO
  source?: "list" | "detail" | "share";
  isArchived?: boolean;
  tags?: Tag[];
  userNoteCount?: number;
  snapshot?: SavedHomeSnapshot;
}

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;           // ISO
  lastRunAt?: string;          // ISO
  params: Record<string, unknown>; // filters/sort/bounds/etc.
  resultsCount?: number;
  notifySettings?: {
    priceDrop?: boolean;
    newMatches?: boolean;
  };
  isArchived?: boolean;
}
