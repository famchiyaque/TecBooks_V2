/**
 * Derivations Engine
 * 
 * Transforms input values into period-by-period projected arrays (derived values).
 * These derived values are then used by the evaluations engine to compute final metrics.
 */

import { forecastFuture, calculateLinearRegression } from './forecasts.js';
import { sanitizeNumber } from '@/utils/number.utils.js';

/**
 * Derive BOM sales prices and total costs over time using inflation
 * @param {Array} bomsProducts - Array of BOM products from CBM.boms.products
 * @param {number} totalMonths - Total number of months to project
 * @param {number} inflationRate - Annual inflation rate (as decimal, e.g., 0.04 for 4%)
 * @param {string} forecastMethod - Method to use ('inflation' default)
 * @returns {Array} Array of {name, salesPrice: [...], totalCost: [...]}
 */
export function deriveBOMSalesPriceAndCost(bomsProducts, totalMonths, inflationRate, forecastMethod = 'inflation') {
  const derivedBOMs = [];
  const monthlyInflation = inflationRate / 12; // Convert annual to monthly

  for (const product of bomsProducts) {
    const initialSalesPrice = sanitizeNumber(product.salesPrice);
    const initialTotalCost = product.parts.reduce((sum, part) => sum + sanitizeNumber(part.subtotal), 0);

    const salesPriceArray = [];
    const totalCostArray = [];

    for (let month = 0; month < totalMonths; month++) {
      if (forecastMethod === 'inflation') {
        // Compound monthly inflation
        const inflationFactor = Math.pow(1 + monthlyInflation, month);
        salesPriceArray.push(Math.round(initialSalesPrice * inflationFactor));
        totalCostArray.push(Math.round(initialTotalCost * inflationFactor));
      } else {
        // Fallback: use initial values
        salesPriceArray.push(Math.round(initialSalesPrice));
        totalCostArray.push(Math.round(initialTotalCost));
      }
    }

    derivedBOMs.push({
      name: product.name,
      salesPrice: salesPriceArray,
      totalCost: totalCostArray,
    });
  }

  return derivedBOMs;
}

/**
 * Derive demand (purchase orders) over time using statistical forecasting methods
 * @param {Object} demandConfig - CBM.demand configuration
 * @param {number} totalMonths - Total number of months to project
 * @param {Array} bomsProducts - Array of BOM products to get product name
 * @param {number} windowSize - Number of historical periods to use for forecasting
 * @returns {Array} Array of {product, purchaseOrders: [...]}
 */
export function deriveDemand(demandConfig, totalMonths, bomsProducts = [], windowSize = 5) {
  const { 
    ordersForecastMethod = 'slr',
    previousYearsDemand = [], 
    yearZeroDemand = [],
    monthlyTendency = []
  } = demandConfig;

  // Start with yearZero data (actual historical data from startup)
  const purchaseOrders = yearZeroDemand.map(d => Math.round(sanitizeNumber(d.orders)));
  
  // Combine all historical data for forecasting: previousYears + yearZero
  const historicalOrders = [
    ...previousYearsDemand.map(d => sanitizeNumber(d.orders)),
    ...yearZeroDemand.map(d => sanitizeNumber(d.orders))
  ];

  // Calculate how many months we still need to forecast
  const monthsToForecast = totalMonths - purchaseOrders.length;
  
  if (monthsToForecast <= 0) {
    // We already have enough data
    const productName = bomsProducts.length > 0 ? bomsProducts[0].name : 'default';
    return [{
      product: productName,
      purchaseOrders: purchaseOrders.slice(0, totalMonths)
    }];
  }

  // Use only the most recent data points (window size) for forecasting
  const recentData = historicalOrders.slice(-windowSize);
  
  // If no historical data, use a default starting value
  const startingOrders = recentData.length > 0 
    ? recentData[recentData.length - 1] 
    : 100;

  // Forecast the remaining months
  const forecastedOrders = [];
  
  switch (ordersForecastMethod) {
    case 'slr': // Simple Linear Regression
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = calculateLinearRegression(recentData.length > 0 ? recentData : [startingOrders], month);
        forecastedOrders.push(Math.round(Math.max(0, forecast)));
      }
      break;

    case 'sma': // Simple Moving Average
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(recentData.length > 0 ? recentData : [startingOrders], 1, 'moving_average', { periods: Math.min(3, windowSize) });
        forecastedOrders.push(Math.round(Math.max(0, forecast[0])));
      }
      break;

    case 'ses': // Simple Exponential Smoothing
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(recentData.length > 0 ? recentData : [startingOrders], 1, 'exponential', { alpha: 0.3 });
        forecastedOrders.push(Math.round(Math.max(0, forecast[0])));
      }
      break;

    case 'winters': // Winters method (simplified - using exponential)
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(recentData.length > 0 ? recentData : [startingOrders], 1, 'exponential', { alpha: 0.3 });
        // Apply seasonal tendency if available
        const monthIndex = (purchaseOrders.length + month - 1) % 12;
        const tendencyFactor = monthlyTendency.length > 0 ? sanitizeNumber(monthlyTendency[monthIndex]) : 1;
        forecastedOrders.push(Math.round(Math.max(0, forecast[0] * tendencyFactor)));
      }
      break;

    default:
      // Fallback: flat projection
      for (let month = 0; month < monthsToForecast; month++) {
        forecastedOrders.push(Math.round(startingOrders));
      }
  }

  // Combine yearZero data + forecasted data
  const allOrders = [...purchaseOrders, ...forecastedOrders];

  // Get product name from BOMs
  const productName = bomsProducts.length > 0 ? bomsProducts[0].name : 'default';

  // Return single product for now (can be expanded for multiple products)
  return [{
    product: productName,
    purchaseOrders: allOrders
  }];
}

