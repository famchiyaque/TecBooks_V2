import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";
import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

function SalesTable({ sales, baseYear }) {
  const years = useMemo(
    () => (sales ?? []).map((_, i) => baseYear + i),
    [sales, baseYear],
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
    const row = {
      concept: "Sales",
      rowVariant: "total",
      tooltip: INFLOWS_TOOLTIPS.sales.sales,
    };

    years.forEach((year, i) => {
      row[String(year)] = sales?.[i];
    });

    return [row];
  }, [years, sales]);

  return (
    <TableContainer
      title="Sales"
      titleTooltip={INFLOWS_TOOLTIPS.sales.table}
      columns={columns}
      rows={rows}
    />
  );
}

export default SalesTable;
