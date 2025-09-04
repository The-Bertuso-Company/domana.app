export type Queryish = Record<string, string | number | boolean | undefined>;

const WEB_BASE = (process.env.EXPO_PUBLIC_WEB_BASE_URL || "").replace(/\/+$/, "");
const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME || "domana";

function encodeQuery(q?: Queryish) {
  const p = new URLSearchParams();
  if (!q) return "";
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined) return;
    p.append(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function buildListingUrl(id: string, q?: Queryish, preferWeb = true) {
  const baseQuery: Queryish = {
    ...q,
    utm_source: q?.utm_source ?? "app",
    utm_medium: q?.utm_medium ?? "share",
    utm_campaign: q?.utm_campaign ?? "listing",
    ref: q?.ref ?? "share",
  };
  const query = encodeQuery(baseQuery);
  if (preferWeb && WEB_BASE) return `${WEB_BASE}/listing/${encodeURIComponent(id)}${query}`;
  return `${APP_SCHEME}://listing/${encodeURIComponent(id)}${query}`;
}

// Convenience: open or copy formatting lives in ShareButton.