import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";
import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * RF-44: Sales estimate for the projection horizon.
 *
 * A derived table - it captures nothing. Each year composes three values
 * pulled from other modules, and only the last one belongs to this
 * requirement:
 *
 *   Customer Orders  <- demand/capacity module (projectPurchaseOrders)
 *   Unit Price       <- pricing module, RF-43 (projectSalesPrice)
 *   Total Income     <- CO x Unit Price, the one value RF-44 computes
 *
 * The first year is a partial ramp-up, so its volume is lower than the
 * projection would suggest; that value is taken from the workbook as-is and
 * deliberately never scaled.
 *
 * Feeds the net sales row and the Income Statement through computeNetSales.
 * Manual editing of the estimate is RF-45 and is not handled here.
 *
 * @param {number[]} customerOrders - Projected CO, indexed by year offset.
 * @param {number[]} unitPrice - Unit sale price per year, same indexing.
 * @param {number[]} sales - Total income per year, same indexing.
 * @param {number} baseYear - The first year represented in the arrays.
 */
function SalesTable({ customerOrders, unitPrice, sales, baseYear }) {
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
    const buildRow = (concept, values, extra = {}) => {
      const row = { concept, ...extra };
      years.forEach((year, i) => {
        row[String(year)] = values?.[i];
      });
      return row;
    };

    return [
      // Unit counts, not money - valueType overrides the columns' currency type.
      buildRow("Customer Orders", customerOrders, {
        valueType: "units",
        tooltip: INFLOWS_TOOLTIPS.sales.customerOrders,
      }),
      buildRow("Unit Price", unitPrice, {
        tooltip: INFLOWS_TOOLTIPS.sales.unitPrice,
      }),
      buildRow("Total Income", sales, {
        rowVariant: "total",
        tooltip: INFLOWS_TOOLTIPS.sales.sales,
      }),
    ];
  }, [years, customerOrders, unitPrice, sales]);

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
