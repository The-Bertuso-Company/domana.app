import Constants from "expo-constants";
import * as Sentry from "sentry-expo";

const extra: any =
  (Constants as any)?.expoConfig?.extra ?? (Constants as any)?.manifestExtra ?? {};
const DSN: string | undefined = extra?.sentryDsn || extra?.SENTRY_DSN;

try {
  if (DSN) {
    Sentry.init({
      dsn: DSN,
      enableInExpoDevelopment: true,
      debug: __DEV__,
      tracesSampleRate: 0.05,
    });
  }
} catch (e) {
  console.warn("[monitoring] Sentry init skipped:", (e as Error)?.message);
}

export const captureError = (err: any, context?: any) => {
  try { if (DSN) { /* @ts-ignore */ return Sentry.Native.captureException(err, { extra: context }); } } catch {}
};
