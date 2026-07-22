/**
 * Project Evaluation Metrics Calculator
 * 
 * Calculates IRR, NPV, ROI, Break-even, and other project evaluation metrics
 * from the canonical business model.
 */

import { sanitizeNumber } from '@/utils/number.utils.js';
import { aggregateMonthlyToAnnual } from './cashflow.js';

/**
 * Calculate Net Present Value (NPV)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @param {number} discountRate - Discount rate as percentage (e.g., 10 for 10%)
 * @returns {number} NPV value
 */
export function calculateNPV(initialInvestment, cashflows, discountRate) {
  const rate = discountRate / 100;
  
  const presentValues = cashflows.map((cashflow, index) => {
    const period = index + 1;
    return sanitizeNumber(cashflow) / Math.pow(1 + rate, period);
  });
  
  const totalPV = presentValues.reduce((sum, pv) => sum + pv, 0);
  const npv = totalPV - sanitizeNumber(initialInvestment);
  
  return npv;
}

/**
 * Calculate Internal Rate of Return (IRR)
 * Uses Newton-Raphson method to find the rate where NPV = 0
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @returns {number} IRR as percentage (e.g., 15.5 for 15.5%)
 */
export function calculateIRR(initialInvestment, cashflows) {
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let rate = 0.1; // Start with 10% guess
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = -sanitizeNumber(initialInvestment);
    let derivative = 0;
    
    cashflows.forEach((cashflow, index) => {
      const period = index + 1;
      const cf = sanitizeNumber(cashflow);
      npv += cf / Math.pow(1 + rate, period);
      derivative -= (period * cf) / Math.pow(1 + rate, period + 1);
    });
    
    if (Math.abs(npv) < tolerance) {
      return rate * 100; // Convert to percentage
    }
    
    if (derivative === 0) {
      break; // Avoid division by zero
    }
    
    rate = rate - npv / derivative;
    
    // Prevent negative rates or unrealistic values
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10; // Cap at 1000%
  }
  
  return rate * 100; // Return as percentage
}

/**
 * Calculate Return on Investment (ROI)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @returns {number} ROI as percentage
 */
export function calculateROI(initialInvestment, cashflows) {
  const totalReturn = cashflows.reduce((sum, cf) => sum + sanitizeNumber(cf), 0);
  const investment = sanitizeNumber(initialInvestment);
  
  if (investment === 0) return 0;
  
  const roi = ((totalReturn - investment) / investment) * 100;
  return roi;
}

/**
 * Calculate Break-even Point (in periods)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @returns {number} Break-even period (can be fractional)
 */
export function calculateBreakEven(initialInvestment, cashflows) {
  let cumulativeCashflow = -sanitizeNumber(initialInvestment);
  
  for (let i = 0; i < cashflows.length; i++) {
    const previousCumulative = cumulativeCashflow;
    cumulativeCashflow += sanitizeNumber(cashflows[i]);
    
    if (cumulativeCashflow >= 0) {
      // Interpolate to find exact break-even point
      const periodFraction = Math.abs(previousCumulative) / sanitizeNumber(cashflows[i]);
      return i + periodFraction;
    }
  }
  
  // If never breaks even within the period
  return -1;
}

/**
 * Calculate cumulative cashflow over time
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @returns {number[]} Array of cumulative cashflows
 */
export function calculateCumulativeCashflow(initialInvestment, cashflows) {
  const cumulative = [];
  let sum = -sanitizeNumber(initialInvestment);
  
  cashflows.forEach(cf => {
    sum += sanitizeNumber(cf);
    cumulative.push(sum);
  });
  
  return cumulative;
}

/**
 * Calculate Payback Period (simple, non-discounted)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @returns {number} Payback period in periods
 */
export function calculatePaybackPeriod(initialInvestment, cashflows) {
  return calculateBreakEven(initialInvestment, cashflows);
}

/**
 * Calculate Discounted Payback Period
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @param {number} discountRate - Discount rate as percentage
 * @returns {number} Discounted payback period in periods
 */
export function calculateDiscountedPaybackPeriod(initialInvestment, cashflows, discountRate) {
  const rate = discountRate / 100;
  const discountedCashflows = cashflows.map((cf, index) => {
    return sanitizeNumber(cf) / Math.pow(1 + rate, index + 1);
  });
  
  return calculateBreakEven(initialInvestment, discountedCashflows);
}

/**
 * Calculate Profitability Index (PI)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number[]} cashflows - Array of cashflows per period
 * @param {number} discountRate - Discount rate as percentage
 * @returns {number} Profitability Index
 */
export function calculateProfitabilityIndex(initialInvestment, cashflows, discountRate) {
  const rate = discountRate / 100;
  const investment = sanitizeNumber(initialInvestment);
  
  if (investment === 0) return 0;
  
  const presentValues = cashflows.map((cashflow, index) => {
    const period = index + 1;
    return sanitizeNumber(cashflow) / Math.pow(1 + rate, period);
  });
  
  const totalPV = presentValues.reduce((sum, pv) => sum + pv, 0);
  const pi = totalPV / investment;
  
  return pi;
}

/**
 * Calculate all project metrics from business model
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} All project metrics
 */
