/**
 * Canonical Business Model
 * 
 * This is the single source of truth for business data structure.
 * All adapters must transform their input into this format.
 * All calculations in the engine expect this format.
 */

/**
 * Creates an empty canonical business model
 * @returns {CanonicalBusinessModel}
 */
export function createEmptyBusinessModel() {
  return {
    // Business Metadata
    metadata: {
      name: '',
      type: '', // 'manufacturing', 'services', 'retail', etc.
      country: '', // 'mexico', 'usa', etc.
      startDate: null, // Date object or ISO string
      currency: 'MXN',
      createdAt: new Date().toISOString(),
      source: '', // 'excel', 'survey', 'mxrep', etc.
    },

    // Financial Timeline
    timeline: {
      months: [], // Array of month labels ['January 2024', 'February 2024', ...]
      periods: [], // Array of period numbers [1, 2, 3, ...]
      startMonth: null,
      endMonth: null,
      totalMonths: 0,
    },

    // Revenue Streams
    revenue: {
      productsAndServices: {}, // { 'product1': [month1Val, month2Val, ...], 'service1': [...] }
      totals: [], // Total revenue per month
    },

    // Cost Structure
    costs: {
      salaries: {}, // { 'employee1': [month1Val, ...], ... }
      fixedCosts: {}, // { 'rent': [month1Val, ...], 'utilities': [...], ... }
      variableCosts: {}, // { 'raw_materials': [month1Val, ...], ... }
      totals: [], // Total costs per month
    },

    // Operating Expenses
    expenses: {
      salaries: {}, // Administrative salaries
      expenses: {}, // Other operating expenses
      totals: [], // Total expenses per month
    },

    // Capital Structure & Project Parameters
    project: {
      initialInvestment: 0,
      discountRate: 0, // Percentage (e.g., 10 for 10%)
      projectLifetime: 0, // In years or months
      loans: [], // Array of loan objects { amount, rate, term, ... }
      equity: 0,
    },

    // Assets & Depreciation
    assets: {
      property: [], // { name, value, depreciationRate, ... }
      machinery: [],
      technology: [],
      fixtures: [],
      inventory: [],
      depreciation: [], // Monthly depreciation values
    },

    // Accounts
    accounts: {
      receivables: {}, // { 'client1': [month1Val, ...], ... }
      payables: {}, // { 'supplier1': [month1Val, ...], ... }
      months: [], // Months for accounts data
      shouldDisregard: false,
    },

    // Additional context data (for specialized dashboards like MxRep)
    additionalData: {
      // MxRep production data
      production: null,
      // Future: other specialized data
    },
  };
}

/**
 * Validates a business model
 * @param {CanonicalBusinessModel} model 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBusinessModel(model) {
  const errors = [];

  if (!model.metadata?.name) {
    errors.push('Business name is required');
  }

  if (!model.timeline?.months || model.timeline.months.length === 0) {
    errors.push('Timeline must have at least one month');
  }

  if (!model.revenue?.totals || model.revenue.totals.length === 0) {
    errors.push('Revenue data is required');
  }

  // Check that arrays are consistent lengths
  const expectedLength = model.timeline?.months?.length || 0;
  if (model.revenue?.totals?.length !== expectedLength) {
    errors.push('Revenue totals length must match timeline length');
  }

  if (model.costs?.totals?.length !== expectedLength) {
    errors.push('Costs totals length must match timeline length');
  }

  if (model.expenses?.totals?.length !== expectedLength) {
    errors.push('Expenses totals length must match timeline length');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merges additional data into an existing business model
 * @param {CanonicalBusinessModel} model 
 * @param {Object} additionalData 
 * @returns {CanonicalBusinessModel}
 */
export function mergeAdditionalData(model, additionalData) {
  return {
    ...model,
    additionalData: {
      ...model.additionalData,
      ...additionalData,
    },
  };
}

/**
 * Gets a summary of the business model for debugging
 * @param {CanonicalBusinessModel} model 
 * @returns {Object}
 */
export function getModelSummary(model) {
  return {
    businessName: model.metadata?.name,
    type: model.metadata?.type,
    source: model.metadata?.source,
    months: model.timeline?.totalMonths || model.timeline?.months?.length || 0,
    hasRevenue: (model.revenue?.totals?.length || 0) > 0,
    hasCosts: (model.costs?.totals?.length || 0) > 0,
    hasExpenses: (model.expenses?.totals?.length || 0) > 0,
    hasProjectData: model.project?.initialInvestment > 0,
  };
}
