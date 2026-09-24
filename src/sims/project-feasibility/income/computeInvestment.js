import { computeAdminExpenses } from "@/utils/dashboard/costCalculations";
import { sumSalariesByCategory } from "@/utils/dashboard/costCalculations";
import { sumAssetsAcquisitionCost } from "@/utils/dashboard/assetSchedule.js";
import {
  cbmToCostTableInputs,
  cbmToOperatingExpenseInputs,
} from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";
import { Logger } from "../utils/logger.js";

const logger = new Logger("ComputeInvestment");

/**
 * Calculates interest payments and capital investment breakdown for a project.
 *
 * Aggregates initial capital expenditures across physical assets (machines, transport, etc.),
 * computes associated civil work, and sums baseline workforce and administrative expenses.
 *
 * @param {Object} project - The primary project configuration object containing model inputs.
 * @returns {{
 *   investment: Object<string, number>,
 *   total: number
 * }} An object containing:
 *   - `investment`: Itemized breakdown of initial costs by category (assets, civil work, employee expenses).
 *   - `total`: Total initial capital investment required across all categories.
 */
export default function computeInvestment(project) {
  const { employees, production } = cbmToCostTableInputs(project);
  const years = Object.keys(production.purchaseOrders ?? {}).map(Number);

  const { assets, machines } = cbmToOperatingExpenseInputs(project, years);
  const assetCosts = calculateTotalAssetCost(assets, machines, years);

  const adminExpenses = computeAdminExpenses(project);
  const workforceExpenses = sumSalariesByCategory(employees);

  const civilWork = assetCosts.machines * 0.35;
  const totalAssetCosts = Object.values(assetCosts).reduce(
    (acc, curr) => acc + curr,
    0,
  );
  // BUG FIX: computeAdminExpenses returns a MONTHLY total (services sum ×
  // inflation, never ×12 - see computeProductionCosts.js's own comment on
  // this) - every other consumer annualizes it locally (toCostPerWorkOrder
  // does `* 12` explicitly), this one didn't, so Working Capital undercounted
  // services by ~11/12 of a year.
  const employeeExpenses =
    Object.values(adminExpenses)[0] * 12 +
    Object.values(workforceExpenses).reduce((acc, curr) => acc + curr, 0);

  const investment = {
    ...assetCosts,
    employeeExpenses,
    civilWork,
  };
  const total = civilWork + totalAssetCosts + employeeExpenses;
  logger.debug("computeInvestment", { assetCosts, adminExpenses, workforceExpenses, civilWork, investment, total });
  return { investment, total };
}

/**
 * Computes the initial acquisition cost for all asset categories and machines.
 *
 * For each asset item, it extracts the one-time cost from its acquisition
 * year (assetAcquisitionCost, via assetSchedule.js) and sums them by category -
 * the single shared implementation every other RF-55/RF-56/RF-63 consumer
 * of acquisitionByYear also goes through.
 *
 * @param {Object<string, Array<{acquisitionByYear: Object<string|number, number>}>>} assets
 *   An object where keys are asset categories (e.g., 'transport', 'buildings')
 *   and values are arrays of asset items with yearly acquisition schedules.
 * @param {Array<{acquisitionByYear: Object<string|number, number>}>} machines
 *   An array of machine items with yearly acquisition schedules.
 * @param {Array<number>} years - Years, in order, used to find each asset's
 *   acquisition year (its first non-zero entry).
 *
 * @returns {Object<string, number>} An object mapping each category (including 'machines')
 *   to its aggregated initial cost.
 *   Example: `{ transport: 300000, compute: 7500, machines: 5200000 }`
 */
function calculateTotalAssetCost(assets, machines, years) {
  const result = {};

  if (assets && typeof assets === "object") {
    Object.entries(assets).forEach(([category, items]) => {
      result[category] = sumAssetsAcquisitionCost(items, years);
    });
  }

  if (machines) {
    result.machines = sumAssetsAcquisitionCost(machines, years);
  }

  return result;
}
