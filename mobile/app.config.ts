import { ConfigContext, ExpoConfig } from 'expo/config';
import { withSettingsGradle } from '@expo/config-plugins';

// Inject expo-modules-core's Gradle plugin repository into pluginManagement { repositories { ... } }
const withExpoModulesGradleRepo = (config: any) =>
  withSettingsGradle(config, (cfg) => {
    let contents: string = cfg.modResults.contents;

    // Already present? Do nothing.
    if (/expo-modules-core\/android/.test(contents)) {
      return cfg;
    }

    const inject = `
  repositories {
    // Make the Expo Modules Gradle plugin resolvable
    maven { url(new File(["node", "--print", "require.resolve('expo-modules-core/package.json')"].execute(null, rootDir).text.trim()).getParentFile().toString() + "/android") }
    gradlePluginPortal()
    google()
    mavenCentral()
  }`;

    contents = contents.replace(/pluginManagement\s*\{/, (m) => `${m}\n${inject}\n`);
    cfg.modResults.contents = contents;
    return cfg;
  });

function parseSemver(v: string) {
  const [major, minor, patch] = v.split('.').map((x) => Number(x || 0));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}

/** versionCode = major*10000 + minor*100 + patch (e.g., 1.2.3 => 10203) */
function toAndroidVersionCode(semver: string): number {
  const { major, minor, patch } = parseSemver(semver);
  const code = major * 10000 + minor * 100 + patch;
  return Math.max(1, code);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const VERSION = '0.0.1';
  const APP_ID = 'com.domana.app';
  const SCHEME = 'domana';

  // Build-time / public envs
  const EAS_CHANNEL = process.env.EAS_CHANNEL ?? 'dev';
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
  const ANDROID_MAPS_KEY = process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY ?? '';

  // Versioning (kept for manifest/runtime reads; EAS uses remote app version source)
  const derivedVersionCode = toAndroidVersionCode(VERSION);
  const ANDROID_VERSION_CODE = Number(process.env.ANDROID_VERSION_CODE ?? derivedVersionCode);
  const IOS_BUILD_NUMBER = String(process.env.IOS_BUILD_NUMBER ?? derivedVersionCode);

  return withExpoModulesGradleRepo({
    ...config,
    name: 'Domana',
    slug: 'domana',
    version: VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: SCHEME,

    // Custom dev client + Gradle hints for pnpm workspaces
    plugins: [
      'expo-dev-client',
      [
        'expo-build-properties',
        {
          android: {
            gradleProperties: {
              // pnpm workspace: point Gradle at the root node_modules
              REACT_NATIVE_NODE_MODULES_DIR: '../../node_modules',
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
          'Domana uses your location to show nearby content and improve map experiences.',
        NSCameraUsageDescription: 'Domana needs camera access to let you scan or upload photos.',
        NSPhotoLibraryAddUsageDescription:
          'Domana saves images to your library when you export or download content.',
        NSPhotoLibraryUsageDescription:
          'Domana needs access to your photo library to let you pick images.',
      },
    },

    android: {
      package: APP_ID,
      // NOTE: EAS remote versioning ignores this for Play, but we keep it for manifest/Constants reads.
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      ...(ANDROID_MAPS_KEY ? { config: { googleMaps: { apiKey: ANDROID_MAPS_KEY } } } : {}),
    },

    updates: { url: 'https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d' },

    extra: {
      eas: { projectId: '69982f4e-c195-48d6-923a-986f1b67cd1d' },
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },
  } as ExpoConfig);
};
