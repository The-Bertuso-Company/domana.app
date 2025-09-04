type Json = any;

const mem: Record<string, string> = {};

async function getAsyncStorage() {
  try {
    // dynamic import to avoid hard dependency
    const mod = await import("@react-native-async-storage/async-storage");
    return mod?.default || null;
  } catch {
    return null;
  }
}

export async function saveJson(key: string, value: Json) {
  try {
    const store = await getAsyncStorage();
    const payload = JSON.stringify(value);
    if (store) {
      await store.setItem(key, payload);
    } else {
      mem[key] = payload;
    }
  } catch {
    // ignore
  }
}

export async function loadJson<T = Json>(key: string): Promise<T | null> {
  try {
    const store = await getAsyncStorage();
    const raw = store ? await store.getItem(key) : mem[key];
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}