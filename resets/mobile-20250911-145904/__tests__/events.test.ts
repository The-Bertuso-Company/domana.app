import { on, off, emit } from "../src/utils/events";

describe("events bus", () => {
  it("subscribes and emits", () => {
    let got = 0;
    const fn = (n?: number) => { got = (n ?? 0); };
    const unsub = on("ping", fn);
    emit("ping", 42);
    expect(got).toBe(42);
    unsub();
    emit("ping", 7);
    expect(got).toBe(42);
  });
});
