import { computeCashBalanceByYear } from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";

function computeCurrentActives(project) {
  const years = project.timeline.years;
  // Real ending cash balance (Entradas - Salidas, chained from year zero),
  // same math the Cash Flow tab uses - not computeFlow.js's buggy carry
  // forward (hardcoded balance, "next year's balance = this year's total
  // expenses" instead of a real running total).
  const { endingBalanceByYear } = computeCashBalanceByYear(project);
  const cashAndBank = years.reduce((acc, year) => {
    acc[year] = endingBalanceByYear[year] ?? 0;
    return acc;
  }, {});

  // TODO: Inventary, pending accounts, deposits, stocks
  const inventary = mockFills(years);
  const deposits = mockFills(years);
  const stocks = mockFills(years);
  stocks[years[0]] = 2000000;

  const total = years.reduce((acc, year) => {
    acc[year] = cashAndBank[year] + inventary[year] + deposits[year] + stocks[year];
    return acc;
  }, {});

  return {
    cashAndBank,
    inventary,
    deposits,
    stocks,
    total,
  };
}

function mockFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default computeCurrentActives;
