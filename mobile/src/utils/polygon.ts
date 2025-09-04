import * as turf from "@turf/turf";

export type LatLon = { lat: number; lon: number };

export function verticesToPolygon(vertices: LatLon[]) {
  if (vertices.length < 3) return null;
  const ring = vertices.map((v) => [v.lon, v.lat]);
  // close ring
  if (ring.length && (ring[0][0] !== ring[ring.length-1][0] || ring[0][1] !== ring[ring.length-1][1])) {
    ring.push(ring[0]);
  }
  const poly = turf.polygon([ring]);
  // simplify lightly to reduce vertices if the user tapped many points
  const simplified = turf.simplify(poly, { tolerance: 0.0002, highQuality: false });
  return simplified;
}

export function polygonAreaKm2(polygon: any): number {
  try { return turf.area(polygon) / 1_000_000; } catch { return 0; }
}

export function polygonBbox(polygon: any): [number, number, number, number] | null {
  try { return turf.bbox(polygon) as [number, number, number, number]; } catch { return null; }
}

export function pointInside(lat: number, lon: number, polygon: any): boolean {
  try {
    return turf.booleanPointInPolygon(turf.point([lon, lat]), polygon);
  } catch { return false; }
}
