import * as Amplitude from "expo-analytics-amplitude";
import Constants from "expo-constants";
import type { DomanaEvent } from "./taxonomy";
import { getFlag } from "../flags";
import { Platform } from "react-native";

let initialized = false;

function getKey(): string | undefined {
  const extra: any =
    Constants.expoConfig?.extra ??
    // fallback shapes in various runtimes
    (Constants as any)?.manifest?.extra ??
    (Constants as any)?.manifest2?.extra?.expoClient?.extra;
  return extra?.amplitudeApiKey || undefined;
}

export async function initAnalytics() {
  if (initialized) return;
  if (!getFlag("ANALYTICS_ENABLED")) { initialized = false; return; }

  const key = getKey();
  if (!key || key.trim().length === 0) { initialized = false; return; }

  await Amplitude.initializeAsync(key);

  initialized = true;

  // Fire a single boot event
  track({ name: "AppStarted", props: { build: String(Constants.expoVersion ?? Constants.expoConfig?.version ?? ""), os: Platform.OS } });
}

export function identify(userId: string | null | undefined) {
  if (!initialized || !userId) return;
  Amplitude.setUserIdAsync(userId);
}

export function setUserProps(props: Record<string, any>) {
  if (!initialized) return;
  Amplitude.setUserPropertiesAsync(props);
}

export function track(evt: DomanaEvent) {
  if (!initialized) return;
  // @ts-ignore Amplitude types accept any object for properties
  Amplitude.logEvent(evt.name, evt.props);
}

export function screen(name: string, params?: Record<string, any>) {
  track({ name: "ScreenViewed", props: { name, params } });
}
