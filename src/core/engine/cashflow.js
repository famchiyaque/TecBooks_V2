/**
 * Cashflow Calculations
 * 
 * Calculates cashflow projections and analysis from the canonical business model.
 */

import { sanitizeNumber } from '../models/schemas.js';

/**
 * Calculate net cashflow per period
 * @param {Object} businessModel - Canonical business model
 * @returns {number[]} Array of net cashflows per period
 */
export function calculateNetCashflows(businessModel) {
  const { revenue, costs, expenses } = businessModel;
  const cashflows = [];
  
  const length = Math.min(
    revenue?.totals?.length || 0,
    costs?.totals?.length || 0,
    expenses?.totals?.length || 0
  );
  
  for (let i = 0; i < length; i++) {
    const rev = sanitizeNumber(revenue.totals[i]);
    const cost = sanitizeNumber(costs.totals[i]);
    const exp = sanitizeNumber(expenses.totals[i]);
    cashflows.push(rev - cost - exp);
  }
  
  return cashflows;
}

/**
 * Calculate cumulative cashflow including initial investment
 * @param {Object} businessModel - Canonical business model
 * @returns {number[]} Array of cumulative cashflows
 */
export function calculateCumulativeCashflow(businessModel) {
  const netCashflows = calculateNetCashflows(businessModel);
  const initialInvestment = sanitizeNumber(businessModel.project?.initialInvestment);
  
  const cumulative = [];
  let sum = -initialInvestment;
  
  netCashflows.forEach(cf => {
    sum += cf;
    cumulative.push(sum);
  });
  
  return cumulative;
}

/**
 * Calculate cashflow summary statistics
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Cashflow statistics
 */
export function calculateCashflowStats(businessModel) {
  const netCashflows = calculateNetCashflows(businessModel);
  const cumulativeCashflow = calculateCumulativeCashflow(businessModel);
  
  const totalCashflow = netCashflows.reduce((sum, cf) => sum + cf, 0);
  const averageCashflow = netCashflows.length > 0 ? totalCashflow / netCashflows.length : 0;
  const maxCashflow = Math.max(...netCashflows, 0);
  const minCashflow = Math.min(...netCashflows, 0);
  const finalCumulativeCashflow = cumulativeCashflow[cumulativeCashflow.length - 1] || 0;
  
  return {
    totalCashflow,
    averageCashflow,
    maxCashflow,
    minCashflow,
    finalCumulativeCashflow,
    periods: netCashflows.length,
  };
}

/**
 * Prepare cashflow data for charting
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Chart-ready data
 */
export function prepareCashflowChartData(businessModel) {
  const { timeline } = businessModel;
  const netCashflows = calculateNetCashflows(businessModel);
  const cumulativeCashflow = calculateCumulativeCashflow(businessModel);
  const months = timeline?.months || [];
  
  return {
    labels: months,
    netCashflow: netCashflows,
    cumulativeCashflow: cumulativeCashflow,
    series: [
      {
        name: 'Net Cashflow',
        data: netCashflows,
        type: 'column',
      },
      {
        name: 'Cumulative Cashflow',
        data: cumulativeCashflow,
        type: 'line',
      },
    ],
  };
}

/**
 * Calculate monthly breakdown of cashflows
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Monthly cashflow breakdown
 */
export function calculateMonthlyCashflowBreakdown(businessModel) {
  const { timeline, revenue, costs, expenses } = businessModel;
  const months = timeline?.months || [];
  const result = {};
  
  months.forEach((month, index) => {
    const rev = sanitizeNumber(revenue.totals[index]);
    const cost = sanitizeNumber(costs.totals[index]);
    const exp = sanitizeNumber(expenses.totals[index]);
    const netCashflow = rev - cost - exp;
    
    result[month] = {
      revenue: rev,
      costs: cost,
      expenses: exp,
      netCashflow: netCashflow,
    };
  });
  
  return result;
}
