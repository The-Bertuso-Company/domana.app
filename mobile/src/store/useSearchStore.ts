import { create } from "zustand";
import type { Bounds, Filters, Sort, Listing } from "../types/listing";

type Status = "idle" | "loading" | "error" | "success";

type LatLon = { lat: number; lon: number };

type State = {
  center: LatLon | null;
  zoom: number;
  bounds: Bounds | null;
  filters: Filters;
  sort: Sort;
  polygon: any | null;                 // GeoJSON Polygon
  results: Listing[];
  selectedId: string | null;
  hoverId: string | null;
  status: Status;
  error: string | null;

  // draw mode
  drawMode: boolean;
  vertices: LatLon[];
};

type Actions = {
  setCenter: (c: State["center"]) => void;
  setZoom: (z: number) => void;
  setBounds: (b: Bounds) => void;
  setFilters: (f: Partial<Filters>) => void;
  setSort: (s: Sort) => void;
  setPolygon: (p: State["polygon"]) => void;
  setResults: (r: Listing[]) => void;
  setStatus: (s: Status) => void;
  setSelectedId: (id: string | null) => void;
  setHoverId: (id: string | null) => void;
  setError: (e: string | null) => void;

  // draw actions
  setDrawMode: (on: boolean) => void;
  addVertex: (v: LatLon) => void;
  undoVertex: () => void;
  clearVertices: () => void;

  reset: () => void;
};

export const useSearchStore = create<State & Actions>((set) => ({
  center: null,
  zoom: 12,
  bounds: null,
  filters: {},
  sort: "relevance",
  polygon: null,
  results: [],
  selectedId: null,
  hoverId: null,
  status: "idle",
  error: null,

  drawMode: false,
  vertices: [],

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  setSort: (sort) => set({ sort }),
  setPolygon: (polygon) => set({ polygon }),
  setResults: (results) => set({ results }),
  setStatus: (status) => set({ status }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setHoverId: (hoverId) => set({ hoverId }),
  setError: (error) => set({ error }),

  setDrawMode: (on) => set((s) => ({ drawMode: on, vertices: on ? s.vertices : s.vertices })), // keep vertices if toggled accidentally
  addVertex: (v) => set((s) => ({ vertices: s.vertices.length >= 100 ? s.vertices : [...s.vertices, v] })),
  undoVertex: () => set((s) => ({ vertices: s.vertices.slice(0, -1) })),
  clearVertices: () => set({ vertices: [] }),

  reset: () =>
    set({
      center: null,
      zoom: 12,
      bounds: null,
      filters: {},
      sort: "relevance",
      polygon: null,
      results: [],
      selectedId: null,
      hoverId: null,
      status: "idle",
      error: null,
      drawMode: false,
      vertices: [],
    }),
}));
