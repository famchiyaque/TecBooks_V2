/**
 * Derivations Engine
 * 
 * Transforms input values into period-by-period projected arrays (derived values).
 * These derived values are then used by the evaluations engine to compute final metrics.
 */

import { forecastFuture, calculateLinearRegression } from './forecasts.js';
import { sanitizeNumber } from '../models/schemas.js';

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
 * @returns {Array} Array of {product, purchaseOrders: [...]}
 */
export function deriveDemand(demandConfig, totalMonths) {
  const { 
    ordersForecastMethod = 'slr',
    previousYearsDemand = [], 
    yearZeroDemand = [],
    monthlyTendency = []
  } = demandConfig;

  // Start with yearZero data (actual historical data from startup)
  const purchaseOrders = yearZeroDemand.map(d => sanitizeNumber(d.orders));
  
  // Combine all historical data for forecasting: previousYears + yearZero
  const historicalOrders = [
    ...previousYearsDemand.map(d => sanitizeNumber(d.orders)),
    ...yearZeroDemand.map(d => sanitizeNumber(d.orders))
  ];

  // Calculate how many months we still need to forecast
  const monthsToForecast = totalMonths - purchaseOrders.length;
  
  if (monthsToForecast <= 0) {
    // We already have enough data
    return [{
      product: 'default',
      purchaseOrders: purchaseOrders.slice(0, totalMonths)
    }];
  }

  // If no historical data, use a default starting value
  const startingOrders = historicalOrders.length > 0 
    ? historicalOrders[historicalOrders.length - 1] 
    : 100;

  // Forecast the remaining months
  const forecastedOrders = [];
  
  switch (ordersForecastMethod) {
    case 'slr': // Simple Linear Regression
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = calculateLinearRegression(historicalOrders.length > 0 ? historicalOrders : [startingOrders], month);
        forecastedOrders.push(Math.max(0, forecast));
      }
      break;

    case 'sma': // Simple Moving Average
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(historicalOrders.length > 0 ? historicalOrders : [startingOrders], 1, 'moving_average', { periods: 3 });
        forecastedOrders.push(Math.max(0, forecast[0]));
      }
      break;

    case 'ses': // Simple Exponential Smoothing
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(historicalOrders.length > 0 ? historicalOrders : [startingOrders], 1, 'exponential', { alpha: 0.3 });
        forecastedOrders.push(Math.max(0, forecast[0]));
      }
      break;

    case 'winters': // Winters method (simplified - using exponential)
      for (let month = 1; month <= monthsToForecast; month++) {
        const forecast = forecastFuture(historicalOrders.length > 0 ? historicalOrders : [startingOrders], 1, 'exponential', { alpha: 0.3 });
        // Apply seasonal tendency if available
        const monthIndex = (purchaseOrders.length + month - 1) % 12;
        const tendencyFactor = monthlyTendency.length > 0 ? sanitizeNumber(monthlyTendency[monthIndex]) : 1;
        forecastedOrders.push(Math.max(0, forecast[0] * tendencyFactor));
      }
      break;

    default:
      // Fallback: flat projection
      for (let month = 0; month < monthsToForecast; month++) {
        forecastedOrders.push(startingOrders);
      }
  }

  // Combine yearZero data + forecasted data
  const allOrders = [...purchaseOrders, ...forecastedOrders];

  // Return single product for now (can be expanded for multiple products)
  return [{
    product: 'default',
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

      // Capacity = unitsPerHour * hoursPerShift * shifts * daysPerWeek * weeksPerMonth
      const capacity = unitsPerHour * hoursPerShift * numberOfShifts * daysPerWeek * weeksPerMonth;
      const roundedCapacity = Math.round(capacity * 100) / 100; // Round to 2 decimals
      capacityArray.push(roundedCapacity);

      // Work orders = purchaseOrders / qualityYield (how many we need to produce to get desired output)
      let workOrders = 0;
      if (purchaseOrders[month]) {
        workOrders = qualityYield > 0 ? purchaseOrders[month] / qualityYield : 0;
      }
      workOrders = Math.round(workOrders * 100) / 100; // Round to 2 decimals
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

  // Get initial salaries by category from config
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

  // Calculate total values by category
  const totals = {
    machinery: 0,
    vehicles: 0,
    buildings: 0,
    computerEquipment: 0,
    furniture: 0,
  };

  for (const asset of assetsConfig.assets) {
    const cost = sanitizeNumber(asset.cost) * sanitizeNumber(asset.amount);
    const category = asset.category;
    if (totals[category] !== undefined) {
      totals[category] += cost;
    }
  }

  // Get depreciation rates (annual, as decimals)
  const rates = premises.depreciationRates || {};
  const monthlyRates = {
    machinery: (rates.machinery || 0.1) / 12,
    vehicles: (rates.vehicle || 0.25) / 12,
    buildings: (rates.building || 0.05) / 12,
    computerEquipment: (rates.computerEquipment || 0.3) / 12,
    furniture: (rates.furniture || 0.1) / 12,
  };

  // Calculate depreciation for each month
  for (let month = 0; month < totalMonths; month++) {
    // Straight-line depreciation
    depreciation.machineryDepreciation.push(totals.machinery * monthlyRates.machinery);
    depreciation.machineryTotal.push(Math.max(0, totals.machinery - (totals.machinery * monthlyRates.machinery * month)));
    
    depreciation.vehiclesDepreciation.push(totals.vehicles * monthlyRates.vehicles);
    depreciation.vehiclesTotal.push(Math.max(0, totals.vehicles - (totals.vehicles * monthlyRates.vehicles * month)));
    
    depreciation.buildingsDepreciation.push(totals.buildings * monthlyRates.buildings);
    depreciation.buildingsTotal.push(Math.max(0, totals.buildings - (totals.buildings * monthlyRates.buildings * month)));
    
    depreciation.computerEquipmentDepreciation.push(totals.computerEquipment * monthlyRates.computerEquipment);
    depreciation.computerEquipmentTotal.push(Math.max(0, totals.computerEquipment - (totals.computerEquipment * monthlyRates.computerEquipment * month)));
    
    depreciation.furnitureDepreciation.push(totals.furniture * monthlyRates.furniture);
    depreciation.furnitureTotal.push(Math.max(0, totals.furniture - (totals.furniture * monthlyRates.furniture * month)));
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
      switch (forecastMethod) {
        case 'inflation':
          costArray.push(initialCost * Math.pow(1 + monthlyInflation, month));
          break;
        case 'static':
          costArray.push(initialCost);
          break;
        case 'production':
          // Variable based on production volume
          const productionFactor = productionData && productionData[month] ? productionData[month] / (productionData[0] || 1) : 1;
          costArray.push(initialCost * productionFactor);
          break;
        default:
          costArray.push(initialCost);
      }
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
      // Variable expenses always scale with some factor
      switch (forecastMethod) {
        case 'inflation':
          costArray.push(initialCost * Math.pow(1 + monthlyInflation, month));
          break;
        case 'production':
          const productionFactor = productionData && productionData[month] ? productionData[month] / (productionData[0] || 1) : 1;
          costArray.push(initialCost * productionFactor);
          break;
        default:
          costArray.push(initialCost);
      }
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
 * Derive financing payments (amortization and interest) over time
 * @param {Object} loanConfig - CBM.financing.loan
 * @param {number} totalMonths - Total number of months to project
 * @returns {Array} Array of {name, amortization: [...], interest: [...]}
 */
export function deriveFinancingPayments(loanConfig, totalMonths) {
  const { amount = 0, periods = 0, rate = 0, name = 'Loan' } = loanConfig;
  
  const loanAmount = sanitizeNumber(amount);
  const loanPeriods = sanitizeNumber(periods);
  const monthlyRate = sanitizeNumber(rate) / 12; // Convert annual to monthly

  if (loanAmount === 0 || loanPeriods === 0) {
    return [{
      name,
      amortization: Array(totalMonths).fill(0),
      interest: Array(totalMonths).fill(0),
    }];
  }

  // Calculate monthly payment using amortization formula
  const monthlyPayment = loanPeriods > 0 && monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanPeriods)) / 
      (Math.pow(1 + monthlyRate, loanPeriods) - 1)
    : loanAmount / loanPeriods;

  const amortizationArray = [];
  const interestArray = [];
  let remainingBalance = loanAmount;

  for (let month = 0; month < totalMonths; month++) {
    if (month < loanPeriods && remainingBalance > 0) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      interestArray.push(interestPayment);
      amortizationArray.push(principalPayment);
      
      remainingBalance -= principalPayment;
    } else {
      interestArray.push(0);
      amortizationArray.push(0);
    }
  }

  return [{
    name,
    amortization: amortizationArray,
    interest: interestArray,
  }];
}