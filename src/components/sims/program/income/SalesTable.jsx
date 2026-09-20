import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * RF-44: Sales estimate for the projection horizon.
 *
 * A derived table - it captures nothing. Each year composes three values
 * pulled from other modules, and only the last one belongs to this
 * requirement:
 *
 *   Customer Orders  <- demand module (projectPurchaseOrders: year 0 actual,
 *                       later years from annualized YTD × demandGrowth,
 *                       Premisas "Demanda anual" - Capacidad/installed
 *                       capacity is a separate, derived check, not a source)
 *   Unit Price       <- pricing module, RF-43 (projectSalesPrice, inflation)
 *
 *   Total Income     <- CO x Unit Price, the one value RF-44 computes
 *
 * The first year is a partial ramp-up, so its volume is lower than the
 * projection would suggest; that value is taken from the workbook as-is and
 * deliberately never scaled.
 *
 * Feeds the net sales row and the Income Statement through computeNetSales.
 * Manual editing of the estimate is RF-45 and is not handled here.
 */
export function buildSalesRows({ customerOrders, unitPrice, sales, years }) {
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
}
