import { useSearchStore } from "../src/store/useSearchStore";

describe("useSearchStore basics", () => {
  it("sets filters and selection", () => {
    const store = (useSearchStore as any);
    store.getState().setFilters({ beds: 3 });
    expect(store.getState().filters.beds).toBe(3);

    store.getState().setSelectedId("abc");
    expect(store.getState().selectedId).toBe("abc");
  });

  it("sets bounds and center", () => {
    const store = (useSearchStore as any);
    store.getState().setBounds([1,2,3,4]);
    expect(store.getState().bounds).toEqual([1,2,3,4]);
    store.getState().setCenter({ lat: 10, lon: 11 });
    expect(store.getState().center).toEqual({ lat: 10, lon: 11 });
  });
});
