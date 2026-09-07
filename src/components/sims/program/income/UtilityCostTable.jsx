import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * UtilityCostTable component
 *
 * Renders utility cost projections at different profit margin scenarios (10%, 20%, 30%).
 *
 * @param {Object} utilityCost - Object keyed by margin percentage ("10", "20", "30"), each an array by year.
 * @param {number} baseYear - The first year represented in the arrays.
 * @returns {JSX.Element} The rendered table.
 */
function UtilityCostTable({ utilityCost, baseYear }) {
  const margins = useMemo(
    () => Object.keys(utilityCost ?? {}).sort((a, b) => Number(a) - Number(b)),
    [utilityCost],
  );

  const years = useMemo(() => {
    const first = margins[0];
    return (utilityCost?.[first] ?? []).map((_, i) => baseYear + i);
  }, [utilityCost, margins, baseYear]);

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

  const rows = useMemo(
    () =>
      margins.map((margin) => {
        const row = { concept: `Utility at ${margin}%` };
        years.forEach((year, i) => {
          row[String(year)] = utilityCost?.[margin]?.[i];
        });
        return row;
      }),
    [margins, years, utilityCost],
  );

  return <TableContainer title="Utility Cost" columns={columns} rows={rows} />;
}

export default UtilityCostTable;
