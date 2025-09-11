import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { track } from "../../lib/track";
import type { SavedHome, SavedSearch, SavedHomeSnapshot } from "./types";
import { migrateOldHearts } from "./migration";

type Mutation =
  | { id: string; op: "addHome"; payload: SavedHome; ts: number }
  | { id: string; op: "removeHome"; payload: { listingId: string }; ts: number }
  | { id: string; op: "updateHome"; payload: { listingId: string; patch: Partial<SavedHome> }; ts: number }
  | { id: string; op: "addSearch"; payload: SavedSearch; ts: number }
  | { id: string; op: "updateSearch"; payload: { id: string; patch: Partial<SavedSearch> }; ts: number }
  | { id: string; op: "removeSearch"; payload: { id: string }; ts: number };

const SYNC_ENABLED = false;

type SavedState = {
  homes: Record<string, SavedHome>;
  searches: Record<string, SavedSearch>;
  queue: Mutation[];

  addHome: (home: SavedHome) => void;
  removeHome: (listingId: string) => void;
  toggleHome: (listingId: string) => void;
  setHomeNoteCount: (listingId: string, count: number) => void;
  addHomeTag: (listingId: string, tag: string) => void;
  removeHomeTag: (listingId: string, tag: string) => void;
  setHomeArchived: (listingId: string, archived: boolean) => void;
  setHomeSnapshot: (listingId: string, snap: SavedHomeSnapshot) => void;

  addSearch: (s: SavedSearch) => void;
  updateSearch: (id: string, patch: Partial<SavedSearch>) => void;
  removeSearch: (id: string) => void;
};

function enqueue(state: SavedState, m: Mutation): SavedState {
  if (!SYNC_ENABLED) return state;
  return { ...state, queue: [...state.queue, m] };
}

export const useSavedStore = create(
  persist<SavedState>(
    (set, get) => ({
      homes: {},
      searches: {},
      queue: [],

      addHome: (home) => set((state) => {
        const next = { ...state.homes, [home.listingId]: home };
        track("saved_home_add", { listingId: home.listingId });
        return enqueue({ ...state, homes: next }, { id: home.listingId, op: "addHome", payload: home, ts: Date.now() });
      }),

      removeHome: (listingId) => set((state) => {
        const next = { ...state.homes }; delete next[listingId];
        track("saved_home_remove", { listingId });
        return enqueue({ ...state, homes: next }, { id: listingId, op: "removeHome", payload: { listingId }, ts: Date.now() });
      }),

      toggleHome: (listingId) => {
        const exists = !!get().homes[listingId];
        if (exists) get().removeHome(listingId);
        else get().addHome({ listingId, createdAt: new Date().toISOString(), tags: [], userNoteCount: 0 });
      },

      setHomeNoteCount: (listingId, count) => set((state) => {
        const cur = state.homes[listingId]; if (!cur) return state;
        const next = { ...state.homes, [listingId]: { ...cur, userNoteCount: count } };
        return enqueue({ ...state, homes: next }, { id: listingId, op: "updateHome", payload: { listingId, patch: { userNoteCount: count } }, ts: Date.now() });
      }),

      addHomeTag: (listingId, tag) => set((state) => {
        const cur = state.homes[listingId]; if (!cur) return state;
        const tags = Array.from(new Set([...(cur.tags ?? []), tag]));
        track("saved_home_tag_add", { listingId, tag });
        const next = { ...state.homes, [listingId]: { ...cur, tags } };
        return enqueue({ ...state, homes: next }, { id: listingId, op: "updateHome", payload: { listingId, patch: { tags } }, ts: Date.now() });
      }),

      removeHomeTag: (listingId, tag) => set((state) => {
        const cur = state.homes[listingId]; if (!cur) return state;
        const tags = (cur.tags ?? []).filter((t) => t !== tag);
        track("saved_home_tag_remove", { listingId, tag });
        const next = { ...state.homes, [listingId]: { ...cur, tags } };
        return enqueue({ ...state, homes: next }, { id: listingId, op: "updateHome", payload: { listingId, patch: { tags } }, ts: Date.now() });
      }),

      setHomeArchived: (listingId, archived) => set((state) => {
        const cur = state.homes[listingId]; if (!cur) return state;
        track(archived ? "saved_home_archive" : "saved_home_unarchive", { listingId });
        const next = { ...state.homes, [listingId]: { ...cur, isArchived: archived } };
        return enqueue({ ...state, homes: next }, { id: listingId, op: "updateHome", payload: { listingId, patch: { isArchived: archived } }, ts: Date.now() });
      }),

      setHomeSnapshot: (listingId, snap) => set((state) => {
        const cur = state.homes[listingId]; if (!cur) return state;
        const next = { ...state.homes, [listingId]: { ...cur, snapshot: { ...(cur.snapshot ?? {}), ...snap } } };
        return enqueue({ ...state, homes: next }, { id: listingId, op: "updateHome", payload: { listingId, patch: { snapshot: snap } }, ts: Date.now() });
      }),

      addSearch: (s) => set((state) => {
        track("saved_search_create", { id: s.id });
        const next = { ...state.searches, [s.id]: s };
        return enqueue({ ...state, searches: next }, { id: s.id, op: "addSearch", payload: s, ts: Date.now() });
      }),

      updateSearch: (id, patch) => set((state) => {
        const cur = state.searches[id]; if (!cur) return state;
        const nextS = { ...state.searches, [id]: { ...cur, ...patch } };
        if (patch.name) track("saved_search_rename", { id });
        if (patch.isArchived !== undefined) track(patch.isArchived ? "saved_search_archive" : "saved_search_unarchive", { id, archived: patch.isArchived });
        return enqueue({ ...state, searches: nextS }, { id, op: "updateSearch", payload: { id, patch }, ts: Date.now() });
      }),

      removeSearch: (id) => set((state) => {
        const next = { ...state.searches }; delete next[id];
        track("saved_search_delete", { id });
        return enqueue({ ...state, searches: next }, { id, op: "removeSearch", payload: { id }, ts: Date.now() });
      }),
    }),
    {
      name: "domana:saved",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: async (persisted: any) => {
        const homes = await migrateOldHearts((persisted?.state?.homes) ?? persisted?.homes ?? {});
        const searches = (persisted?.state?.searches) ?? persisted?.searches ?? {};
        const queue: Mutation[] = [];
        return { state: { homes, searches, queue } } as any;
      },
      partialize: (state) => ({ homes: state.homes, searches: state.searches }),
    }
  )
);
