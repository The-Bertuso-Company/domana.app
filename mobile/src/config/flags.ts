import Constants from "expo-constants";

export type Flags = { SELL_TAB_ENABLED: boolean; PRO_TAB_ENABLED: boolean };

const fallback: Flags = { SELL_TAB_ENABLED: true, PRO_TAB_ENABLED: true };
const extra: any =
  // SDK 49+: expoConfig.extra ; older: manifestExtra
  (Constants as any)?.expoConfig?.extra ?? (Constants as any)?.manifestExtra ?? {};

export const flags: Flags = {
  ...fallback,
  ...(extra?.flags ?? {}),
  ...(extra?.mobileFlags ?? {}),
};

export default flags;