export function calculateAllProjectMetrics(businessModel) {
  const { project, revenue, costs, expenses, timeline } = businessModel;
  
  // Calculate net cashflows per period (revenue - costs - expenses)
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
  
  const initialInvestment = sanitizeNumber(project?.initialInvestment);
  const discountRate = sanitizeNumber(project?.discountRate, 10); // Default 10%
  
  const npv = calculateNPV(initialInvestment, cashflows, discountRate);
  const irr = calculateIRR(initialInvestment, cashflows);
  const roi = calculateROI(initialInvestment, cashflows);
  const breakEven = calculateBreakEven(initialInvestment, cashflows);
  const cumulativeCashflow = calculateCumulativeCashflow(initialInvestment, cashflows);
  const paybackPeriod = calculatePaybackPeriod(initialInvestment, cashflows);
  const discountedPaybackPeriod = calculateDiscountedPaybackPeriod(initialInvestment, cashflows, discountRate);
  const profitabilityIndex = calculateProfitabilityIndex(initialInvestment, cashflows, discountRate);
  
  return {
    npv,
    irr,
    roi,
    breakEven,
    paybackPeriod,
    discountedPaybackPeriod,
    profitabilityIndex,
    cashflows,
    cumulativeCashflow,
    initialInvestment,
    discountRate,
    totalCashflow: cashflows.reduce((sum, cf) => sum + cf, 0),
  };
}

/**
 * Project metrics for a horizon of annual inflows/outflows (e.g. from aggregated monthly CBM cashFlows).
 * @param {number} initialInvestment
 * @param {number[]} inflows
 * @param {number[]} outflows
 * @param {number} trema discount rate as decimal (e.g. 0.15)
 * @param {number} lifetime number of periods (years including year 0 when slice includes index 0)
 */
export function calculateProjectMetricsForLifetime(initialInvestment, inflows, outflows, trema, lifetime) {
  const relevantInflows = inflows.slice(0, lifetime);
  const relevantOutflows = outflows.slice(0, lifetime);

  const cashflows = relevantInflows.map((inflow, index) => {
    if (index === 0) {
      return inflow - relevantOutflows[index] - initialInvestment;
    }
    return inflow - relevantOutflows[index];
  });

  const discountRatePercent = trema * 100;
  let npv = 0;
  for (let i = 0; i < lifetime; i++) {
    npv += cashflows[i] / Math.pow(1 + (discountRatePercent / 100), i);
  }

  let lowRate = npv > 0 ? 0 : -100;
  let highRate = npv > 0 ? 200 : 0;
  let irr = 0;
  let iterations = 1000;
  const tolerance = 0.01;

  while (iterations--) {
    const guessRate = (lowRate + highRate) / 2;
    let npvAtRate = 0;

    for (let t = 0; t < lifetime; t++) {
      const cashFlow = relevantInflows[t] - relevantOutflows[t];
      npvAtRate += cashFlow / Math.pow(1 + guessRate / 100, t);
    }
    npvAtRate -= initialInvestment;

    if (Math.abs(npvAtRate) < tolerance) {
      irr = guessRate;
      break;
    }

    if (npvAtRate > 0) {
      lowRate = guessRate;
    } else {
      highRate = guessRate;
    }
  }

  const totalInflows = relevantInflows.reduce((sum, val) => sum + val, 0);
  const totalOutflows = relevantOutflows.reduce((sum, val) => sum + val, 0);
  const roi =
    ((totalInflows - totalOutflows - initialInvestment) / (totalOutflows + initialInvestment)) * 100;

  let breakEven = -1;
  let accumulated = -initialInvestment;

  for (let i = 1; i < lifetime; i++) {
    const previousAccumulated = accumulated;
    accumulated += cashflows[i];

    if (accumulated >= 0 && breakEven === -1) {
      if (previousAccumulated < 0 && cashflows[i] > 0) {
        const periodFraction = Math.abs(previousAccumulated) / cashflows[i];
        breakEven = i + periodFraction;
      } else {
        breakEven = i;
      }
      break;
    }
  }

  const npvPerYear = npv / lifetime;

  return {
    npv: parseFloat(npv.toFixed(2)),
    irr: parseFloat(irr.toFixed(1)),
    roi: parseFloat(roi.toFixed(2)),
    breakEven: breakEven >= 0 ? parseFloat(breakEven.toFixed(1)) : -1,
    npvPerYear: parseFloat(npvPerYear.toFixed(2)),
  };
}

/**
 * Build annual cashflow series from CBM.cashFlows and compute NPV/IRR metrics for each project lifetime.
 * @param {Object} businessModel
 * @param {number} maxYears
 */
export function calculateMetricsForAllLifetimes(businessModel, maxYears = 10) {
  const { premises, financing, cashFlows } = businessModel;

  if (!cashFlows?.inflows?.length || !cashFlows?.outflows?.length) {
    return null;
  }

  const annual = aggregateMonthlyToAnnual(cashFlows.inflows, cashFlows.outflows, maxYears);
  if (!annual) return null;

  const { inflows, outflows, effectiveMaxYears } = annual;
  const initialInvestment = sanitizeNumber(financing?.initialInvestment);
  const trema = premises?.trema ?? 0;

  const metricsByLifetime = [];
  let bestLifetime = null;
  let bestNPVPerYear = -Infinity;

  for (let lifetime = 1; lifetime <= effectiveMaxYears; lifetime++) {
    const metrics = calculateProjectMetricsForLifetime(
      initialInvestment,
      inflows,
      outflows,
      trema,
      lifetime + 1
    );
    metrics.lifetime = lifetime;
    metricsByLifetime.push(metrics);

    if (metrics.npvPerYear > bestNPVPerYear) {
      bestNPVPerYear = metrics.npvPerYear;
      bestLifetime = {
        lifetime,
        npv: metrics.npv,
        npvPerYear: metrics.npvPerYear,
        reason: 'Highest NPV per year ratio',
      };
    }
  }

  return {
    cashflows: {
      inflows: annual.inflows,
      outflows: annual.outflows,
      netCashflows: annual.netCashflows,
      cumulativeCashflows: annual.cumulativeCashflows,
    },
    metricsByLifetime,
    bestLifetime,
    recommendedLifetime: bestLifetime?.lifetime || effectiveMaxYears,
  };
}
