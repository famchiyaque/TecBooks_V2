/**
 * RF73 - Capital Contable. "Legacy" is the balancing plug: Total Assets -
 * Total Liabilities - this period's/accumulated utility. Extracted out of
 * Equity.jsx (identical formula) so it's callable/testable without
 * mounting the component - Equity.jsx just calls this now.
 *
 * @param {Object<number, {totalActives:number, totalPassives:number, netIncome:number}>} totalsByYear
 * @param {number[]} years
 */
export function computeEquity(totalsByYear, years) {
  const periodUtility = {};
  years.forEach((year) => {
    periodUtility[year] = totalsByYear[year].netIncome;
  });

  const acumUtility = {};
  years.forEach((year, idx) => {
    acumUtility[year] = idx === 0 ? 0 : periodUtility[years[idx - 1]] + periodUtility[year];
  });

  const legacy = {};
  years.forEach((year) => {
    const { totalActives, totalPassives } = totalsByYear[year];
    legacy[year] = totalActives - totalPassives - periodUtility[year] - acumUtility[year];
  });

  return { legacy, periodUtility, acumUtility };
}
