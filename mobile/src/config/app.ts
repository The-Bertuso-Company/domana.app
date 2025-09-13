/**
 * Runtime helpers to read Expo config extras safely and validate the deep-link scheme.
 * Works in dev & production without depending on type packages.
 */

export type AppExtra = {
  easChannel: string;
  apiBaseUrl: string;
  sentryDsn?: string;
};

// Use require so TypeScript doesn't need types for expo-constants.
function readConstants(): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Constants = require('expo-constants').default;
  return Constants;
}

/** Read merged extras (Expo extra takes precedence over build-time env). */
export function getExtra(): AppExtra {
  const Constants = readConstants();
  const fromExtra = (Constants?.expoConfig?.extra ?? {}) as Partial<AppExtra>;
  const fromEnv: Partial<AppExtra> = {
    easChannel: process.env.EAS_CHANNEL as any,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL as any,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN as any,
  };

  const merged = { ...fromEnv, ...fromExtra };
  return {
    easChannel: merged.easChannel ?? 'dev',
    apiBaseUrl: merged.apiBaseUrl ?? 'http://localhost:4000',
    sentryDsn: merged.sentryDsn ?? '',
  };
}

/** Ensure our expected scheme is present; warn if not. Returns the list of schemes. */
export function validateScheme(expected = 'domana'): string[] {
  const Constants = readConstants();
  const value = Constants?.expoConfig?.scheme;
  const schemes: string[] = Array.isArray(value) ? value : value ? [value] : [];

  if (!schemes.includes(expected)) {
    // eslint-disable-next-line no-console
    console.warn(
      `App config scheme mismatch: expected "${expected}" but got [${schemes.join(', ')}].`,
    );
  }
  return schemes;
}
