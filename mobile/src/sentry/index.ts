import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

const extra: any = (Constants as any).expoConfig?.extra ?? {};
const DSN = (process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || extra.sentryDsn || "").toString();

Sentry.init({
  dsn: DSN || undefined,
  enableInExpoDevelopment: true,      // capture errors in dev too
  debug: false,                        // flip to true if you want verbose logs
  tracesSampleRate: 0.1,               // light perf sampling for now
});
