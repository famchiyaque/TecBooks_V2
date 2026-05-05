/**
 * Forecasting Calculations
 * 
 * Statistical forecasting methods for projecting future values.
 * This is a simplified version - can be expanded with more sophisticated methods.
 */

import { sanitizeNumber } from '../models/schemas.js';

/**
 * Calculate simple moving average
 * @param {number[]} data - Historical data
 * @param {number} periods - Number of periods to average
 * @returns {number} Moving average value
 */
export function calculateMovingAverage(data, periods) {
  if (data.length < periods) return 0;
  
  const slice = data.slice(-periods);
  const sum = slice.reduce((acc, val) => acc + sanitizeNumber(val), 0);
  return sum / periods;
}

/**
 * Calculate exponential smoothing forecast
 * @param {number[]} data - Historical data
 * @param {number} alpha - Smoothing factor (0-1)
 * @returns {number} Forecasted value
 */
export function calculateExponentialSmoothing(data, alpha = 0.3) {
  if (data.length === 0) return 0;
  
  let forecast = sanitizeNumber(data[0]);
  
  for (let i = 1; i < data.length; i++) {
    forecast = alpha * sanitizeNumber(data[i]) + (1 - alpha) * forecast;
  }
  
  return forecast;
}

/**
 * Calculate linear regression forecast
 * @param {number[]} data - Historical data
 * @param {number} periodsAhead - Number of periods to forecast ahead
 * @returns {number} Forecasted value
 */
export function calculateLinearRegression(data, periodsAhead = 1) {
  const n = data.length;
  if (n < 2) return data[0] || 0;
  
  // Calculate means
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((sum, val) => sum + sanitizeNumber(val), 0) / n;
  
  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = sanitizeNumber(data[i]);
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) * (x - xMean);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;
  
  // Forecast
  const forecastX = n - 1 + periodsAhead;
  return slope * forecastX + intercept;
}

/**
 * Calculate growth rate
 * @param {number[]} data - Historical data
 * @returns {number} Average growth rate as percentage
 */
export function calculateGrowthRate(data) {
  if (data.length < 2) return 0;
  
  const growthRates = [];
  
  for (let i = 1; i < data.length; i++) {
    const previous = sanitizeNumber(data[i - 1]);
    const current = sanitizeNumber(data[i]);
    
    if (previous !== 0) {
      const rate = ((current - previous) / previous) * 100;
      growthRates.push(rate);
    }
  }
  
  if (growthRates.length === 0) return 0;
  
  const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  return avgGrowthRate;
}

/**
 * Forecast future values using specified method
 * @param {number[]} historicalData - Historical data
 * @param {number} periodsAhead - Number of periods to forecast
 * @param {string} method - Forecasting method ('moving_average', 'exponential', 'linear', 'growth')
 * @param {Object} options - Method-specific options
 * @returns {number[]} Array of forecasted values
 */
export function forecastFuture(historicalData, periodsAhead, method = 'linear', options = {}) {
  const forecasts = [];
  
  for (let i = 1; i <= periodsAhead; i++) {
    let forecast = 0;
    
    switch (method) {
      case 'moving_average':
        forecast = calculateMovingAverage(historicalData, options.periods || 3);
        break;
        
      case 'exponential':
        forecast = calculateExponentialSmoothing(historicalData, options.alpha || 0.3);
        break;
        
      case 'linear':
        forecast = calculateLinearRegression(historicalData, i);
        break;
        
      case 'growth':
        const growthRate = calculateGrowthRate(historicalData);
        const lastValue = sanitizeNumber(historicalData[historicalData.length - 1]);
        forecast = lastValue * Math.pow(1 + growthRate / 100, i);
        break;
        
      default:
        forecast = calculateLinearRegression(historicalData, i);
    }
    
    forecasts.push(Math.max(0, forecast)); // Ensure non-negative
  }
  
  return forecasts;
}
