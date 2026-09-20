import { INFLOWS_TOOLTIPS } from "./inflowsTooltips";

/**
 * Unit-price rows for the Inflows joined table.
 * Values are indexed by year offset, same order as `years`.
 */
export function buildCompetitivePriceRows(competitivaPrice, years) {
  const price = {
    concept: "Competitive Price",
    tooltip: INFLOWS_TOOLTIPS.unitPrice.competitivePrice,
  };

  years.forEach((year, i) => {
    price[String(year)] = competitivaPrice?.[i];
  });

  return [price];
}
