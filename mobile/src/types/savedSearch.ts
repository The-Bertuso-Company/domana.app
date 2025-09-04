import type { Bounds, Filters, Sort } from "../types/listing";

export type SavedSearch = {
  id: string;
  name: string;
  filters: Filters;
  bounds?: Bounds | null;
  polygon?: any | null;   // GeoJSON Polygon
  sort: Sort;
  createdAt: string;
  alertEnabled: boolean;
  fingerprint: string;    // stable hash of (filters+bbox/polygon+sort)
};
