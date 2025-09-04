export type TrackProps = Record<string, any> | undefined;
export function track(event: string, props?: TrackProps) {
  try { console.log(`[track] ${event}`, props ?? {}); } catch {}
}
