// app.config.js
require("dotenv/config");

/** @type {import('@expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const VERSION = "0.0.1";
  const APP_ID = "com.domana.app";
  const code = 1; // iOS buildNumber fallback

  const ANDROID_MAPS_KEY =
    process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY || "";

  return {
    ...config,

    // ── Identity ────────────────────────────────────────────────────────────────
    name: "Domana",
    slug: "domana",
    version: VERSION,
    scheme: "domana",
    orientation: "portrait",
    icon: "./assets/icon.png",

    // ── Plugins (minimal & monorepo-safe) ──────────────────────────────────────
    plugins: [
  "expo-dev-client",
  [
    "expo-build-properties",
    {
      android: {
        // pnpm monorepo on EAS: node_modules at repo root
        gradleProperties: {
          REACT_NATIVE_NODE_MODULES_DIR: "../../node_modules",
        },
      },
    },
  ],
],


    // ── iOS ────────────────────────────────────────────────────────────────────
    ios: {
      supportsTablet: true,
      bundleIdentifier: APP_ID,
      buildNumber: String(process.env.IOS_BUILD_NUMBER ?? code),
    },

    // ── Android ────────────────────────────────────────────────────────────────
    android: {
      package: APP_ID,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      // Map the Google Maps key into AndroidManifest via config
      config: {
        googleMaps: { apiKey: ANDROID_MAPS_KEY },
      },
      // Optional but helpful for universal deep links on Android
      intentFilters: [
        {
          action: "VIEW",
          data: [{ scheme: "domana", host: "*" }],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    // ── OTA / Runtime Versioning ───────────────────────────────────────────────
    updates: {
      url: "https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d",
    },
    runtimeVersion: { policy: "appVersion" }, // aligns OTA to version

    // ── Extras / Runtime Env ───────────────────────────────────────────────────
    extra: {
      eas: { projectId: "69982f4e-c195-48d6-923a-986f1b67cd1d" },
      env: {
        EAS_CHANNEL: process.env.EAS_CHANNEL ?? "dev",
      },
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
      androidMapsKey: ANDROID_MAPS_KEY, // convenient for debugging
    },
  };
};