/**
 * Derive production capacity, quality yield, and work orders over time
 * @param {Array} productionLines - CBM.production.lines
 * @param {number} totalMonths - Total number of months to project
 * @param {number} qualityImprovementRate - Annual quality improvement rate (as decimal)
 * @param {string} forecastingMethod - Forecasting method ('log' for logarithmic)
 * @param {Array} demandDerived - Derived demand data to calculate work orders
 * @returns {Array} Array of {line, qualityYield: [...], capacity: [...], workOrders: [...], occupiedCapacity: [...]}
 */
export function deriveProduction(productionLines, totalMonths, qualityImprovementRate = 0, forecastingMethod = 'log', demandDerived = []) {
  const derivedProduction = [];

  for (const line of productionLines) {
    const initialQuality = sanitizeNumber(line.qualityYield);
    const unitsPerHour = sanitizeNumber(line.unitsPerHour) || 0;
    const hoursPerShift = sanitizeNumber(line.hoursPerShift) || 0;
    const numberOfShifts = sanitizeNumber(line.numberOfShifts) || 0;
    const daysPerWeek = sanitizeNumber(line.daysPerWeek) || 0;
    const weeksPerMonth = sanitizeNumber(line.weeksPerYear || 52) / 12;

    const qualityYieldArray = [];
    const capacityArray = [];
    const workOrdersArray = [];
    const occupiedCapacityArray = [];

    // Get purchase orders from demand for work orders calculation
    const purchaseOrders = demandDerived.length > 0 && demandDerived[0].purchaseOrders 
      ? demandDerived[0].purchaseOrders 
      : [];

    for (let month = 0; month < totalMonths; month++) {
      // Quality yield based on forecasting method
      let qualityYield;
      if (forecastingMethod === 'log') {
        // Logarithmic improvement
        const monthlyImprovementRate = qualityImprovementRate / 12;
        qualityYield = Math.min(1.0, initialQuality * Math.pow(1 + monthlyImprovementRate, month));
      } else {
        // Default: static quality
        qualityYield = initialQuality;
      }
      qualityYield = Math.round(qualityYield * 100) / 100; // Round to 2 decimals
      qualityYieldArray.push(qualityYield);

      // Base capacity = unitsPerHour * hoursPerShift * shifts * daysPerWeek * weeksPerMonth
      const baseCapacity = unitsPerHour * hoursPerShift * numberOfShifts * daysPerWeek * weeksPerMonth;
      
      // Actual capacity is limited by quality yield (only good units count as capacity)
      const capacity = baseCapacity * qualityYield;
      const roundedCapacity = Math.round(capacity * 100) / 100; // Round to 2 decimals
      capacityArray.push(roundedCapacity);

      // Work orders = purchaseOrders / qualityYield (how many we need to produce to get desired output)
      let workOrders = 0;
      if (purchaseOrders[month]) {
        workOrders = qualityYield > 0 ? purchaseOrders[month] / qualityYield : 0;
      }
      workOrders = Math.round(workOrders); // Round to whole numbers
      workOrdersArray.push(workOrders);

      // Occupied capacity = workOrders / capacity (percentage of capacity being used)
      const occupiedCapacity = roundedCapacity > 0 ? (workOrders / roundedCapacity) : 0;
      occupiedCapacityArray.push(Math.round(occupiedCapacity * 100) / 100); // Round to 2 decimals
    }

    derivedProduction.push({
      line: line.name || 'Production Line',
      qualityYield: qualityYieldArray,
      capacity: capacityArray,
      workOrders: workOrdersArray,
      occupiedCapacity: occupiedCapacityArray,
    });
  }

  return derivedProduction;
}

