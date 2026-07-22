/**
 * Evaluations Engine
 * 
 * Computes final values from derived values.
 * Final values are the ones actually used in financial statements, project metrics, and UI.
 */

import { sanitizeNumber } from '@/utils/number.utils.js';

/**
 * Calculate revenue from demand and BOM pricing
 * @param {Array} demandDerived - Derived demand data with purchaseOrders arrays
 * @param {Array} bomsDerived - Derived BOM data with salesPrice arrays
 * @param {Array} periods - Array of period numbers [1, 2, 3, ...]
 * @returns {Object} {productsAndServices: {}, totals: []}
 */
export function calculateRevenueFromDemandAndBOMs(demandDerived, bomsDerived, periods) {
  const productsAndServices = {};
  const totals = [];

  // Initialize totals array
  const totalMonths = periods.length;
  for (let i = 0; i < totalMonths; i++) {
    totals.push(0);
  }

  // If we have both demand and BOMs, calculate revenue per product
  if (demandDerived.length > 0 && bomsDerived.length > 0) {
    // For now, assume single product matching
    const demand = demandDerived[0];
    const bom = bomsDerived[0];

    const productRevenue = [];
    for (let month = 0; month < totalMonths; month++) {
      const orders = sanitizeNumber(demand.purchaseOrders[month] || 0);
      const price = sanitizeNumber(bom.salesPrice[month] || 0);
      const revenue = orders * price;
      productRevenue.push(revenue);
      totals[month] += revenue;
    }

    productsAndServices[bom.name] = productRevenue;
  }

  // Handle multiple products if available
  for (let i = 1; i < Math.min(demandDerived.length, bomsDerived.length); i++) {
    const demand = demandDerived[i];
    const bom = bomsDerived[i];
    const productRevenue = [];

    for (let month = 0; month < totalMonths; month++) {
      const orders = sanitizeNumber(demand.purchaseOrders[month] || 0);
      const price = sanitizeNumber(bom.salesPrice[month] || 0);
      const revenue = orders * price;
      productRevenue.push(revenue);
      totals[month] += revenue;
    }

    productsAndServices[bom.name] = productRevenue;
  }

  return {
    productsAndServices,
    totals,
  };
}

/**
 * Calculate costs from derived values
 * @param {Array} bomsDerived - Derived BOM data
 * @param {Array} demandDerived - Derived demand data
 * @param {Object} workforceDerived - Derived workforce salaries
 * @param {Array} assetsDerived - Derived assets depreciation (optional)
 * @param {Array} periods - Array of period numbers
 * @returns {Object} {salaries: {}, fixedCosts: {}, variableCosts: {}, totals: []}
 */
export function calculateCostsFromDerivedValues(bomsDerived, demandDerived, workforceDerived, assetsDerived, periods) {
  const salaries = {};
  const fixedCosts = {};
  const variableCosts = {};
  const totals = [];

  const totalMonths = periods.length;

  // Initialize totals
  for (let i = 0; i < totalMonths; i++) {
    totals.push(0);
  }

  // Direct and indirect labor salaries (these are costs of production)
  salaries.directLabor = workforceDerived.directLaborSalaries || Array(totalMonths).fill(0);
  salaries.indirectLabor = workforceDerived.indirectLaborSalaries || Array(totalMonths).fill(0);

  // Raw material costs (BOM total cost × demand)
  if (bomsDerived.length > 0 && demandDerived.length > 0) {
    for (let i = 0; i < Math.min(bomsDerived.length, demandDerived.length); i++) {
      const bom = bomsDerived[i];
      const demand = demandDerived[i];
      const materialCosts = [];

      for (let month = 0; month < totalMonths; month++) {
        const orders = sanitizeNumber(demand.purchaseOrders[month] || 0);
        const unitCost = sanitizeNumber(bom.totalCost[month] || 0);
        materialCosts.push(orders * unitCost);
      }

      variableCosts[`${bom.name}_materials`] = materialCosts;
    }
  }

  // Sum up totals
  for (let month = 0; month < totalMonths; month++) {
    let monthTotal = 0;

    // Add salaries
    for (const key in salaries) {
      monthTotal += sanitizeNumber(salaries[key][month] || 0);
    }

    // Add fixed costs
    for (const key in fixedCosts) {
      monthTotal += sanitizeNumber(fixedCosts[key][month] || 0);
    }

    // Add variable costs
    for (const key in variableCosts) {
      monthTotal += sanitizeNumber(variableCosts[key][month] || 0);
    }

    totals[month] = monthTotal;
  }

  return {
    salaries,
    fixedCosts,
    variableCosts,
    totals,
  };
}

