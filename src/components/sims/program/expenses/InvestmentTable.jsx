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
  console.log(items);
  const columns = useMemo(
    () => [
      { key: "concept", label: "Category" },
      { key: "amount", label: "Cost", align: "right", type: "currency" },
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
          title="Investment"
          columns={columns}
          rows={rows}
          className="max-w-xl"
        />
      )}
    </>
  );
}
