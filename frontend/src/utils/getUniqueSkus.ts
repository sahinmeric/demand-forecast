import type { SalesRow } from "../types";

export function getUniqueSkus(rows: SalesRow[]): string[] {
  const unique = new Set<string>();
  rows.forEach((r) => unique.add(r.sku));
  return Array.from(unique).sort();
}
