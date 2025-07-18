import type { SalesRow, Filters } from "../types";

export function filterSalesRows(
  rows: SalesRow[],
  filters: Filters
): SalesRow[] {
  return rows.filter((row) => {
    const matchesSKU =
      !filters.sku || row.sku.toLowerCase().includes(filters.sku.toLowerCase());

    const rowDate = new Date(row.date);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    const matchesFrom = !from || rowDate >= from;
    const matchesTo = !to || rowDate <= to;

    return matchesSKU && matchesFrom && matchesTo;
  });
}
