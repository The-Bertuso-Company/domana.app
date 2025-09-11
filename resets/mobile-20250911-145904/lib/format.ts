export function formatMoney(value: number, currency = process.env.EXPO_PUBLIC_CURRENCY || "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
}

export function formatNumber(n?: number) {
  if (n == null) return "—";
  return new Intl.NumberFormat().format(n);
}

export function metaRow(beds?: number, baths?: number, sqft?: number) {
  const bits = [];
  if (beds != null) bits.push(`${beds} bd`);
  if (baths != null) bits.push(`${baths} ba`);
  if (sqft != null) bits.push(`${formatNumber(sqft)} sqft`);
  return bits.join(" • ");
}
