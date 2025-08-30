export interface Listing {
  id: string;
  address: {
    line1: string;
    city: string;
    state?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  lot_sqft?: number;
  type?: string;
  year_built?: number;
  latitude?: number;
  longitude?: number;
  images: string[];
  hoa_dues?: number;
  property_tax_annual?: number;
  status?: "ACTIVE" | "PENDING" | "SOLD" | string;
  days_on_domana?: number;
  source?: string;
  updated_at?: string;
  listed_at?: string;
}
