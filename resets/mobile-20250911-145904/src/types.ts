/* src/types.ts */
export type Listing = {
  id: string;
  title: string;
  price: number;          // PHP
  bedrooms: number;
  baths: number;
  area_sqm: number;
  lat: number;
  lng: number;
  images: string[];
  badges?: string[];
};
