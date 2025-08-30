import Constants from "expo-constants";
type FlagKey = "SEARCH_TAB_ENABLED" | "MAP_ENABLED" | "SAVE_SEARCH_ENABLED" | "ANALYTICS_ENABLED";
export function getFlag(key: FlagKey): boolean {
  const flags = (Constants.expoConfig?.extra as any)?.flags ?? {};
  return Boolean(flags[key]);
}
