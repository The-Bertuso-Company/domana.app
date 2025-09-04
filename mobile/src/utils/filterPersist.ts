import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Filters } from "../schemas/filters";
const KEY = "domana:lastFilters:v1";

export async function saveFilters(f: Filters) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(f)); } catch {}
}

export async function loadFilters(): Promise<Filters | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
