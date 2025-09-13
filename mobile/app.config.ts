import { ConfigContext, ExpoConfig } from 'expo/config';
import { withSettingsGradle } from '@expo/config-plugins';

const withExpoModulesIncludeBuild = (config: any) =>
  withSettingsGradle(config, (cfg) => {
    let contents: string = cfg.modResults.contents;

    if (
      contents.includes('expo-modules-core/package.json') ||
      contents.includes('expo-modules-core/android')
    ) {
      return cfg;
    }

    const includeLine = `  includeBuild(new File(["node", "--print", "require.resolve('expo-modules-core/package.json')"].execute(null, rootDir).text.trim(), "../android"))`;

    if (/includeBuild\(.+@react-native\/gradle-plugin.+\)/.test(contents)) {
      contents = contents.replace(
        /(includeBuild\(.+@react-native\/gradle-plugin.+\)\s*\r?\n)/,
        `$1${includeLine}\n`,
      );
    } else {
      contents = contents.replace(/pluginManagement\s*\{/, (m) => `${m}\n${includeLine}\n`);
    }

    if (!/pluginManagement[\s\S]*repositories\s*\{/.test(contents)) {
      const reposBlock = `
  repositories {
    gradlePluginPortal()
    google()
    mavenCentral()
  }`;
      contents = contents.replace(/pluginManagement\s*\{/, (m) => `${m}\n${reposBlock}\n`);
    }

    cfg.modResults.contents = contents;
    return cfg;
  });

function parseSemver(v: string) {
  const [major, minor, patch] = v.split('.').map((x) => Number(x || 0));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}
function toAndroidVersionCode(semver: string): number {
  const { major, minor, patch } = parseSemver(semver);
  const code = major * 10000 + minor * 100 + patch;
  return Math.max(1, code);
}

export default ({ config }: ConfigContext): ExpoConfig => {
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

  return withExpoModulesIncludeBuild({
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
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      ...(ANDROID_MAPS_KEY ? { config: { googleMaps: { apiKey: ANDROID_MAPS_KEY } } } : {}),
    },

    updates: { url: 'https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d' },

    // ✅ This line fixes the prebuild error
    runtimeVersion: { policy: 'appVersion' },

    extra: {
      eas: { projectId: '69982f4e-c195-48d6-923a-986f1b67cd1d' },
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },
  } as ExpoConfig);
};
