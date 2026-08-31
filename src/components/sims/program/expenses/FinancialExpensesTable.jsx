import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * FinancialExpensesTable
 * Several concepts (Amortización, Interés devengado, ...) spread across
 * every year.
 *
 * Props:
 *  - years: number[]
 *  - items: { concepto: string, values: { [year]: number } }[]
 */
export default function FinancialExpensesTable({ years, items }) {
  const columns = useMemo(
    () => [
      { key: "concepto", label: "Concepto" },
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
        const row = { concepto: item.concepto };
        years.forEach((year) => {
          row[String(year)] = item.values?.[year];
        });
        return row;
      }),
    [years, items],
  );

  return (
    <TableContainer title="Gastos Financieros" columns={columns} rows={rows} />
  );
}
