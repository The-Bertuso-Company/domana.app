/* src/utils/format.ts */
export const peso = (n: number) =>
  "₱" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const sqm = (n: number) => `${n} m²`;