/**
 * Calculate operating expenses from derived values
 * @param {Object} workforceDerived - Derived workforce salaries
 * @param {Array} expensesDerived - Derived expenses
 * @param {Array} periods - Array of period numbers
 * @returns {Object} {salaries: {}, expenses: {}, totals: []}
 */
export function calculateOperatingExpenses(workforceDerived, expensesDerived, periods) {
  const salaries = {};
  const expenses = {};
  const totals = [];

  const totalMonths = periods.length;

  // Initialize totals
  for (let i = 0; i < totalMonths; i++) {
    totals.push(0);
  }

  // Engineering and administrative salaries (operating expenses, not production costs)
  salaries.engineering = workforceDerived.engineeringSalaries || Array(totalMonths).fill(0);
  salaries.administrative = workforceDerived.administrativeSalaries || Array(totalMonths).fill(0);

  // Other operating expenses
  for (const expense of expensesDerived) {
    expenses[expense.name] = expense.cost;
  }

  // Sum up totals
  for (let month = 0; month < totalMonths; month++) {
    let monthTotal = 0;

    // Add salaries
    for (const key in salaries) {
      monthTotal += sanitizeNumber(salaries[key][month] || 0);
    }

    // Add expenses
    for (const key in expenses) {
      monthTotal += sanitizeNumber(expenses[key][month] || 0);
    }

    totals[month] = monthTotal;
  }

  return {
    salaries,
    expenses,
    totals,
  };
}

/**
 * Calculate total depreciation for a period (used in statements)
 * @param {Object} assetsDerived - Derived assets depreciation
 * @param {Array} periods - Array of period numbers
 * @returns {Array} Total depreciation per period
 */
export function calculateTotalDepreciation(assetsDerived, periods) {
  const totalMonths = periods.length;
  const depreciation = [];

  for (let month = 0; month < totalMonths; month++) {
    const total = 
      sanitizeNumber(assetsDerived.machineryDepreciation[month] || 0) +
      sanitizeNumber(assetsDerived.vehiclesDepreciation[month] || 0) +
      sanitizeNumber(assetsDerived.buildingsDepreciation[month] || 0) +
      sanitizeNumber(assetsDerived.computerEquipmentDepreciation[month] || 0) +
      sanitizeNumber(assetsDerived.furnitureDepreciation[month] || 0);
    
    depreciation.push(total);
  }

  return depreciation;
}

/**
 * Get income statement for specific periods (filtering utility)
 * @param {Object} businessModel - Full canonical business model
 * @param {Object} periodSelection - {type: 'months'|'year'|'all', months?: [], year?: 2024}
 * @returns {Object} Filtered income statement
 */
