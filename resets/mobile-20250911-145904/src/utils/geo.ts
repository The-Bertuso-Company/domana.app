import type { Feature, FeatureCollection, Point } from "geojson";
import type { Listing } from "../types/listing";

export type ListingFeature = Feature<Point, { id: string; price: number; title: string; photo?: string }>;

export function listingsToFeatureCollection(list: Listing[]): FeatureCollection<Point, ListingFeature["properties"]> {
  const features: ListingFeature[] = list.map((l) => ({
    type: "Feature",
    id: l.id,
    geometry: { type: "Point", coordinates: [l.lon, l.lat] },
    properties: { id: l.id, price: l.price, title: l.title, photo: l.photos?.[0] },
  }));
  return { type: "FeatureCollection", features };
}

export function clampZoom(z: number) {
  if (Number.isNaN(z)) return 12;
  return Math.max(0, Math.min(20, z));
}

export function regionFromCenterZoom(center: { lat: number; lon: number }, zoom: number) {
  const lonDelta = 360 / Math.pow(2, zoom);
  const latDelta = lonDelta; // simple approximation
  return {
    latitude: center.lat,
    longitude: center.lon,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
}
