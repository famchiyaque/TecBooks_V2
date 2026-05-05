/**
 * Excel Adapter
 * 
 * Transforms Excel template data into the canonical business model format.
 * Based on the existing processExcel.js logic but adapted to the new architecture.
 */

import { createEmptyBusinessModel } from '../models/BusinessModel.js';
import { sanitizeNumber } from '../models/schemas.js';

/**
 * Parse date input from Excel (handles serial numbers and string formats)
 */
function parseDateInput(dateInput) {
  if (dateInput instanceof Date) return dateInput;
  
  if (typeof dateInput === 'number') {
    const utcDays = Math.floor(dateInput - 1);
    const msPerDay = 86400000;
    return new Date(Date.UTC(0, 0, utcDays));
  }
  
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 2) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
    }
    return new Date(dateInput);
  }
  
  return new Date(NaN);
}

/**
 * Extract business info from overview sheet
 */
function extractBusinessInfo(overviewSheet) {
  let rawStartMonth = overviewSheet[0][7];
  
  let startMonthDate;
  if (typeof rawStartMonth === 'number') {
    const utcDays = Math.floor(rawStartMonth - 1);
    startMonthDate = new Date(Date.UTC(0, 0, utcDays));
  } else if (typeof rawStartMonth === 'string' && rawStartMonth.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = rawStartMonth.split('-').map(Number);
    startMonthDate = new Date(year, month - 1, 1);
  } else {
    startMonthDate = new Date(rawStartMonth);
  }
  
  const formattedDate = startMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  const months = [];
  for (let i = 7; i < overviewSheet.length; i++) {
    months.push(overviewSheet[i][1]);
  }
  
  return {
    name: overviewSheet[0][4],
    startMonth: formattedDate,
    startDate: startMonthDate,
    months: months,
  };
}

/**
 * Extract overview data (revenue, costs, expenses, depreciation)
 */
function extractOverviewData(overviewSheet) {
  let revCol, costsCol, expensesCol, depCol;
  const revenue = [], costs = [], expenses = [], depreciation = [];
  
  const headerRow = overviewSheet[6];
  for (let i = 0; i < headerRow.length; i++) {
    const colName = headerRow[i];
    if (!colName) continue;
    
    const normalized = colName.trim().toLowerCase();
    if (normalized === 'revenue') revCol = i;
    else if (normalized === 'costs') costsCol = i;
    else if (normalized === 'expenses') expensesCol = i;
    else if (normalized === 'depreciation') depCol = i;
  }
  
  for (let i = 7; i < overviewSheet.length; i++) {
    const row = overviewSheet[i];
    if (!row || row.length === 0) continue;
    
    if (revCol !== undefined) revenue.push(sanitizeNumber(row[revCol]));
    if (costsCol !== undefined) costs.push(sanitizeNumber(row[costsCol]));
    if (expensesCol !== undefined) expenses.push(sanitizeNumber(row[expensesCol]));
    if (depCol !== undefined) depreciation.push(sanitizeNumber(row[depCol]));
  }
  
  return { revenue, costs, expenses, depreciation };
}

/**
 * Extract revenue data (products and services)
 */
function extractRevenueData(sheet) {
  const headerRow = sheet[5];
  const dataStartIndex = 6;
  
  const productsAndServices = {};
  const totals = [];
  const columnMap = {};
  
  for (let i = 2; i < headerRow.length; i++) {
    const label = headerRow[i];
    if (!label) continue;
    
    const normalizedKey = label.trim().toLowerCase();
    
    if (normalizedKey === 'total') {
      columnMap[i] = { type: 'total' };
    } else if (normalizedKey !== 'products') {
      columnMap[i] = { type: 'product', key: normalizedKey };
      productsAndServices[normalizedKey] = [];
    }
  }
  
  for (let i = dataStartIndex; i < sheet.length; i++) {
    const row = sheet[i];
    
    for (const [colIndex, mapping] of Object.entries(columnMap)) {
      const numIndex = Number(colIndex);
      const value = sanitizeNumber(row[numIndex]);
      
      if (mapping.type === 'total') {
        totals.push(value);
      } else if (mapping.type === 'product') {
        productsAndServices[mapping.key].push(value);
      }
    }
  }
  
  return { productsAndServices, totals };
}

