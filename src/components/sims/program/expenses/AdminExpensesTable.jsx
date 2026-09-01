import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * AdminExpensesTable
 * One row (Gastos Administrativos) spread across every year.
 *
 * Props:
 *  - years:    number[]                e.g. [2025, 2026, ...]
 *  - expenses: { [year]: number }      amount per year
 */
export default function AdminExpensesTable({ years, expenses }) {
  const columns = useMemo(
    () => [
      { key: "concept", label: "" },
      ...years.map((year) => ({
        key: String(year),
        label: String(year),
        align: "right",
        type: "currency",
      })),
    ],
    [years],
  );

  const rows = useMemo(() => {
    const row = { concept: "Administrative Expenses" };
    years.forEach((year) => {
      row[String(year)] = expenses?.[year];
    });
    return [row];
  }, [years, expenses]);

  return (
    <TableContainer
      title="Administrative Expenses"
      columns={columns}
      rows={rows}
    />
  );
}
