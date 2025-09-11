import * as Amplitude from "expo-analytics-amplitude";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Localization from "expo-localization";
import type { BaseProps } from "./taxonomy";

let inited = false;

function getExtra() {
  // @ts-expect-error: expoConfig is present at runtime in dev
  return (Constants as any).expoConfig?.extra ?? {};
}

export function getApiKey(): string {
  const fromEnv = process.env.AMPLITUDE_API_KEY;
  const fromExtra = getExtra().amplitudeApiKey;
  return (fromEnv || fromExtra || "").toString();
}

export function isEnabled(): boolean {
  const envFlag = (process.env.ANALYTICS_ENABLED ?? "").toLowerCase();
  const fromExtra = getExtra().flags?.analytics;
  // default: enabled if key exists; explicit false disables
  const enabled = envFlag ? envFlag === "true" : fromExtra !== false;
  return enabled && !!getApiKey();
}

export async function init(): Promise<void> {
  if (inited) return;
  const key = getApiKey();
  if (!key) return;
  await Amplitude.initializeAsync(key);
  inited = true;
}

export function baseProps(): BaseProps & Record<string, any> {
  const ex: any = Constants;
  const config: any = (Constants as any).expoConfig ?? {};
  return {
    app_version: ex.expoVersion || config.version || "dev",
    platform: Platform.OS,
    locale: Localization.locale,
  };
}

export async function log(name: string, props?: Record<string, any>) {
  if (!isEnabled()) return;
  if (!inited) await init();
  try {
    await Amplitude.logEventAsync(name, { ...baseProps(), ...(props ?? {}) });
  } catch {
    // swallow analytics errors
  }
}
