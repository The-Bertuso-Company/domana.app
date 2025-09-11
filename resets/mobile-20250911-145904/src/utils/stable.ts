export function roundNum(n: number, places = 5) {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

export function stableStringify(input: any): string {
  const seen = new WeakSet();
  const helper = (v: any): any => {
    if (v === null || typeof v !== "object") {
      if (typeof v === "number") return roundNum(v);
      return v;
    }
    if (seen.has(v)) return null;
    seen.add(v);
    if (Array.isArray(v)) return v.map(helper);
    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = helper(v[k]);
    return out;
  };
  return JSON.stringify(helper(input));
}

// djb2 hash -> short hex
export function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h = h | 0;
  }
  const hex = (h >>> 0).toString(16);
  return ("00000000" + hex).slice(-8);
}
