import type { SavedHome } from "./types";
import type { HomesFilters, SortBy } from "./uiState";

export function computePricePerSqft(h: SavedHome): number | undefined {
  const p = h.snapshot?.price;
  const s = h.snapshot?.sqft;
  if (!p || !s || s<=0) return undefined;
  return p / s;
}

export function matchesFilters(h: SavedHome, f: HomesFilters): boolean {
  if (!f.showArchived && h.isArchived) return false;

  // tags
  if (f.tags.length) {
    const ht = h.tags ?? [];
    if (f.tagsMode === "any") {
      if (!f.tags.some(t => ht.includes(t))) return false;
    } else {
      if (!f.tags.every(t => ht.includes(t))) return false;
    }
  }

  // verified
  if (f.verifiedOnly) {
    if (!h.snapshot || (h.snapshot.verifiedTier ?? 0) <= 0) return false;
  }

  // notes
  if (f.hasNotes && !(h.userNoteCount && h.userNoteCount > 0)) return false;

  // price range
  const price = h.snapshot?.price;
  if (typeof f.priceMin === "number" && (typeof price !== "number" || price < f.priceMin)) return false;
  if (typeof f.priceMax === "number" && (typeof price !== "number" || price > f.priceMax)) return false;

  return true;
}

export function sortHomes(arr: SavedHome[], sortBy: SortBy): SavedHome[] {
  const copy = arr.slice();
  const num = (v: any) => typeof v === "number" ? v : Number.NEGATIVE_INFINITY;

  switch (sortBy) {
    case "added_desc":
      copy.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "price_asc":
      copy.sort((a,b) => (num(a.snapshot?.price)) - (num(b.snapshot?.price)));
      break;
    case "price_desc":
      copy.sort((a,b) => (num(b.snapshot?.price)) - (num(a.snapshot?.price)));
      break;
    case "psf_asc":
      copy.sort((a,b) => (num(computePricePerSqft(a))) - (num(computePricePerSqft(b))));
      break;
    case "beds_desc":
      copy.sort((a,b) => (num(b.snapshot?.beds)) - (num(a.snapshot?.beds)));
      break;
    case "baths_desc":
      copy.sort((a,b) => (num(b.snapshot?.baths)) - (num(a.snapshot?.baths)));
      break;
    case "sqft_desc":
      copy.sort((a,b) => (num(b.snapshot?.sqft)) - (num(a.snapshot?.sqft)));
      break;
    case "distance_asc":
      copy.sort((a,b) => (num(a.snapshot?.distanceKm)) - (num(b.snapshot?.distanceKm)));
      break;
  }
  return copy;
}

export function uniqueTags(homes: SavedHome[]): string[] {
  const s = new Set<string>();
  homes.forEach(h => (h.tags ?? []).forEach(t => s.add(t)));
  return Array.from(s).sort((a,b)=>a.localeCompare(b));
}
