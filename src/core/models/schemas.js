/**
 * Data validation schemas and type definitions
 * 
 * These schemas define the expected structure for different data types
 * used throughout the application.
 */

/**
 * Validates that a value is a valid number (not NaN, not Infinity)
 */
export function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validates that a value is a valid positive number
 */
export function isValidPositiveNumber(value) {
  return isValidNumber(value) && value >= 0;
}

/**
 * Validates an array of numbers
 */
export function validateNumberArray(arr, allowNegative = true) {
  if (!Array.isArray(arr)) return false;
  
  return arr.every(val => {
    if (val === null || val === undefined) return true; // Allow null/undefined
    if (!isValidNumber(val)) return false;
    if (!allowNegative && val < 0) return false;
    return true;
  });
}

/**
 * Validates a date value
 */
export function isValidDate(date) {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }
  return false;
}

/**
 * Validates metadata structure
 */
export function validateMetadata(metadata) {
  const errors = [];

  if (!metadata.name || typeof metadata.name !== 'string') {
    errors.push('Metadata must have a valid name');
  }

  if (!metadata.type || typeof metadata.type !== 'string') {
    errors.push('Metadata must have a valid business type');
  }

  if (metadata.startDate && !isValidDate(metadata.startDate)) {
    errors.push('Start date must be a valid date');
  }

  return errors;
}

/**
 * Validates timeline structure
 */
export function validateTimeline(timeline) {
  const errors = [];

  if (!Array.isArray(timeline.months) || timeline.months.length === 0) {
    errors.push('Timeline must have at least one month');
  }

  if (timeline.totalMonths && timeline.totalMonths !== timeline.months.length) {
    errors.push('Timeline totalMonths must match months array length');
  }

  return errors;
}

/**
 * Validates revenue structure
 */
export function validateRevenue(revenue, expectedLength) {
  const errors = [];

  if (!revenue.totals || !Array.isArray(revenue.totals)) {
    errors.push('Revenue must have totals array');
  } else if (revenue.totals.length !== expectedLength) {
    errors.push(`Revenue totals length (${revenue.totals.length}) must match expected length (${expectedLength})`);
  } else if (!validateNumberArray(revenue.totals, false)) {
    errors.push('Revenue totals must be valid positive numbers');
  }

  if (revenue.productsAndServices) {
    Object.entries(revenue.productsAndServices).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length !== expectedLength) {
        errors.push(`Revenue product/service "${key}" must have ${expectedLength} values`);
      }
    });
  }

  return errors;
}

/**
 * Validates costs structure
 */
export function validateCosts(costs, expectedLength) {
  const errors = [];

  if (!costs.totals || !Array.isArray(costs.totals)) {
    errors.push('Costs must have totals array');
  } else if (costs.totals.length !== expectedLength) {
    errors.push(`Costs totals length must match expected length (${expectedLength})`);
  }

  return errors;
}

/**
 * Validates expenses structure
 */
export function validateExpenses(expenses, expectedLength) {
  const errors = [];

  if (!expenses.totals || !Array.isArray(expenses.totals)) {
    errors.push('Expenses must have totals array');
  } else if (expenses.totals.length !== expectedLength) {
    errors.push(`Expenses totals length must match expected length (${expectedLength})`);
  }

  return errors;
}

/**
 * Validates project parameters
 */
export function validateProject(project) {
  const errors = [];

  if (project.initialInvestment !== undefined && !isValidPositiveNumber(project.initialInvestment)) {
    errors.push('Initial investment must be a valid positive number');
  }

  if (project.discountRate !== undefined && !isValidNumber(project.discountRate)) {
    errors.push('Discount rate must be a valid number');
  }

  if (project.projectLifetime !== undefined && !isValidPositiveNumber(project.projectLifetime)) {
    errors.push('Project lifetime must be a valid positive number');
  }

  return errors;
}

/**
 * Sanitizes a number value, converting null/undefined to 0
 */
export function sanitizeNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isValidNumber(num) ? num : defaultValue;
}

/**
 * Sanitizes an array of numbers
 */
export function sanitizeNumberArray(arr, defaultValue = 0) {
  if (!Array.isArray(arr)) return [];
  return arr.map(val => sanitizeNumber(val, defaultValue));
}
