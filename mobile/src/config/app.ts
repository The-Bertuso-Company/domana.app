import Constants from 'expo-constants';

export type AppExtra = {
  easChannel: string;
  apiBaseUrl: string;
  sentryDsn?: string;
};

function envString(name: string, fallback = ''): string {
  const v = (globalThis as any)?.process?.env?.[name];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

/** Read merged extras (Expo extra takes precedence over build-time env). */
export function getExtra(): AppExtra {
  const fromExtra = (Constants?.expoConfig?.extra ?? {}) as Partial<AppExtra>;

  return {
    easChannel: fromExtra.easChannel ?? envString('EAS_CHANNEL', 'dev'),
    apiBaseUrl:
      fromExtra.apiBaseUrl ?? envString('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:4000'),
    sentryDsn: fromExtra.sentryDsn ?? envString('EXPO_PUBLIC_SENTRY_DSN', ''),
  };
}

/** Ensure our expected scheme is present; warn if not. Returns the list of schemes. */
export function validateScheme(expected = 'domana'): string[] {
  const value = (Constants as any)?.expoConfig?.scheme;
  const schemes: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const warn: (...args: any[]) => void = ((globalThis as any)?.console?.warn as any) ?? (() => {});

  if (!schemes.includes(expected)) {
    warn(`App config scheme mismatch: expected "${expected}" but got [${schemes.join(', ')}].`);
  }
  return schemes;
}