export function getIncomeStatementForPeriods(businessModel, periodSelection) {
  const { timeline, revenue, costs, operatingExpenses } = businessModel;
  const { assetsDerived } = businessModel;
  
  if (!timeline || !timeline.months) {
    return {};
  }

  // Get depreciation array
  const depreciation = assetsDerived 
    ? calculateTotalDepreciation(assetsDerived, timeline.periods)
    : Array(timeline.totalMonths).fill(0);

  const result = {};
  const months = timeline.months;

  // Determine which periods to include
  let periodsToInclude = [];
  
  if (periodSelection.type === 'all') {
    periodsToInclude = months.map((_, idx) => idx);
  } else if (periodSelection.type === 'months' && periodSelection.months) {
    // Filter by specific month indices
    periodsToInclude = periodSelection.months;
  } else if (periodSelection.type === 'year' && periodSelection.year) {
    // Filter by year
    periodsToInclude = months
      .map((month, idx) => ({ month, idx }))
      .filter(({ month }) => month.includes(periodSelection.year.toString()))
      .map(({ idx }) => idx);
  }

  // Build filtered statement
  for (const idx of periodsToInclude) {
    const month = months[idx];
    const rev = sanitizeNumber(revenue.totals[idx] || 0);
    const cost = sanitizeNumber(costs.totals[idx] || 0);
    const expense = sanitizeNumber(operatingExpenses.totals[idx] || 0);
    const depr = sanitizeNumber(depreciation[idx] || 0);

    const grossProfit = rev - cost;
    const totalOperatingExpenses = expense + depr;
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const netIncome = operatingIncome;

    result[month] = {
      revenue: rev.toFixed(2),
      costs: cost.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      expenses: expense.toFixed(2),
      depreciation: depr.toFixed(2),
      totalOperatingExpenses: totalOperatingExpenses.toFixed(2),
      operatingIncome: operatingIncome.toFixed(2),
      netIncome: netIncome.toFixed(2),
    };
  }

  return result;
}

/**
 * Get cash flow statement for specific periods (filtering utility)
 * @param {Object} businessModel - Full canonical business model
 * @param {Object} periodSelection - {type: 'months'|'year'|'all', months?: [], year?: 2024}
 * @returns {Object} Filtered cash flow statement
 */
export function getCashFlowStatementForPeriods(businessModel, periodSelection) {
  const { timeline, revenue, costs, operatingExpenses, project } = businessModel;
  const { assetsDerived } = businessModel;
  
  if (!timeline || !timeline.months) {
    return {};
  }

  // Get depreciation array
  const depreciation = assetsDerived 
    ? calculateTotalDepreciation(assetsDerived, timeline.periods)
    : Array(timeline.totalMonths).fill(0);

  const result = {};
  const months = timeline.months;

  // Determine which periods to include
  let periodsToInclude = [];
  
  if (periodSelection.type === 'all') {
    periodsToInclude = months.map((_, idx) => idx);
  } else if (periodSelection.type === 'months' && periodSelection.months) {
    periodsToInclude = periodSelection.months;
  } else if (periodSelection.type === 'year' && periodSelection.year) {
    periodsToInclude = months
      .map((month, idx) => ({ month, idx }))
      .filter(({ month }) => month.includes(periodSelection.year.toString()))
      .map(({ idx }) => idx);
  }

  let cumulativeCash = sanitizeNumber(project?.initialInvestment || 0);

  // Build filtered statement
  for (const idx of periodsToInclude) {
    const month = months[idx];
    const rev = sanitizeNumber(revenue.totals[idx] || 0);
    const cost = sanitizeNumber(costs.totals[idx] || 0);
    const expense = sanitizeNumber(operatingExpenses.totals[idx] || 0);
    const depr = sanitizeNumber(depreciation[idx] || 0);

    const netIncome = rev - cost - expense;
    const cashFromOperations = netIncome + depr; // Add back non-cash expenses

    const cashFromInvesting = 0; // TODO: Calculate from asset purchases
    const cashFromFinancing = idx === 0 ? sanitizeNumber(project?.initialInvestment || 0) : 0;

    const netCashChange = cashFromOperations + cashFromInvesting + cashFromFinancing;
    cumulativeCash += netCashChange;

    result[month] = {
      netIncome: netIncome.toFixed(2),
      depreciation: depr.toFixed(2),
      cashFromOperations: cashFromOperations.toFixed(2),
      cashFromInvesting: cashFromInvesting.toFixed(2),
      cashFromFinancing: cashFromFinancing.toFixed(2),
      netCashChange: netCashChange.toFixed(2),
      endingCash: cumulativeCash.toFixed(2),
    };
  }

  return result;
}