/**
 * Extract costs data (salaries, fixed costs, variable costs)
 */
function extractCostsData(sheet) {
  const headerRow = sheet[5];
  const columnLabels = sheet[5];
  const dataStartIndex = 6;
  
  const salaries = {};
  const fixedCosts = {};
  const variableCosts = {};
  const total = [];
  
  let currentCategory = null;
  const columnMap = {};
  
  for (let i = 5; i < headerRow.length; i++) {
    const label = columnLabels[i];
    if (!label) continue;
    
    const normalized = label.trim().toLowerCase();
    
    if (normalized === "salaries") currentCategory = "salaries";
    else if (normalized === "fixed costs") currentCategory = "fixedCosts";
    else if (normalized === "variable costs") currentCategory = "variableCosts";
    else if (normalized === "total") {
      currentCategory = "total";
      columnMap[i] = { category: "total" };
    } else if (currentCategory && currentCategory !== "total") {
      const subKey = label.trim().replace(/\s+/g, '_');
      columnMap[i] = { category: currentCategory, subKey: subKey };
    }
  }
  
  for (let i = dataStartIndex; i < sheet.length; i++) {
    const row = sheet[i];
    
    for (const [colIndexStr, { category, subKey }] of Object.entries(columnMap)) {
      const colIndex = parseInt(colIndexStr);
      const value = sanitizeNumber(row[colIndex]);
      
      if (category === "total") {
        total.push(value);
      } else {
        if (category === "salaries") {
          if (!salaries[subKey]) salaries[subKey] = [];
          salaries[subKey].push(value);
        } else if (category === "fixedCosts") {
          if (!fixedCosts[subKey]) fixedCosts[subKey] = [];
          fixedCosts[subKey].push(value);
        } else if (category === "variableCosts") {
          if (!variableCosts[subKey]) variableCosts[subKey] = [];
          variableCosts[subKey].push(value);
        }
      }
    }
  }
  
  return { salaries, fixedCosts, variableCosts, total };
}

/**
 * Extract expenses data
 */
function extractExpensesData(sheet) {
  const headerRow = sheet[5];
  const columnLabels = sheet[5];
  const dataStartIndex = 6;
  
  const salaries = {};
  const expenses = {};
  const total = [];
  
  let currentCategory = null;
  const columnMap = {};
  
  for (let i = 2; i < headerRow.length; i++) {
    const label = columnLabels[i];
    if (!label) continue;
    
    const normalized = label.trim().toLowerCase();
    
    if (normalized === "salaries") {
      currentCategory = "salaries";
    } else if (normalized === "expenses") {
      currentCategory = "expenses";
    } else if (normalized === "total") {
      currentCategory = "total";
      columnMap[i] = { category: "total" };
    } else if (currentCategory === "salaries") {
      columnMap[i] = { category: "salaries", subKey: label.trim().replace(/\s+/g, "_") };
    } else if (currentCategory === "expenses") {
      columnMap[i] = { category: "expenses", subKey: label.trim().replace(/\s+/g, "_") };
    }
  }
  
  for (let i = dataStartIndex; i < sheet.length; i++) {
    const row = sheet[i];
    
    for (const [colIndexStr, { category, subKey }] of Object.entries(columnMap)) {
      const colIndex = parseInt(colIndexStr);
      const value = sanitizeNumber(row[colIndex]);
      
      if (category === "total") {
        total.push(value);
      } else if (category === "salaries") {
        if (!salaries[subKey]) salaries[subKey] = [];
        salaries[subKey].push(value);
      } else if (category === "expenses") {
        if (!expenses[subKey]) expenses[subKey] = [];
        expenses[subKey].push(value);
      }
    }
  }
  
  return { salaries, expenses, total };
}

/**
 * Extract accounts data (receivables and payables)
 */