/**
 * Derive workforce salaries over time using forecasting method
 * @param {Object} workforceConfig - CBM.workforce configuration with initial salaries by category
 * @param {number} totalMonths - Total number of months to project
 * @param {number} inflationRate - Annual inflation rate (as decimal)
 * @param {string} forecastingMethod - Forecasting method ('inflation', 'static', etc.)
 * @returns {Object} {directLaborSalaries: [...], indirectLaborSalaries: [...], engineeringSalaries: [...], administrativeSalaries: [...]}
 */
export function deriveWorkforceSalaries(workforceConfig, totalMonths, inflationRate, forecastingMethod = 'inflation') {
  const monthlyInflation = inflationRate / 12;
  
  const salariesByCategory = {
    directLaborSalaries: [],
    indirectLaborSalaries: [],
    engineeringSalaries: [],
    administrativeSalaries: [],
  };

  // Get initial salaries by category from config (already include labor benefits)
  const initialSalaries = {
    direct: sanitizeNumber(workforceConfig.directLaborSalaries) || 0,
    indirect: sanitizeNumber(workforceConfig.indirectLaborSalaries) || 0,
    engineering: sanitizeNumber(workforceConfig.engineeringSalaries) || 0,
    administrative: sanitizeNumber(workforceConfig.administrativeSalaries) || 0,
  };

  // Project each category over time based on forecasting method
  for (let month = 0; month < totalMonths; month++) {
    let inflationFactor = 1;
    
    if (forecastingMethod === 'inflation') {
      inflationFactor = Math.pow(1 + monthlyInflation, month);
    } else if (forecastingMethod === 'static') {
      inflationFactor = 1; // No growth
    }
    // Add more methods here as needed
    
    salariesByCategory.directLaborSalaries.push(Math.round(initialSalaries.direct * inflationFactor * 100) / 100);
    salariesByCategory.indirectLaborSalaries.push(Math.round(initialSalaries.indirect * inflationFactor * 100) / 100);
    salariesByCategory.engineeringSalaries.push(Math.round(initialSalaries.engineering * inflationFactor * 100) / 100);
    salariesByCategory.administrativeSalaries.push(Math.round(initialSalaries.administrative * inflationFactor * 100) / 100);
  }

  return salariesByCategory;
}

/**
 * Derive asset depreciation over time
 * @param {Object} assetsConfig - CBM.assets
 * @param {Object} premises - CBM.premises (contains depreciation rates)
 * @param {number} totalMonths - Total number of months to project
 * @param {Date} startDate - Project start date
 * @returns {Object} Depreciation arrays by category
 */
