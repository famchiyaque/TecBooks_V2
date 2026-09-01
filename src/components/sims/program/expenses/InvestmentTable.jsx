import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * InvestmentTable
 * List of investment concepts + amounts, with an auto-computed Total row.
 *
 * Props:
 *  - items: { concept: string, amount: number }[]
 */
export default function InvestmentTable({ items }) {
  const columns = useMemo(
    () => [
      { key: "concept", label: "Categoría" },
      { key: "amount", label: "Costo", align: "right", type: "currency" },
    ],
    [],
  );

  const rows = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    return [...items, { concept: "Total", amount: total, rowVariant: "total" }];
  }, [items]);

  return (
    <>
      {items && (
        <TableContainer
          title="Inversión"
          columns={columns}
          rows={rows}
          className="max-w-xl"
        />
      )}
    </>
  );
}
