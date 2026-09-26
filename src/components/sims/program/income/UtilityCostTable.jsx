import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";
import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * Unit Profit Margen table.
 *
 * Suggested selling prices at 10%, 20%, and 30% profit margin on price
 * (unit cost / (1 − margin)).
 *
 * @param {Object} utilityCost - Object keyed by margin percentage ("10", "20", "30"), each an array by year.
 * @param {number} baseYear - The first year represented in the arrays.
 * @returns {JSX.Element} The rendered table.
 */
function UtilityCostTable({ utilityCost, baseYear, currency }) {
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
        const row = {
          concept: `${margin}% margen`,
          tooltip: INFLOWS_TOOLTIPS.utilityPrice[margin],
        };
        years.forEach((year, i) => {
          row[String(year)] = utilityCost?.[margin]?.[i];
        });
        return row;
      }),
    [margins, years, utilityCost],
  );

  return (
    <TableContainer
      title="Unit Profit Margen"
      titleTooltip={INFLOWS_TOOLTIPS.utilityPrice.table}
      columns={columns}
      rows={rows}
      currency={currency}
    />
  );
}

export default UtilityCostTable;
