const listeners = new Map<string, Set<(p?: any) => void>>();

export function on(event: string, fn: (p?: any) => void) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(fn);
  return () => off(event, fn);
}

export function off(event: string, fn: (p?: any) => void) {
  listeners.get(event)?.delete(fn);
}

export function emit(event: string, payload?: any) {
  listeners.get(event)?.forEach((fn) => {
    try { fn(payload); } catch {}
  });
}
