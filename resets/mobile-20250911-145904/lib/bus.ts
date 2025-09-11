type Listener = () => void;

const topics: Record<string, Set<Listener>> = {};

export function subscribe(topic: string, fn: Listener) {
  topics[topic] = topics[topic] || new Set();
  topics[topic].add(fn);
  return () => topics[topic].delete(fn);
}

export function publish(topic: string) {
  const set = topics[topic];
  if (!set) return;
  set.forEach((fn) => { try { fn(); } catch {} });
}