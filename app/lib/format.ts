export const formatNGN = (n: number | string) =>
  `₦${Number(n).toLocaleString("en-NG")}`;
export const formatUSD = (n: number | string) =>
  `$${Number(n).toLocaleString("en-US")}`;
