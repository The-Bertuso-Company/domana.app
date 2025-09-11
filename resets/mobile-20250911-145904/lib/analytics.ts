type EventProps = Record<string, string | number | boolean | undefined>;
export function track(event: string, props: EventProps = {}) {
  // Hook up your analytics SDK here (Segment/Firebase/Sentry breadcrumb).
  // This safe default avoids crashes if not configured yet.
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event}`, props);
  }
}
