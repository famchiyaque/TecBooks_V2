import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

export default function ServicesTable({ services }) {
  const columns = useMemo(
    () => [
      {
        key: "category",
        label: "Expense Category",
        group: true,
        width: "9rem",
      },
      { key: "subcategory", label: "Subcategory", wrap: true, width: "9rem" },
      { key: "description", label: "Description", wrap: true },
      {
        key: "monthlyRange",
        label: "Est. Monthly Range",
        align: "right",
        type: "currency",
        width: "8rem",
      },
      { key: "notes", label: "Notes and Considerations", wrap: true },
    ],
    [],
  );

  return (
    <TableContainer
      title="Services"
      columns={columns}
      rows={services}
      emptyLabel="No services registered."
      layout="fixed"
      scrollBody
      className="h-full flex-1 min-w-0"
    />
  );
}
