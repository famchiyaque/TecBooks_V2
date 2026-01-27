/**
 * Financial Statements Calculator
 * 
 * Generates Income Statement, Balance Sheet, and Cash Flow Statement
 * from the canonical business model.
 */

import { sanitizeNumber } from '../models/schemas.js';

/**
 * Calculate Income Statement for all periods
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Income statement data by month
 */
export function calculateIncomeStatement(businessModel) {
  const { timeline, revenue, costs, expenses, assets } = businessModel;
  const result = {};
  
  const months = timeline?.months || [];
  const revenueData = revenue?.totals || [];
  const costsData = costs?.totals || [];
  const expensesData = expenses?.totals || [];
  const depreciationData = assets?.depreciation || [];
  
  months.forEach((month, index) => {
    const rev = sanitizeNumber(revenueData[index]);
    const cost = sanitizeNumber(costsData[index]);
    const expense = sanitizeNumber(expensesData[index]);
    const depreciation = sanitizeNumber(depreciationData[index]);
    
    const grossProfit = rev - cost;
    const totalOperatingExpenses = expense + depreciation;
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const netIncome = operatingIncome; // Simplified (no taxes/interest for now)
    
    result[month] = {
      revenue: rev.toFixed(2),
      costs: cost.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      expenses: expense.toFixed(2),
      depreciation: depreciation.toFixed(2),
      totalOperatingExpenses: totalOperatingExpenses.toFixed(2),
      operatingIncome: operatingIncome.toFixed(2),
      netIncome: netIncome.toFixed(2),
    };
  });
  
  return result;
}

/**
 * Calculate Balance Sheet for all periods
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Balance sheet data by month
 */
export function calculateBalanceSheet(businessModel) {
  const { timeline, assets, accounts, project } = businessModel;
  const result = {};
  
  const months = timeline?.months || [];
  
  // Calculate cumulative retained earnings
  const incomeStatement = calculateIncomeStatement(businessModel);
  let cumulativeRetainedEarnings = 0;
  
  months.forEach((month, index) => {
    const netIncome = parseFloat(incomeStatement[month]?.netIncome || 0);
    cumulativeRetainedEarnings += netIncome;
    
    // Assets
    const currentAssets = 0; // TODO: Calculate from accounts receivable + inventory
    const fixedAssets = 0; // TODO: Calculate from assets data
    const totalAssets = currentAssets + fixedAssets;
    
    // Liabilities
    const currentLiabilities = 0; // TODO: Calculate from accounts payable
    const longTermLiabilities = 0; // TODO: Calculate from loans
    const totalLiabilities = currentLiabilities + longTermLiabilities;
    
    // Equity
    const equity = sanitizeNumber(project?.equity);
    const retainedEarnings = cumulativeRetainedEarnings;
    const totalEquity = equity + retainedEarnings;
    
    result[month] = {
      // Assets
      currentAssets: currentAssets.toFixed(2),
      fixedAssets: fixedAssets.toFixed(2),
      totalAssets: totalAssets.toFixed(2),
      
      // Liabilities
      currentLiabilities: currentLiabilities.toFixed(2),
      longTermLiabilities: longTermLiabilities.toFixed(2),
      totalLiabilities: totalLiabilities.toFixed(2),
      
      // Equity
      equity: equity.toFixed(2),
      retainedEarnings: retainedEarnings.toFixed(2),
      totalEquity: totalEquity.toFixed(2),
      
      // Check
      totalLiabilitiesAndEquity: (totalLiabilities + totalEquity).toFixed(2),
    };
  });
  
  return result;
}

/**
 * Calculate Cash Flow Statement for all periods
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Cash flow statement data by month
 */
export function calculateCashFlowStatement(businessModel) {
  const { timeline, revenue, costs, expenses, assets, project } = businessModel;
  const result = {};
  
  const months = timeline?.months || [];
  const incomeStatement = calculateIncomeStatement(businessModel);
  
  let cumulativeCash = sanitizeNumber(project?.initialInvestment);
  
  months.forEach((month, index) => {
    const netIncome = parseFloat(incomeStatement[month]?.netIncome || 0);
    const depreciation = parseFloat(incomeStatement[month]?.depreciation || 0);
    
    // Operating Activities
    const cashFromOperations = netIncome + depreciation; // Add back non-cash expenses
    
    // Investing Activities
    const cashFromInvesting = 0; // TODO: Calculate from asset purchases
    
    // Financing Activities
    const cashFromFinancing = index === 0 ? sanitizeNumber(project?.initialInvestment) : 0;
    
    // Net Change in Cash
    const netCashChange = cashFromOperations + cashFromInvesting + cashFromFinancing;
    cumulativeCash += netCashChange;
    
    result[month] = {
      // Operating
      netIncome: netIncome.toFixed(2),
      depreciation: depreciation.toFixed(2),
      cashFromOperations: cashFromOperations.toFixed(2),
      
      // Investing
      cashFromInvesting: cashFromInvesting.toFixed(2),
      
      // Financing
      cashFromFinancing: cashFromFinancing.toFixed(2),
      
      // Summary
      netCashChange: netCashChange.toFixed(2),
      endingCash: cumulativeCash.toFixed(2),
    };
  });
  
  return result;
}

/**
 * Calculate all financial statements
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} All financial statements
 */
export function calculateAllStatements(businessModel) {
  return {
    incomeStatement: calculateIncomeStatement(businessModel),
    balanceSheet: calculateBalanceSheet(businessModel),
    cashFlowStatement: calculateCashFlowStatement(businessModel),
  };
}

/**
 * Get financial ratios from statements
 * @param {Object} businessModel - Canonical business model
 * @returns {Object} Financial ratios by month
 */
export function calculateFinancialRatios(businessModel) {
  const incomeStatement = calculateIncomeStatement(businessModel);
  const balanceSheet = calculateBalanceSheet(businessModel);
  const result = {};
  
  const months = businessModel.timeline?.months || [];
  
  months.forEach(month => {
    const revenue = parseFloat(incomeStatement[month]?.revenue || 0);
    const netIncome = parseFloat(incomeStatement[month]?.netIncome || 0);
    const totalAssets = parseFloat(balanceSheet[month]?.totalAssets || 1);
    const totalEquity = parseFloat(balanceSheet[month]?.totalEquity || 1);
    
    result[month] = {
      profitMargin: revenue > 0 ? ((netIncome / revenue) * 100).toFixed(2) : '0.00',
      returnOnAssets: totalAssets > 0 ? ((netIncome / totalAssets) * 100).toFixed(2) : '0.00',
      returnOnEquity: totalEquity > 0 ? ((netIncome / totalEquity) * 100).toFixed(2) : '0.00',
    };
  });
  
  return result;
}
