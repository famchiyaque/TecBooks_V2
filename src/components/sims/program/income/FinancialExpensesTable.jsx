import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * FinancialExpensesTable component
 *
 * Renders total financial expenses per year.
 *
 * @param {number[]} totalFinancialExpenses - Array of total financial expenses, indexed by year offset.
 * @param {number} baseYear - The first year represented in the array.
 * @returns {JSX.Element} The rendered table.
 */
function FinancialExpensesTable({ totalFinancialExpenses, baseYear }) {
  const years = useMemo(
    () => (totalFinancialExpenses ?? []).map((_, i) => baseYear + i),
    [totalFinancialExpenses, baseYear],
  );

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
    const total = { concept: "Total Financial Expenses", rowVariant: "total" };

    years.forEach((year, i) => {
      total[String(year)] = totalFinancialExpenses?.[i];
    });

    return [total];
  }, [years, totalFinancialExpenses]);

  return (
    <TableContainer
      title="Total Financial Expenses"
      columns={columns}
      rows={rows}
    />
  );
}

export default FinancialExpensesTable;
