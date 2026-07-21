export {
  calculateNPV,
  calculateIRR,
  calculateROI,
  calculateBreakEven,
  calculateCumulativeCashflow,
  calculatePaybackPeriod,
  calculateDiscountedPaybackPeriod,
  calculateProfitabilityIndex,
  calculateAllProjectMetrics,
  calculateProjectMetricsForLifetime,
  calculateMetricsForAllLifetimes,
} from './projectMetrics.js';

export {
  calculateIncomeStatement,
  calculateBalanceSheet,
  calculateCashFlowStatement,
  calculateAllStatements,
  calculateFinancialRatios,
} from './statements.js';

export {
  calculateNetCashflows,
  calculateCumulativeCashflow as calculateCumulativeCashflowFromModel,
  calculateCashflowStats,
  prepareCashflowChartData,
  calculateMonthlyCashflowBreakdown,
  aggregateMonthlyToAnnual,
} from './cashflow.js';

export {
  calculateMovingAverage,
  calculateExponentialSmoothing,
  calculateLinearRegression,
  calculateGrowthRate,
  forecastFuture,
} from './forecasts.js';

export {
  deriveBOMSalesPriceAndCost,
  deriveDemand,
  deriveProduction,
  deriveWorkforceSalaries,
  deriveAssetsDepreciation,
  deriveExpenses,
  deriveFinancingPayments,
} from './derivations.js';

export {
  calculateRevenueFromDemandAndBOMs,
  calculateCostsFromDerivedValues,
  calculateOperatingExpenses,
  calculateTotalDepreciation,
  getIncomeStatementForPeriods,
  getCashFlowStatementForPeriods,
} from './evaluations.js';
