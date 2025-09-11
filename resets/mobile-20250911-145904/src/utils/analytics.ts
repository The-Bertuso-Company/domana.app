let Sentry: any = null;
try { Sentry = require("sentry-expo"); } catch {}

type Props = Record<string, unknown> | undefined;

export function track(event: string, props?: Props) {
  const payload = { event, ...props, ts: new Date().toISOString() };
  try { console.log("[analytics]", payload); } catch {}
  try {
    // no-op if Sentry not initialized (safe)
    Sentry?.Native?.addBreadcrumb?.({
      category: "analytics",
      message: event,
      data: props ?? {},
      level: "info",
    });
  } catch {}
}
