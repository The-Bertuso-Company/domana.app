import { ExpoConfig } from "expo/config";

export default (): ExpoConfig => ({
  name: "Domana",
  slug: "domana-mobile",
  scheme: "domana",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  ios: { supportsTablet: true, bundleIdentifier: "com.domana.app" },
  android: {
    package: "com.domana.app",
    intentFilters: [
      {
        action: "VIEW",
        category: ["BROWSABLE", "DEFAULT"],
        data: [{ scheme: "domana" }, { scheme: "https", host: "domana.app" }]
      }
    ]
  },
  web: { bundler: "metro" },
  plugins: [
    "expo-router",
    "expo-localization",
    ["sentry-expo", { project: "domana-mobile" }]
  ],
  extra: {
    flags: {
      SEARCH_TAB_ENABLED: true,
      MAP_ENABLED: true,
      SAVE_SEARCH_ENABLED: true,
      ANALYTICS_ENABLED: true
    },
    amplitudeApiKey: process.env.AMPLITUDE_API_KEY ?? "",
    sentryDsn: process.env.SENTRY_DSN ?? ""
  }
});
