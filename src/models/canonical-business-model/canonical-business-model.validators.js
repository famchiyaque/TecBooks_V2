import {
  isValidNumber,
  isValidPositiveNumber,
  validateNumberArray,
} from '@/utils/number.utils.js'

/**
 * Validates a date value
 */
export function isValidDate(date) {
  if (date instanceof Date) {
    return !isNaN(date.getTime())
  }
  if (typeof date === 'string') {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }
  return false
}

/**
 * Validates metadata structure
 */
export function validateMetadata(metadata) {
  const errors = []

  if (!metadata.name || typeof metadata.name !== 'string') {
    errors.push('Metadata must have a valid name')
  }

  if (!metadata.type || typeof metadata.type !== 'string') {
    errors.push('Metadata must have a valid business type')
  }

  if (metadata.startDate && !isValidDate(metadata.startDate)) {
    errors.push('Start date must be a valid date')
  }

  return errors
}

/**
 * Validates timeline structure
 */
export function validateTimeline(timeline) {
  const errors = []

  if (!Array.isArray(timeline.months) || timeline.months.length === 0) {
    errors.push('Timeline must have at least one month')
  }

  if (timeline.totalMonths && timeline.months?.length && timeline.totalMonths !== timeline.months.length) {
    errors.push('Timeline totalMonths must match months array length')
  }

  return errors
}

/**
 * Validates revenue structure
 */
export function validateRevenue(revenue, expectedLength) {
  const errors = []

  if (!revenue.totals || !Array.isArray(revenue.totals)) {
    errors.push('Revenue must have totals array')
  } else if (revenue.totals.length !== expectedLength) {
    errors.push(`Revenue totals length (${revenue.totals.length}) must match expected length (${expectedLength})`)
  } else if (!validateNumberArray(revenue.totals, false)) {
    errors.push('Revenue totals must be valid positive numbers')
  }

  if (revenue.productsAndServices) {
    Object.entries(revenue.productsAndServices).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length !== expectedLength) {
        errors.push(`Revenue product/service "${key}" must have ${expectedLength} values`)
      }
    })
  }

  return errors
}

/**
 * Validates costs structure
 */
export function validateCosts(costs, expectedLength) {
  const errors = []

  if (!costs.totals || !Array.isArray(costs.totals)) {
    errors.push('Costs must have totals array')
  } else if (costs.totals.length !== expectedLength) {
    errors.push('Costs totals length must match expected length')
  }

  return errors
}

/**
 * Validates expenses structure
 */
export function validateExpenses(expenses, expectedLength) {
  const errors = []

  if (!expenses.totals || !Array.isArray(expenses.totals)) {
    errors.push('Expenses must have totals array')
  } else if (expenses.totals.length !== expectedLength) {
    errors.push('Expenses totals length must match expected length')
  }

  return errors
}

/**
 * Validates project parameters
 */
export function validateProject(project) {
  const errors = []

  if (project.initialInvestment !== undefined && !isValidPositiveNumber(project.initialInvestment)) {
    errors.push('Initial investment must be a valid positive number')
  }

  if (project.discountRate !== undefined && !isValidNumber(project.discountRate)) {
    errors.push('Discount rate must be a valid number')
  }

  if (project.projectLifetime !== undefined && !isValidPositiveNumber(project.projectLifetime)) {
    errors.push('Project lifetime must be a valid positive number')
  }

  return errors
}

/**
 * Validates a canonical business model against the CBM contract.
 * @param {Object} model
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCanonicalBusinessModel(model) {
  const errors = []

  if (!model) return { valid: false, errors: ['Model is required'] }

  errors.push(...validateMetadata(model.metadata || {}))

  if (!model.metadata?.country) {
    errors.push('Country is required')
  }

  if (model.timeline) {
    errors.push(...validateTimeline(model.timeline))
    const monthsLen = model.timeline.months?.length ?? 0
    const periodsLen = model.timeline.periods?.length ?? 0
    if (periodsLen > 0 && monthsLen > 0 && periodsLen !== monthsLen) {
      errors.push('Timeline periods length must match months length')
    }
  }

  if (model.metadata?.type === 'manufacturing') {
    const products = model.boms?.products
    if (!Array.isArray(products) || products.length === 0) {
      errors.push('Manufacturing business must have at least one BOM product')
    }
    const lines = model.production?.lines
    if (!Array.isArray(lines) || lines.length === 0) {
      errors.push('Manufacturing business must have at least one production line')
    }
  }

  // Soft check: if revenue.totals exists and timeline has length, lengths should match
  const expected = model.timeline?.totalMonths || model.timeline?.months?.length
  if (expected && model.revenue?.totals?.length && model.revenue.totals.length !== expected) {
    errors.push(`Revenue totals length must match timeline (${expected})`)
  }

  return { valid: errors.length === 0, errors }
}
