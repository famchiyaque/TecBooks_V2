import { computeAdminExpenses } from "@/utils/dashboard/costCalculations";
import { sumSalariesByCategory } from "@/utils/dashboard/costCalculations";
import {
  cbmToCostTableInputs,
  cbmToOperatingExpenseInputs,
} from "@/sims/project-feasibility/costTable/cbmToCostTableInputs";

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
  const years = Object.keys(production.purchaseOrders).map(Number);

  const { assets, machines } = cbmToOperatingExpenseInputs(project, years);
  const assetCosts = calculateTotalAssetCost(assets, machines);

  const adminExpenses = computeAdminExpenses(project);
  const workforceExpenses = sumSalariesByCategory(employees);

  const civilWork = assetCosts.machines * 0.35;
  const totalAssetCosts = Object.values(assetCosts).reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const employeeExpenses =
    Object.values(adminExpenses)[0] +
    Object.values(workforceExpenses).reduce((acc, curr) => acc + curr, 0);

  const investment = {
    ...assetCosts,
    employeeExpenses,
    civilWork,
  };
  const total = civilWork + totalAssetCosts + employeeExpenses;
  return { investment, total };
}

/**
 * Computes the initial acquisition cost for all asset categories and machines.
 *
 * For each asset item, it extracts the first non-zero annual cost (representing
 * the initial purchase value) and sums them by asset category.
 *
 * @param {Object<string, Array<{acquisitionByYear: Object<string|number, number>}>>} assets
 *   An object where keys are asset categories (e.g., 'transport', 'buildings')
 *   and values are arrays of asset items with yearly acquisition schedules.
 * @param {Array<{acquisitionByYear: Object<string|number, number>}>} machines
 *   An array of machine items with yearly acquisition schedules.
 *
 * @returns {Object<string, number>} An object mapping each category (including 'machines')
 *   to its aggregated initial cost.
 *   Example: `{ transport: 300000, compute: 7500, machines: 5200000 }`
 */
function calculateTotalAssetCost(assets, machines) {
  const result = {};

  /**
   * Helper: Finds the first non-zero value in a chronological yearly schedule.
   *
   * @param {Object<string|number, number>} acquisitionByYear - Map of years to cost values.
   * @returns {number} The first positive acquisition cost encountered, or 0.
   */
  const getFirstNonZeroCost = (acquisitionByYear) => {
    if (!acquisitionByYear) return 0;

    const sortedYears = Object.keys(acquisitionByYear).sort(
      (a, b) => Number(a) - Number(b),
    );

    for (const year of sortedYears) {
      const cost = Number(acquisitionByYear[year]) || 0;
      if (cost > 0) return cost;
    }
    return 0;
  };

  /**
   * Helper: Sums the initial costs of all items in an array.
   *
   * @param {Array<{acquisitionByYear: Object}>} [itemsArray=[]] - Array of asset records.
   * @returns {number} Total initial cost of all items in the array.
   */
  const sumAssetArray = (itemsArray = []) => {
    if (!Array.isArray(itemsArray)) return 0;
    return itemsArray.reduce(
      (sum, item) => sum + getFirstNonZeroCost(item?.acquisitionByYear),
      0,
    );
  };

  if (assets && typeof assets === "object") {
    Object.entries(assets).forEach(([category, items]) => {
      result[category] = sumAssetArray(items);
    });
  }

  if (machines) {
    result.machines = sumAssetArray(machines);
  }

  return result;
}
