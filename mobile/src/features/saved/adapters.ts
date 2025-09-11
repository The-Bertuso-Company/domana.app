import { useSavedStore } from "./store";
import type { SavedHomeSnapshot } from "./types";
import { track } from "../../lib/track";

export function isSaved(listingId: string): boolean {
  return !!useSavedStore.getState().homes[listingId];
}

export function saveWithSnapshot(listingId: string, snapshot?: SavedHomeSnapshot) {
  const s = useSavedStore.getState();
  if (s.homes[listingId]) return;
  s.addHome({ listingId, createdAt: new Date().toISOString(), tags: [], userNoteCount: 0, snapshot });
  if (snapshot) track("saved_home_snapshot_capture", { listingId });
}

export function toggleSaved(listingId: string, snapshot?: SavedHomeSnapshot) {
  const s = useSavedStore.getState();
  if (s.homes[listingId]) s.removeHome(listingId);
  else s.addHome({ listingId, createdAt: new Date().toISOString(), tags: [], userNoteCount: 0, snapshot });
}

export function refreshSnapshot(listingId: string, patch: SavedHomeSnapshot) {
  const s = useSavedStore.getState();
  if (!s.homes[listingId]) return;
  s.setHomeSnapshot(listingId, patch);
}
