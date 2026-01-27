/**
 * MxRep Adapter
 * 
 * Transforms MxRep production simulator data into the canonical business model format.
 * This adapter handles data from the MxRep production line game/simulator.
 */

import { createEmptyBusinessModel, mergeAdditionalData } from '../models/BusinessModel.js';
import { sanitizeNumber } from '../models/schemas.js';

/**
 * Transform MxRep simulation data to canonical business model
 * @param {Object} simData - Data from MxRep simulator (SimDataContext)
 * @param {Object} options - Additional options for transformation
 * @returns {Object} Canonical business model
 */
export function adaptMxRepToBusinessModel(simData, options = {}) {
  console.log('[MxRepAdapter] Starting transformation to canonical model');
  
  const model = createEmptyBusinessModel();
  
  // Basic metadata
  model.metadata.name = simData.teamName || 'MxRep Team';
  model.metadata.type = 'manufacturing';
  model.metadata.source = 'mxrep';
  model.metadata.startDate = simData.startDate ? new Date(simData.startDate) : new Date();
  
  // Generate timeline based on simulation dates
  const startDate = new Date(simData.startDate);
  const currentDate = new Date(simData.currentDate);
  const months = generateMonthsBetween(startDate, currentDate);
  
  model.timeline.months = months;
  model.timeline.totalMonths = months.length;
  model.timeline.startMonth = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Financial data from simulation
  // Note: This is a simplified version - actual implementation will depend on
  // how MxRep stores financial data in the database
  
  // Revenue (from sales data)
  model.revenue.totals = generateMonthlyArray(
    sanitizeNumber(simData.sales),
    months.length
  );
  
  // Costs (from costs data)
  model.costs.totals = generateMonthlyArray(
    sanitizeNumber(simData.costs),
    months.length
  );
  
  // Expenses (from expenses data)
  model.expenses.totals = generateMonthlyArray(
    sanitizeNumber(simData.expenses),
    months.length
  );
  
  // Project parameters
  model.project.initialInvestment = sanitizeNumber(simData.activoTotal);
  model.project.discountRate = options.discountRate || 10; // Default 10%
  
  // Store MxRep-specific production data in additionalData
  const productionData = {
    availability: simData.availability,
    performance: simData.performance,
    quality: simData.quality,
    productivity: simData.productivity,
    oee: (simData.availability * simData.performance * simData.quality) / 10000,
    workers: simData.workers,
    hoursWorked: simData.hoursWorked,
    totalParts: simData.totalParts,
    goodParts: simData.goodParts,
    actualOutputData: simData.actualOutputData,
    leaderboard: simData.leaderboard,
    placement: simData.placement,
  };
  
  model.additionalData.production = productionData;
  
  console.log('[MxRepAdapter] Transformation complete');
  console.log('[MxRepAdapter] Model summary:', {
    teamName: model.metadata.name,
    months: model.timeline.totalMonths,
    hasProductionData: !!model.additionalData.production,
  });
  
  return model;
}

/**
 * Generate array of month labels between two dates
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {string[]}
 */
function generateMonthsBetween(startDate, endDate) {
  const months = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    months.push(current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

/**
 * Generate a monthly array by distributing a total value
 * @param {number} totalValue 
 * @param {number} monthCount 
 * @returns {number[]}
 */
function generateMonthlyArray(totalValue, monthCount) {
  if (monthCount === 0) return [];
  
  const monthlyValue = totalValue / monthCount;
  return Array(monthCount).fill(monthlyValue);
}

/**
 * Check if MxRep data is valid for transformation
 * @param {Object} simData 
 * @returns {boolean}
 */
export function isMxRepDataValid(simData) {
  return simData && 
         simData.teamName && 
         simData.startDate && 
         simData.currentDate;
}
