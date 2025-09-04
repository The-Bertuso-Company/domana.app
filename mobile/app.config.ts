import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  // Make sure our polyfills load BEFORE Expo Router
  entryPoint: "./index.js",

  name: "Domana",
  slug: "domana-mobile",
  scheme: "domana",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.domana.app",
  },

  android: {
    package: "com.domana.app",
    intentFilters: [
      {
        action: "VIEW",
        category: ["BROWSABLE", "DEFAULT"],
        data: [
          { scheme: "domana" },
          { scheme: "https", host: "domana.app" },
        ],
      },
    ],
  },

  web: {
    bundler: "metro",
  },

  plugins: [
    "expo-font",
    "expo-web-browser",
    "expo-localization",
  ],

  extra: {
    // keep anything already present on the incoming config
    ...config.extra,
    flags: {
      SEARCH_TAB_ENABLED: true,
      MAP_ENABLED: true,
      SAVE_SEARCH_ENABLED: true,
      ANALYTICS_ENABLED: true,
    },
    flagsRemoteUrl: process.env.FLAGS_URL ?? "",
    amplitudeApiKey: process.env.AMPLITUDE_API_KEY ?? "",
    sentryDsn: process.env.SENTRY_DSN ?? "",
  },
});
