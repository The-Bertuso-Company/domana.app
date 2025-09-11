export interface SavedListingSummary {
  id: string;
  price: number;
  addressLine?: string;
  city?: string;
  state?: string;
  thumb?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  type?: string;
  latitude?: number;
  longitude?: number;
}