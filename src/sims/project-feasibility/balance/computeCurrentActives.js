import { computeCashBalanceByYear } from "@/sims/project-feasibility/costTable/cashFlowCalculations.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeCurrentActives");

function computeCurrentActives(project) {
  const years = project.timeline.years;
  // Real ending cash balance (Entradas - Salidas, chained from year zero
  // opening cash = premises.startingMoney).
  const { endingBalanceByYear } = computeCashBalanceByYear(project);
  const cashAndBank = years.reduce((acc, year) => {
    acc[year] = endingBalanceByYear[year] ?? 0;
    return acc;
  }, {});

  // TODO: Inventary, pending accounts, deposits, stocks - these are still a
  // placeholder, not real Excel-sourced data, so they can't flow through
  // feasibilityProjectCurrencyChange like everything else. Scale by the same
  // rate that conversion already applied to the rest of the model
  // (project.currencyRate, stamped there - defaults to 1, same currency)
  // so this mock stays at least numerically consistent after a currency switch.
  const rate = project.currencyRate ?? 1;
  const inventary = mockFills(years);
  const deposits = mockFills(years);
  const stocks = mockFills(years);
  stocks[years[0]] = 2000000 * rate;

  const total = years.reduce((acc, year) => {
    acc[year] = cashAndBank[year] + inventary[year] + deposits[year] + stocks[year];
    return acc;
  }, {});

  const result = { cashAndBank, inventary, deposits, stocks, total };
  logger.debug("computeCurrentActives", result);
  return result;
}

function mockFills(years) {
  return years.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});
}

export default computeCurrentActives;
