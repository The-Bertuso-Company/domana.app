export type TrackProps = Record<string, any> | undefined;

export function track(event: string, props?: TrackProps) {
  try {
    // swap this with your real analytics sink later
    // eslint-disable-next-line no-console
    console.log(`[track] ${event}`, props ?? {});
  } catch {}
}
