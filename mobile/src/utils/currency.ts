export function peso(n?: number) {
  if (typeof n !== "number") return "";
  return "₱" + n.toLocaleString();
}
