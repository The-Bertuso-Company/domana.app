import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const VERSION = '0.0.1';
  const APP_ID = 'com.domana.app';
  const SCHEME = 'domana';

  // Build-time / public envs
  const EAS_CHANNEL = process.env.EAS_CHANNEL ?? 'dev';
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

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
      buildNumber: process.env.IOS_BUILD_NUMBER ?? '1',
    },

    android: {
      package: APP_ID,
      versionCode: Number(process.env.ANDROID_VERSION_CODE ?? 1),
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },

    extra: {
      easChannel: EAS_CHANNEL,
      apiBaseUrl: API_BASE_URL,
      sentryDsn: SENTRY_DSN,
    },

    // Keep updates stable across EAS channels using app version for runtime separation
    runtimeVersion: { policy: 'appVersion' },

    // NOTE: We'll add updates.url after we link EAS in Step 49.
  };
};
