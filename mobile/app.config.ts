// app.config.ts
import { withSettingsGradle } from '@expo/config-plugins';

// Cleanly rebuild pluginManagement and scrub strays
const withCleanSettingsGradle = (config) =>
  withSettingsGradle(config, (cfg) => {
    let s = cfg.modResults.contents;

    // 1) remove any existing pluginManagement block
    s = s.replace(/pluginManagement\s*\{[\s\S]*?\}\s*/m, '');

    // 2) remove stray includeBuild lines anywhere (we'll add the right ones)
    const stray =
      /\s*includeBuild\([^\n]*(?:@react-native\/gradle-plugin|expo-modules-core\/android|react-settings-plugin)[^\n]*\)\s*\r?\n/g;
    s = s.replace(stray, '');

    // 3) build a clean pluginManagement block (Groovy vars to avoid parse issues)
    const rnInclude = `includeBuild(new File(["node","--print","require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile())`;

    const newBlock = `pluginManagement {
  repositories {
    gradlePluginPortal()
    google()
    mavenCentral()
  }
  ${rnInclude}

  // Resolve expo-modules-core/android via Node, using Groovy vars to keep parsing safe
  def expoCorePkg = ["node","--print","require.resolve('expo-modules-core/package.json')"].execute(null, rootDir).text.trim()
  def expoCoreDir = new File(expoCorePkg).getParentFile() // .../node_modules/expo-modules-core
  def expoCoreAndroid = new File(expoCoreDir, "android")
  includeBuild(expoCoreAndroid)
}
`;

    // 4) prepend our new pluginManagement and the RN settings plugin include (top-level)
    const topLevelReactSettings = `includeBuild("react-settings-plugin")\n`;
    s = `${newBlock}\n${topLevelReactSettings}${s}`.trim() + '\n';

    cfg.modResults.contents = s;
    return cfg;
  });

// ----- tiny helpers (plain JS) -----
function parseSemver(v) {
  const [major, minor, patch] = (v || '').split('.').map((x) => Number(x || 0));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}
/** versionCode = major*10000 + minor*100 + patch */
function toAndroidVersionCode(semver) {
  const { major, minor, patch } = parseSemver(semver);
  const code = major * 10000 + minor * 100 + patch;
  return Math.max(1, code);
}

export default ({ config }) => {
  const VERSION = '0.0.1';
  const APP_ID = 'com.domana.app';
  const SCHEME = 'domana';

  const EAS_CHANNEL = process.env.EAS_CHANNEL ?? 'dev';
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
  const ANDROID_MAPS_KEY = process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY ?? '';

  const derivedVersionCode = toAndroidVersionCode(VERSION);
  const ANDROID_VERSION_CODE = Number(process.env.ANDROID_VERSION_CODE ?? derivedVersionCode);
  const IOS_BUILD_NUMBER = String(process.env.IOS_BUILD_NUMBER ?? derivedVersionCode);

  return {
    ...config,
    name: 'Domana',
    slug: 'domana',
    version: VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: SCHEME,

    plugins: [
      'expo-dev-client',
      [
        'expo-build-properties',
        {
          android: {
            gradleProperties: {
              // pnpm monorepo: node_modules is at repo root on EAS
              REACT_NATIVE_NODE_MODULES_DIR: '../../node_modules',
            },
          },
        },
      ],
      // run last so we win
      withCleanSettingsGradle,
    ],

    ios: {
      supportsTablet: true,
      bundleIdentifier: APP_ID,
      buildNumber: IOS_BUILD_NUMBER,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Domana uses your location to show nearby content and improve map experiences.',
        NSCameraUsageDescription: 'Domana needs camera access to let you scan or upload photos.',
      },
    },

    android: {
      package: APP_ID,
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      ...(ANDROID_MAPS_KEY ? { config: { googleMaps: { apiKey: ANDROID_MAPS_KEY } } } : {}),
    },

    updates: { url: 'https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d' },
    runtimeVersion: { policy: 'appVersion' },

    extra: {
      eas: { projectId: '69982f4e-c195-48d6-923a-986f1b67cd1d' },
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },
  };
};
