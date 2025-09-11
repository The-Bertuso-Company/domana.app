import { isStale } from "../src/utils/offlineCache";

describe("offline cache staleness", () => {
  it("is not stale within window", () => {
    const ts = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();
    expect(isStale(ts, 7)).toBe(false);
  });

  it("is stale after window", () => {
    const ts = new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString();
    expect(isStale(ts, 7)).toBe(true);
  });
});
