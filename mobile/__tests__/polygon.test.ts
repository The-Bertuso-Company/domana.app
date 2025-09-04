import { verticesToPolygon, polygonAreaKm2, pointInside } from "../src/utils/polygon";

describe("polygon utils", () => {
  const square = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 1 },
    { lat: 1, lon: 1 },
    { lat: 1, lon: 0 },
  ];

  it("returns null for <3 vertices", () => {
    expect(verticesToPolygon([])).toBeNull();
    expect(verticesToPolygon([{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }])).toBeNull();
  });

  it("creates a polygon and computes sensible area", () => {
    const poly = verticesToPolygon(square)!;
    const area = polygonAreaKm2(poly);
    expect(area).toBeGreaterThan(10000);
    expect(area).toBeLessThan(20000);
    expect(pointInside(0.5, 0.5, poly)).toBe(true);
    expect(pointInside(2, 2, poly)).toBe(false);
  });
});