export function deriveAssetsDepreciation(assetsConfig, premises, totalMonths, startDate) {
  const depreciation = {
    machineryDepreciation: [],
    machineryTotal: [],
    vehiclesDepreciation: [],
    vehiclesTotal: [],
    buildingsDepreciation: [],
    buildingsTotal: [],
    computerEquipmentDepreciation: [],
    computerEquipmentTotal: [],
    furnitureDepreciation: [],
    furnitureTotal: [],
  };

  // Calculate total initial values by category
  const initialTotals = {
    machinery: 0,
    vehicles: 0,
    buildings: 0,
    computerEquipment: 0,
    furniture: 0,
  };

  if (assetsConfig.assets && assetsConfig.assets.length > 0) {
    for (const asset of assetsConfig.assets) {
      const cost = sanitizeNumber(asset.cost) * sanitizeNumber(asset.amount);
      const category = asset.category;
      if (initialTotals[category] !== undefined) {
        initialTotals[category] += cost;
      }
    }
  }

  // Get depreciation rates (annual, as decimals)
  const rates = premises.depreciationRates || {};
  const monthlyRates = {
    machinery: (sanitizeNumber(rates.machinery) || 0.1) / 12,
    vehicles: (sanitizeNumber(rates.vehicle) || 0.25) / 12,
    buildings: (sanitizeNumber(rates.building) || 0.05) / 12,
    computerEquipment: (sanitizeNumber(rates.computerEquipment) || 0.3) / 12,
    furniture: (sanitizeNumber(rates.furniture) || 0.1) / 12,
  };

  // Track remaining values for each category
  const remainingValues = {
    machinery: initialTotals.machinery,
    vehicles: initialTotals.vehicles,
    buildings: initialTotals.buildings,
    computerEquipment: initialTotals.computerEquipment,
    furniture: initialTotals.furniture,
  };

  // Calculate depreciation for each month
  for (let month = 0; month < totalMonths; month++) {
    // Machinery - constant monthly depreciation based on initial value
    const machineryMonthlyDep = initialTotals.machinery * monthlyRates.machinery;
    const machineryDepThisMonth = remainingValues.machinery > 0 
      ? Math.min(remainingValues.machinery, machineryMonthlyDep)
      : 0;
    depreciation.machineryDepreciation.push(Math.round(machineryDepThisMonth * 100) / 100);
    remainingValues.machinery = Math.max(0, remainingValues.machinery - machineryDepThisMonth);
    depreciation.machineryTotal.push(Math.round(remainingValues.machinery * 100) / 100);
    
    // Vehicles
    const vehiclesMonthlyDep = initialTotals.vehicles * monthlyRates.vehicles;
    const vehiclesDepThisMonth = remainingValues.vehicles > 0 
      ? Math.min(remainingValues.vehicles, vehiclesMonthlyDep)
      : 0;
    depreciation.vehiclesDepreciation.push(Math.round(vehiclesDepThisMonth * 100) / 100);
    remainingValues.vehicles = Math.max(0, remainingValues.vehicles - vehiclesDepThisMonth);
    depreciation.vehiclesTotal.push(Math.round(remainingValues.vehicles * 100) / 100);
    
    // Buildings
    const buildingsMonthlyDep = initialTotals.buildings * monthlyRates.buildings;
    const buildingsDepThisMonth = remainingValues.buildings > 0 
      ? Math.min(remainingValues.buildings, buildingsMonthlyDep)
      : 0;
    depreciation.buildingsDepreciation.push(Math.round(buildingsDepThisMonth * 100) / 100);
    remainingValues.buildings = Math.max(0, remainingValues.buildings - buildingsDepThisMonth);
    depreciation.buildingsTotal.push(Math.round(remainingValues.buildings * 100) / 100);
    
    // Computer Equipment
    const computerEquipmentMonthlyDep = initialTotals.computerEquipment * monthlyRates.computerEquipment;
    const computerEquipmentDepThisMonth = remainingValues.computerEquipment > 0 
      ? Math.min(remainingValues.computerEquipment, computerEquipmentMonthlyDep)
      : 0;
    depreciation.computerEquipmentDepreciation.push(Math.round(computerEquipmentDepThisMonth * 100) / 100);
    remainingValues.computerEquipment = Math.max(0, remainingValues.computerEquipment - computerEquipmentDepThisMonth);
    depreciation.computerEquipmentTotal.push(Math.round(remainingValues.computerEquipment * 100) / 100);
    
    // Furniture
    const furnitureMonthlyDep = initialTotals.furniture * monthlyRates.furniture;
    const furnitureDepThisMonth = remainingValues.furniture > 0 
      ? Math.min(remainingValues.furniture, furnitureMonthlyDep)
      : 0;
    depreciation.furnitureDepreciation.push(Math.round(furnitureDepThisMonth * 100) / 100);
    remainingValues.furniture = Math.max(0, remainingValues.furniture - furnitureDepThisMonth);
    depreciation.furnitureTotal.push(Math.round(remainingValues.furniture * 100) / 100);
  }

  return depreciation;
}

/**
 * Derive expenses over time using selected forecasting method
 * @param {Array} fixedExpenses - CBM.expenses.fixedExpenses
 * @param {Array} variableExpenses - CBM.expenses.variableExpenses
 * @param {string} forecastMethod - 'inflation', 'static', or 'production'
 * @param {number} totalMonths - Total number of months to project
 * @param {number} inflationRate - Annual inflation rate (as decimal)
 * @param {Array} productionData - Optional production data for 'production' method
 * @returns {Array} Array of {name, cost: [...]}
 */
