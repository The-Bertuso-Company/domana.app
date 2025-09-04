import { stableStringify, hashString } from "../src/utils/stable";

describe("stableStringify + hashString", () => {
  it("orders keys deterministically", () => {
    const a = { b: 1, a: 2, nested: { y: 3, x: 4 } };
    const b = { nested: { x: 4, y: 3 }, a: 2, b: 1 };
    expect(stableStringify(a)).toBe(stableStringify(b));
  });

  it("hash is deterministic", () => {
    const s = stableStringify({ foo: 1, bar: [3,2,1] });
    const h1 = hashString(s);
    const h2 = hashString(s);
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(8);
  });
});
