import Constants from "expo-constants";

const KEYS = ["SEARCH_TAB_ENABLED","MAP_ENABLED","SAVE_SEARCH_ENABLED","ANALYTICS_ENABLED"] as const;
export type FlagKey = typeof KEYS[number];
type Flags = Partial<Record<FlagKey, boolean>>;

let remote: Flags | null = null;
let localOverrides: Flags = {};

/** Safely read flags from any Expo runtime source (SDK 53 dev/prod). */
function readExtraFlags(): Flags {
  const c: any = Constants as any;

  // Dev: expoConfig.extra
  const devExtra = (Constants.expoConfig?.extra ?? {}) as any;

  // Classic manifest (older)
  const m1Extra = (Constants.manifest as any)?.extra ?? {};

  // New manifest2 shape (EAS)
  const m2Extra = c?.manifest2?.extra?.expoClient?.extra ?? {};

  const from = (devExtra.flags ?? m1Extra.flags ?? m2Extra.flags ?? {}) as any;

  const cleaned: Flags = {};
  for (const k of KEYS) {
    if (typeof from[k] === "boolean") cleaned[k] = from[k];
  }
  return cleaned;
}

/** Initialize flags with an optional remote JSON (e.g., https://.../flags.json). */
export async function initFlags(remoteUrl?: string) {
  remote = null;
  if (!remoteUrl) return;
  try {
    const res = await fetch(remoteUrl, { cache: "no-store" as any });
    if (res.ok) {
      const j = await res.json();
      const next: Flags = {};
      for (const k of KEYS) {
        if (typeof j?.[k] === "boolean") next[k] = j[k];
      }
      remote = next;
    }
  } catch {
    // ignore network/JSON errors; fall back to local flags
    remote = null;
  }
}

export function setLocalOverride(key: FlagKey, value: boolean) { localOverrides[key] = value; }
export function clearLocalOverride(key?: FlagKey) {
  if (key) delete localOverrides[key];
  else localOverrides = {};
}

export function getFlag(key: FlagKey): boolean {
  if (key in localOverrides) return !!localOverrides[key];
  if (remote && key in remote) return !!remote[key];
  const base = readExtraFlags();
  if (key in base) return !!base[key];
  return false; // safe default
}

export function listFlags(): Record<FlagKey, boolean> {
  const out = {} as Record<FlagKey, boolean>;
  for (const k of KEYS) out[k] = getFlag(k);
  return out;
}
