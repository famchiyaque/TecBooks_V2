import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * InvestmentTable
 * List of investment concepts + amounts, with an auto-computed Total row.
 *
 * Props:
 *  - items: { concepto: string, monto: number }[]
 */
export default function InvestmentTable({ items }) {
  const columns = useMemo(
    () => [
      { key: "concepto", label: "Concepto" },
      { key: "monto", label: "Monto", align: "right", type: "currency" },
    ],
    [],
  );

  const rows = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + (Number(item.monto) || 0),
      0,
    );
    return [...items, { concepto: "Total", monto: total, rowVariant: "total" }];
  }, [items]);

  return (
    <TableContainer
      title="Inversión"
      columns={columns}
      rows={rows}
      className="max-w-xl"
    />
  );
}
