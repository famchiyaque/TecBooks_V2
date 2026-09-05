import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * CompetitivePriceTable component
 *
 * Renders the projected competitive price per year.
 *
 * @param {number[]} competitivaPrice - Array of competitive prices, indexed by year offset.
 * @param {number} baseYear - The first year represented in the array.
 * @returns {JSX.Element} The rendered table.
 */
function CompetitivePriceTable({ competitivaPrice, baseYear }) {
  const years = useMemo(
    () => (competitivaPrice ?? []).map((_, i) => baseYear + i),
    [competitivaPrice, baseYear],
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
    const price = { concept: "Competitive Price" };

    years.forEach((year, i) => {
      price[String(year)] = competitivaPrice?.[i];
    });

    return [price];
  }, [years, competitivaPrice]);

  return (
    <TableContainer title="Competitive Price" columns={columns} rows={rows} />
  );
}

export default CompetitivePriceTable;
