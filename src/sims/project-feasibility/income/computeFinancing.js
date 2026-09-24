import {
  computeCumulativeInvestment,
  computeFinancingAmount,
  computeAmortizationSchedule,
  sumSalariesByCategory,
} from "@/utils/dashboard/costCalculations";
import { computeAdminExpenses } from "@/utils/dashboard/computeAdminExpenses.js";
import {
  cbmToCostTableInputs,
  cbmToOperatingExpenseInputs,
} from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeFinancing");

/**
 * RF-56 loan financing, shared by the Income Statement (Cost Table /
 * Profit Summary) and the Balance Sheet long-term passives (Ratios /
 * Equity) so both read the SAME principal and amortization schedule
 * instead of drifting apart.
 *
 * One loan, originated once at project year zero (Egresos!B215), sized as:
 *   financingAmount = assets + workForce + civilWorks
 * where assets = machinery + (buildings + transport + compute) year-zero
 * acquisitions, workForce = administrative expenses + total salaries.
 *
 * Straight-line amortization over `financingPeriods` months (RF-56):
 * each month repays an equal slice of principal and interest accrues on
 * the declining balance at the year-zero national leading rate, split
 * into consecutive 12-month blocks against `years`, as computeAmortizationSchedule.
 *
 * @param {Object} cbm - canonical business model
 * @param {number[]} years - projection years, in order (schedule blocks map onto them)
 * @returns {{
 *   financingAmount: number,
 *   financialExpensesByYear: Object<number, number>,
 *   creditPaymentByYear: Object<number, number>,
 *   pendingPrincipalByYear: Object<number, number|null>,
 *   civilWorks: Object<number, number>,
 * }} pendingPrincipalByYear[year] = principal still owed after that year's
 *   payments (null never occurs under RF-56 - the loan reaches exactly 0).
 */
function computeFinancing(cbm, years) {
  const { employees } = cbmToCostTableInputs(cbm);
  const opex = cbmToOperatingExpenseInputs(cbm, years);

  const { MOD, MOIndirecta, Ingenieria, Administrative } = sumSalariesByCategory(employees);
  const salariesTotal = MOD + MOIndirecta + Ingenieria + Administrative;

  const administrativeExpenses = computeAdminExpenses(cbm);
  const investment = computeCumulativeInvestment(
    [opex.assets.buildings, opex.assets.transport, opex.assets.compute],
    years,
  );
  const machineryInvestment = computeCumulativeInvestment([opex.machines], years);

  let prev = 0;
  const civilWorks = Object.entries(machineryInvestment).reduce((acc, [year, value], idx) => {
    if (idx == 0) acc[year] = value * 0.35;
    else acc[year] = (value - prev) * 0.35;
    prev = Math.max(value, prev);
    return acc;
  }, {});

  const financingAmount = computeFinancingAmount(
    investment,
    salariesTotal,
    administrativeExpenses,
    machineryInvestment,
    civilWorks,
    years[0],
  );

  const { financialExpensesByYear, creditPaymentByYear } = computeAmortizationSchedule(
    financingAmount,
    opex.financingPeriods,
    opex.nationalLeadingRate[years[0]],
    years,
  );

  let paid = 0;
  const pendingPrincipalByYear = {};
  years.forEach((year) => {
    paid += creditPaymentByYear[year] || 0;
    const pending = financingAmount - paid;
    pendingPrincipalByYear[year] = pending >= 0 ? pending : null;
  });

  const result = {
    financingAmount,
    financialExpensesByYear,
    creditPaymentByYear,
    pendingPrincipalByYear,
    civilWorks,
  };
  logger.debug("computeFinancing", result);
  return result;
}

export default computeFinancing;