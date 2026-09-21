import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

export default function OutflowYearTable({
  title,
  titleTooltip,
  years,
  rows,
  emptyLabel,
}) {
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

  return (
    <TableContainer
      title={title}
      titleTooltip={titleTooltip}
      columns={columns}
      rows={rows}
      emptyLabel={emptyLabel}
    />
  );
}
