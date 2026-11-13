/**
 * RF60 - Punto de Equilibrio, for the project's first year, mirroring
 * "Punto de Equilibrio" from Estado R (rows 49-60) in Template Financiero
 * IN3001B - computed from the same validated buildCostOfSales pipeline the
 * Cost Table/Profit Summary already use, instead of re-deriving from raw
 * cbm fields. Extracted out of BreakEvenSummary.jsx (identical formula) so
 * it's callable/testable without mounting the component.
 *
 * Fixed costs = Administrative Expenses + indirect/engineering salaries +
 * Credit Payment (the template's own row 51 pointed at the wrong cell -
 * Gastos Financieros instead of Gastos Administrativos - so this uses the
 * Administrative Expenses value already computed for the Income Statement,
 * which is what row 51's label actually means).
 * Variable cost/unit = material cost/unit + (direct labor / annual
 * capacity) - annual capacity, not year-zero's order volume, since a
 * ramp-up year's low order count would badly distort a per-unit labor cost
 * (matches the template's own Capacidad!E17 divisor, row 59).
 *
 * @param {Object} row - costOfSalesByYear's first row (year zero)
 * @param {Object} production - cbmToCostTableInputs(cbm).production
 * @param {number} desiredProfit
 * @returns {{fixedCosts:number, variableCostPerUnit:number, salePrice:number,
 *   contributionMargin:number, breakEvenUnits:number|null, breakEvenRevenue:number|null,
 *   unitsForProfit:number|null, revenueForProfit:number|null}}
 *   contributionMargin <= 0 -> the 4 *Units/*Revenue fields are null (no
 *   break-even point exists, matches BreakEvenSummary.jsx's own warning path).
 */
export function computeBreakEven(row, production, desiredProfit) {
  const annualCapacity =
    Object.values(production.purchaseOrders)[0] /
      Object.values(production.qualityYield)[0] || 0;

  const costPerUnit = Object.values(production.materialCostPerUnit)[0];
  const salePrice = production.salesPricePerUnit?.[row.year] || 0;

  const salaries =
    row.engineeringSalaries +
    row.administrativeSalary +
    row.indirectManufacturing;

  const creditPayment = row.creditPayment + row.financialExpenses;

  const fixedCosts = row.administrativeExpenses + salaries + creditPayment;

  const variableCostPerUnit =
    (costPerUnit || 0) +
    (annualCapacity > 0 ? row.directLabour / annualCapacity : 0);
  const contributionMargin = salePrice - variableCostPerUnit;

  if (contributionMargin <= 0) {
    return {
      fixedCosts,
      variableCostPerUnit,
      salePrice,
      contributionMargin,
      breakEvenUnits: null,
      breakEvenRevenue: null,
      unitsForProfit: null,
      revenueForProfit: null,
    };
  }

  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * salePrice;
  const unitsForProfit = (fixedCosts + desiredProfit) / contributionMargin;
  const revenueForProfit = unitsForProfit * salePrice;

  return {
    fixedCosts,
    variableCostPerUnit,
    salePrice,
    contributionMargin,
    breakEvenUnits,
    breakEvenRevenue,
    unitsForProfit,
    revenueForProfit,
  };
}

/**
 * RF61 - Tabla de unidades vendidas (the break-even chart's own data
 * series): Cost = fixedCosts + variableCostPerUnit * units, Sales =
 * salePrice * units, from 0 out to 2x break-even so the crossover sits near
 * the middle of the chart, same as the reference. Extracted out of
 * BreakEvenChart.jsx (identical formula) so it's callable/testable without
 * mounting the component - never surfaced as its own table in the UI (RF61
 * deliberately left out, see BreakEvenChart.jsx's RF-62), but the data
 * itself is real.
 */
export function buildBreakEvenSeries({ fixedCosts, variableCostPerUnit, salePrice, breakEvenUnits }) {
  const maxUnits = Math.max(breakEvenUnits * 2, 1);
  const steps = 30;
  const stepSize = maxUnits / steps;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const units = Math.round(i * stepSize);
    return {
      units,
      Cost: fixedCosts + variableCostPerUnit * units,
      Sales: salePrice * units,
    };
  });
}
