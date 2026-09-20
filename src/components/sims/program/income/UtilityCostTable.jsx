import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * Suggested selling prices at 10%, 20%, and 30% profit margin on price
 * (unit cost / (1 − margin)).
 */
export function buildUtilityCostRows(utilityCost, years) {
  const margins = Object.keys(utilityCost ?? {}).sort(
    (a, b) => Number(a) - Number(b),
  );

  return margins.map((margin) => {
    const row = {
      concept: `${margin}% margen`,
      tooltip: INFLOWS_TOOLTIPS.utilityPrice[margin],
    };
    years.forEach((year, i) => {
      row[String(year)] = utilityCost?.[margin]?.[i];
    });
    return row;
  });
}