export function deriveExpenses(fixedExpenses, variableExpenses, forecastMethod, totalMonths, inflationRate, productionData = null) {
  const derivedExpenses = [];
  const monthlyInflation = inflationRate / 12;

  // Process fixed expenses
  for (const expense of fixedExpenses) {
    const initialCost = sanitizeNumber(expense.cost);
    const costArray = [];

    for (let month = 0; month < totalMonths; month++) {
      let cost;
      switch (forecastMethod) {
        case 'inflation':
          cost = initialCost * Math.pow(1 + monthlyInflation, month);
          break;
        case 'static':
          cost = initialCost;
          break;
        case 'production':
          // Variable based on production volume
          const productionFactor = productionData && productionData[month] ? productionData[month] / (productionData[0] || 1) : 1;
          cost = initialCost * productionFactor;
          break;
        default:
          cost = initialCost;
      }
      costArray.push(Math.round(cost * 100) / 100);
    }

    derivedExpenses.push({
      name: expense.name,
      cost: costArray,
      type: 'fixed',
    });
  }

  // Process variable expenses
  for (const expense of variableExpenses) {
    const initialCost = sanitizeNumber(expense.cost);
    const costArray = [];

    for (let month = 0; month < totalMonths; month++) {
      let cost;
      // Variable expenses always scale with some factor
      switch (forecastMethod) {
        case 'inflation':
          cost = initialCost * Math.pow(1 + monthlyInflation, month);
          break;
        case 'production':
          const productionFactor = productionData && productionData[month] ? productionData[month] / (productionData[0] || 1) : 1;
          cost = initialCost * productionFactor;
          break;
        default:
          cost = initialCost;
      }
      costArray.push(Math.round(cost * 100) / 100);
    }

    derivedExpenses.push({
      name: expense.name,
      cost: costArray,
      type: 'variable',
    });
  }

  return derivedExpenses;
}

/**
 * Derive financing payments (amortization and interest) over time for multiple loans
 * @param {Array} loans - Array of loan objects from CBM.financing.loans
 * @param {number} totalMonths - Total number of months to project
 * @returns {Array} Array of {name, amortization: [...], interest: [...], remaining: [...]}
 */
export function deriveFinancingPayments(loans, totalMonths) {
  const derivedLoans = [];

  for (const loan of loans) {
    const { 
      name = 'Loan', 
      amount = 0, 
      periods = 0, 
      rate = 0,
      period = 0 // Starting period for this loan
    } = loan;
    
    const loanAmount = sanitizeNumber(amount);
    const loanPeriods = sanitizeNumber(periods);
    const monthlyRate = sanitizeNumber(rate) / 12; // Convert annual to monthly
    const startPeriod = sanitizeNumber(period);

    // Initialize arrays with zeros
    const amortizationArray = Array(totalMonths).fill(0);
    const interestArray = Array(totalMonths).fill(0);
    const remainingArray = Array(totalMonths).fill(0);

    if (loanAmount === 0 || loanPeriods === 0) {
      derivedLoans.push({
        name,
        amortization: amortizationArray,
        interest: interestArray,
        remaining: remainingArray,
      });
      continue;
    }

    // Calculate monthly amortization (constant principal payment)
    const monthlyAmortization = loanAmount / loanPeriods;
    let remainingBalance = loanAmount;

    // Fill arrays starting from the loan's start period
    for (let month = 0; month < totalMonths; month++) {
      if (month < startPeriod) {
        // Loan hasn't started yet
        remainingArray[month] = 0;
        continue;
      }

      const monthsSinceLoanStart = month - startPeriod;

      if (monthsSinceLoanStart < loanPeriods && remainingBalance > 0) {
        // Loan is active
        const interestPayment = remainingBalance * monthlyRate;
        
        interestArray[month] = Math.round(interestPayment * 100) / 100;
        amortizationArray[month] = Math.round(monthlyAmortization * 100) / 100;
        
        remainingBalance = Math.max(0, remainingBalance - monthlyAmortization);
        remainingArray[month] = Math.round(remainingBalance * 100) / 100;
      } else {
        // Loan is paid off
        remainingArray[month] = 0;
      }
    }

    derivedLoans.push({
      name,
      amortization: amortizationArray,
      interest: interestArray,
      remaining: remainingArray,
    });
  }

  return derivedLoans;
}