function extractAccountsData(sheet) {
  const headerRow = sheet[6];
  const dataStartIndex = 7;
  const result = {
    receivables: {},
    payables: {},
    months: []
  };
  
  let currentCategory = null;
  const columnMap = {};
  
  for (let i = 1; i < headerRow.length; i++) {
    const label = headerRow[i] ? headerRow[i].trim() : '';
    
    if (!label) continue;
    
    if (label.toLowerCase() === "months") {
      columnMap[i] = { category: "months" };
    } else if (label.toLowerCase() === "payable" || label.toLowerCase() === "payables") {
      currentCategory = "payables";
    } else if (label.toLowerCase() === "receivable" || label.toLowerCase() === "receivables") {
      currentCategory = "receivables";
    } else if (currentCategory === "payables") {
      columnMap[i] = { category: "payables", accountName: label };
    } else if (currentCategory === "receivables") {
      columnMap[i] = { category: "receivables", accountName: label };
    }
  }
  
  const shouldDisregard = headerRow.some(cell => 
    cell && typeof cell === 'string' && 
    cell.toLowerCase().includes('disregard') && 
    cell.toLowerCase().includes('no accounts')
  );
  
  if (shouldDisregard) {
    return { receivables: {}, payables: {}, months: [], shouldDisregard: true };
  }
  
  for (let i = dataStartIndex; i < sheet.length; i++) {
    const row = sheet[i];
    
    for (const [colIndexStr, mapping] of Object.entries(columnMap)) {
      const colIndex = parseInt(colIndexStr);
      const value = row[colIndex] ?? null;
      
      if (mapping.category === "months") {
        if (value !== null && value !== "") {
          result.months.push(value);
        }
      } else if (mapping.category === "payables") {
        if (!result.payables[mapping.accountName]) {
          result.payables[mapping.accountName] = [];
        }
        result.payables[mapping.accountName].push(sanitizeNumber(value));
      } else if (mapping.category === "receivables") {
        if (!result.receivables[mapping.accountName]) {
          result.receivables[mapping.accountName] = [];
        }
        result.receivables[mapping.accountName].push(sanitizeNumber(value));
      }
    }
  }
  
  return result;
}

/**
 * Main adapter function: Transform Excel data to canonical business model
 * @param {Object} excelData - Raw Excel data with sheets
 * @returns {Object} Canonical business model
 */
export function adaptExcelToBusinessModel(excelData) {
  console.log('[ExcelAdapter] Starting transformation to canonical model');
  
  const model = createEmptyBusinessModel();
  
  // Extract business info
  const bizInfo = extractBusinessInfo(excelData.Overview);
  model.metadata.name = bizInfo.name;
  model.metadata.startDate = bizInfo.startDate;
  model.metadata.source = 'excel';
  model.metadata.type = 'general'; // Can be enhanced based on template type
  
  // Timeline
  model.timeline.months = bizInfo.months;
  model.timeline.totalMonths = bizInfo.months.length;
  model.timeline.startMonth = bizInfo.startMonth;
  
  // Overview data
  const overviewData = extractOverviewData(excelData.Overview);
  model.revenue.totals = overviewData.revenue;
  model.costs.totals = overviewData.costs;
  model.expenses.totals = overviewData.expenses;
  model.assets.depreciation = overviewData.depreciation;
  
  // Revenue details
  if (excelData.Revenue) {
    const revenueData = extractRevenueData(excelData.Revenue);
    model.revenue.productsAndServices = revenueData.productsAndServices;
    // Use detailed totals if available, otherwise use overview totals
    if (revenueData.totals.length > 0) {
      model.revenue.totals = revenueData.totals;
    }
  }
  
  // Costs details
  if (excelData.Costs) {
    const costsData = extractCostsData(excelData.Costs);
    model.costs.salaries = costsData.salaries;
    model.costs.fixedCosts = costsData.fixedCosts;
    model.costs.variableCosts = costsData.variableCosts;
    if (costsData.total.length > 0) {
      model.costs.totals = costsData.total;
    }
  }
  
  // Expenses details
  if (excelData.Expenses) {
    const expensesData = extractExpensesData(excelData.Expenses);
    model.expenses.salaries = expensesData.salaries;
    model.expenses.expenses = expensesData.expenses;
    if (expensesData.total.length > 0) {
      model.expenses.totals = expensesData.total;
    }
  }
  
  // Accounts
  if (excelData.Accounts) {
    const accountsData = extractAccountsData(excelData.Accounts);
    model.accounts = accountsData;
  }
  
  console.log('[ExcelAdapter] Transformation complete');
  console.log('[ExcelAdapter] Model summary:', {
    name: model.metadata.name,
    months: model.timeline.totalMonths,
    hasRevenue: model.revenue.totals.length > 0,
    hasCosts: model.costs.totals.length > 0,
  });
  
  return model;
}
