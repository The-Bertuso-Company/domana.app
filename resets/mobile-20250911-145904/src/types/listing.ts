export type Listing = {
  id: string;
  title: string;
  price: number;
  lat: number;
  lon: number;
  bedrooms: number;
  baths: number;
  area_sqm: number;
  photos: string[];
  badges?: string[];
  updatedAt: string;
};

export type Bounds = [west: number, south: number, east: number, north: number];

export type Filters = {
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  propertyType?: string[];
  hasPhotos?: boolean;
};

export type Sort = "relevance" | "price_asc" | "price_desc" | "newest";
