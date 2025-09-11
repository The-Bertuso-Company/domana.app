export interface CanonicalListing {
  id: string;
  status: "active"|"pending"|"sold"|"off_market";
  intent: "sale"|"rent";
  property_type: "house"|"condo"|"townhouse"|"lot"|"farm"|"land"|"commercial_lite";
  price_amount: number;
  price_currency: "PHP";
  price_frequency: "one_time"|"monthly";
  beds?: number | null;
  baths?: number | null;
  floor_area_sqm?: number | null;
  lot_area_sqm?: number | null;
  year_built?: number | null;
  address: {
    country_code: "PH"|"US";
    region: string; province: string; city_municipality: string; barangay: string;
    subdivision?: string | null; street_address: string; postal_code: string;
    location: { lat: number; lng: number; }
  };
  location: { lat: number; lng: number; };
  source: "manual"|"csv"|"partner";
  external_source_id?: string;
  attrs?: Record<string, unknown>;
}
export interface FeedAdapter {
  name: string;
  extract(input: unknown): AsyncGenerator<Record<string, unknown>>;
  transform(row: Record<string, unknown>): Promise<CanonicalListing>;
}
