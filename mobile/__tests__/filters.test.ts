import { normalizeFilters } from "../src/schemas/filters";

describe("normalizeFilters", () => {
  it("swaps priceMin > priceMax", () => {
    const f = normalizeFilters({ priceMin: 10_000_000, priceMax: 2_000_000, beds: 3 });
    expect(f.priceMin).toBe(2_000_000);
    expect(f.priceMax).toBe(10_000_000);
    expect(f.beds).toBe(3);
  });

  it("drops undefined/nulls", () => {
    const f = normalizeFilters({ priceMin: undefined as any, baths: 0 as any });
    expect(Object.prototype.hasOwnProperty.call(f, "priceMin")).toBe(false);
    expect(f.baths ?? 0).toBe(0);
  });
});
