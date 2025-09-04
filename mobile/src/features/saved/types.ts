export type Tag = string;

export interface SavedHomeSnapshot {
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: number;
  addressLine?: string;
  verifiedTier?: number;
  reduced?: boolean;
  distanceKm?: number;
}

export interface SavedHome {
  listingId: string;
  createdAt: string;
  lastSeenAt?: string;
  source?: "list" | "detail" | "share";
  isArchived?: boolean;
  tags?: Tag[];
  userNoteCount?: number;
  snapshot?: SavedHomeSnapshot;
}

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;
  lastRunAt?: string;
  params: Record<string, unknown>;
  resultsCount?: number;
  notifySettings?: { priceDrop?: boolean; newMatches?: boolean; };
  isArchived?: boolean;
}
