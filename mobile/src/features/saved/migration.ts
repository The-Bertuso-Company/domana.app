import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedHome } from "./types";

const CANDIDATE_KEYS = ["domana:hearts","domana:favorites","domana:heartMap","domana:savedHomes","domana:likedHomes"];
type HeartMap = Record<string, boolean>;
type IdList = string[];
const nowISO = () => new Date().toISOString();

export async function migrateOldHearts(existing: Record<string, SavedHome>) {
  const already = new Set(Object.keys(existing ?? {}));
  const homes = { ...(existing ?? {}) } as Record<string, SavedHome>;
  let imported = 0;
  let usedKeys: string[] = [];

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const heartish = (allKeys || []).filter((k) => /heart|favorite/i.test(k));
    const keysToTry = Array.from(new Set([...CANDIDATE_KEYS, ...heartish]));

    for (const key of keysToTry) {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) continue;

      let parsed: unknown;
      try { parsed = JSON.parse(raw); } catch { continue; }

      const addId = (id: string) => {
        if (!id || already.has(id) || homes[id]) return;
        homes[id] = { listingId: id, createdAt: nowISO(), tags: [], userNoteCount: 0 };
        imported++;
      };

      if (Array.isArray(parsed)) {
        (parsed as IdList).forEach(addId);
        usedKeys.push(key);
      } else if (parsed && typeof parsed === "object") {
        const map = parsed as HeartMap;
        Object.entries(map).forEach(([id, v]) => { if (v) addId(id); });
        usedKeys.push(key);
      }
    }

    if (imported > 0 && usedKeys.length > 0) {
      try { await AsyncStorage.multiRemove(usedKeys); } catch {}
    }
    console.log(`[Phase9 Migration] imported=${imported}, fromKeys=${JSON.stringify(usedKeys)}`);
  } catch (e) {
    console.log("[Phase9 Migration] error", e);
  }
  return homes;
}
