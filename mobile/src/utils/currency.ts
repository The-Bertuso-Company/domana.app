export const formatPHP = (n:number) =>
  `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
