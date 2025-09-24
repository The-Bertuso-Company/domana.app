import { ConfigContext, ExpoConfig } from "expo/config";
import { withSettingsGradle } from "@expo/config-plugins";

const withReplacePluginManagement = (config: any) =>
  withSettingsGradle(config, (cfg) => {
    let s: string = cfg.modResults.contents;

    const start = s.indexOf("pluginManagement {");
    const pluginsIdx = s.indexOf("\nplugins {", start >= 0 ? start : 0);
    const before = start >= 0 ? s.slice(0, start) : "";
    const after = pluginsIdx >= 0 ? s.slice(pluginsIdx) : s;

    const newBlock = `pluginManagement {
  // Repos for plugins
  repositories {
    gradlePluginPortal()
    google()
    mavenCentral()
  }

  // RN Gradle plugin (RN 0.74.x)
  includeBuild(new File(["node","--print","require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile())

  // Expo Modules gradle plugin (monorepo-safe):
  // Prefer ../../node_modules when android/ lives under a package (e.g. mobile/android),
  // fall back to ../node_modules for single-package repos.
  def expoModulesA = new File(rootDir, "../../node_modules/expo-modules-core/android")
  def expoModulesB = new File(rootDir, "../node_modules/expo-modules-core/android")
  includeBuild(expoModulesA.exists() ? expoModulesA : expoModulesB)

  // RN 0.74 settings plugin used by template (only for <= 0.74.3)
  def version = providers.exec { commandLine("node", "-e", "console.log(require('react-native/package.json').version);") }.standardOutput.asText.get().trim()
  def vcore = version.split("-")[0]
  def (_, rnMinor, rnPatch) = vcore.tokenize(".").collect { it.toInteger() }
  if (rnMinor == 74 && rnPatch <= 3) {
    includeBuild("react-settings-plugin")
  }
}
`;

    // Stitch the file back together with our new block
    if (start >= 0 && pluginsIdx >= 0) {
      s = before + newBlock + after;
    } else if (start >= 0) {
      s = before + newBlock; // fallback: no explicit "plugins {" anchor found
    } else {
      s = newBlock + "\n" + s; // fallback: no existing block; prepend ours
    }

    // Finally, remove ANY stray expo-modules-core includeBuild lines outside our block
    s = s.replace(/\s*includeBuild\([^\n]*expo-modules-core\/android[^\n]*\)\s*\r?\n/g, "");

    cfg.modResults.contents = s;
    return cfg;
  });

function parseSemver(v: string) {
  const [major, minor, patch] = v.split(".").map((x) => Number(x || 0));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}
/** versionCode = major*10000 + minor*100 + patch */
function toAndroidVersionCode(semver: string): number {
  const { major, minor, patch } = parseSemver(semver);
  const code = major * 10000 + minor * 100 + patch;
  return Math.max(1, code);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const VERSION = "0.0.1";
  const APP_ID = "com.domana.app";
  const SCHEME = "domana";

  const EAS_CHANNEL = process.env.EAS_CHANNEL ?? "dev";
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";
  const ANDROID_MAPS_KEY = process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY ?? "";

  const derivedVersionCode = toAndroidVersionCode(VERSION);
  const ANDROID_VERSION_CODE = Number(process.env.ANDROID_VERSION_CODE ?? derivedVersionCode);
  const IOS_BUILD_NUMBER = String(process.env.IOS_BUILD_NUMBER ?? derivedVersionCode);

  return withReplacePluginManagement({
    ...config,
    name: "Domana",
    slug: "domana",
    version: VERSION,
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: SCHEME,

    plugins: [
      "expo-dev-client",
      [
        "expo-build-properties",
        {
          android: {
            gradleProperties: {
              REACT_NATIVE_NODE_MODULES_DIR: "../../node_modules", // pnpm monorepo
            },
          },
        },
      ],
    ],

    ios: {
      supportsTablet: true,
      bundleIdentifier: APP_ID,
      buildNumber: IOS_BUILD_NUMBER,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Domana uses your location to show nearby content and improve map experiences.",
        NSCameraUsageDescription: "Domana needs camera access to let you scan or upload photos.",
      },
    },

    android: {
      package: APP_ID,
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      ...(ANDROID_MAPS_KEY ? { config: { googleMaps: { apiKey: ANDROID_MAPS_KEY } } } : {}),
    },

    updates: { url: "https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d" },
    runtimeVersion: { policy: "appVersion" },

    extra: {
      eas: { projectId: "69982f4e-c195-48d6-923a-986f1b67cd1d" },
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },
  } as ExpoConfig);
};