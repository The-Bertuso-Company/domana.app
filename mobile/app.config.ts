import { ConfigContext, ExpoConfig } from 'expo/config';

function parseSemver(v: string) {
  const [major, minor, patch] = v.split('.').map((x) => Number(x || 0));
  return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}

/** versionCode = major*10000 + minor*100 + patch (e.g., 1.2.3 => 10203) */
function toAndroidVersionCode(semver: string): number {
  const { major, minor, patch } = parseSemver(semver);
  const code = major * 10000 + minor * 100 + patch;
  return Math.max(1, code); // must be >= 1
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const VERSION = '0.0.1';
  const APP_ID = 'com.domana.app';
  const SCHEME = 'domana';

  // Build-time / public envs
  const EAS_CHANNEL = process.env.EAS_CHANNEL ?? 'dev';
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

  // Versioning (env overrides take precedence)
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

    ios: {
      supportsTablet: true,
      bundleIdentifier: APP_ID,
      buildNumber: IOS_BUILD_NUMBER,
    },

    android: {
      package: APP_ID,
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },

    // OTA updates host for this EAS project
    updates: {
      url: 'https://u.expo.dev/69982f4e-c195-48d6-923a-986f1b67cd1d',
    },

    extra: {
      eas: { projectId: '69982f4e-c195-48d6-923a-986f1b67cd1d' },
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },

    // Keep updates stable across EAS channels using app version for runtime separation
    runtimeVersion: { policy: 'appVersion' },
  };
};
