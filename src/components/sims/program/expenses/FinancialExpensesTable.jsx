import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * FinancialExpensesTable
 * Several concepts (Amortization, Accrued Interest, ...) spread across
 * every year.
 *
 * Props:
 *  - years: number[]
 *  - items: { concept: string, values: { [year]: number } }[]
 */
export default function FinancialExpensesTable({ years, items }) {
  const columns = useMemo(
    () => [
      { key: "concept", label: "concept" },
      ...years.map((year) => ({
        key: String(year),
        label: String(year),
        align: "right",
        type: "currency",
      })),
    ],
    [years],
  );

  const rows = useMemo(
    () =>
      items.map((item) => {
        const row = { concept: item.concept };
        years.forEach((year) => {
          row[String(year)] = item.values?.[year];
        });
        return row;
      }),
    [years, items],
  );

  return (
    <TableContainer title="Financial Expenses" columns={columns} rows={rows} />
  );
}
