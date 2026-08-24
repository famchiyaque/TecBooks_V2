/**
 * Shared numeric helpers for adapters and dashboard calculations.
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
 * Sanitizes a number value, converting null/undefined to default
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
