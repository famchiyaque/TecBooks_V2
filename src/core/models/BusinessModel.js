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

    // Premises (Financial Assumptions & Rates)
    premises: {
      interestRate: 0,
      inflationRate: 0,
      businessIncomeTax: 0,
      employeeShareOfProfit: 0, // PTU
      cetes: 0, // CETES rate (Mexico)
      rewardMargin: 0, // Reward margin for TREMA calculation
      trema: 0, // Calculated: CETES + Reward Margin + Inflation
      inventoryPercentage: 0,
      providerPercentage: 0,
      shortTermPassive: 0,
      directProductCosts: 0,
      indirectProductCosts: 0,
      salesExpenses: 0,
      administrationPercentage: 0,
      depreciationRates: {
        building: 0,
        machinery: 0,
        vehicle: 0,
        computerEquipment: 0,
      },
      machineryInstallationRate: 0,
      qualityImprovementRate: 0,
      utilizationRate: 0,
      laborBenefits: {
        imss: 0,
        infonavit: 0,
        valesDespensa: 0,
        aguinaldo: 0,
        fondoAhorro: 0,
        comedor: 0,
      },
    },

    // Bills of Materials (Products and their components)
    boms: [
      // {
      //   name: 'Product Name',
      //   salesPrice: 0,
      //   parts: [
      //     { name: 'Part 1', quantity: 0, cost: 0, subtotal: 0 }
      //   ]
      // }
    ],

    // Assets
    assets: {
      machinery: [], // [{ name: 'Machine 1', cost: 0 }]
      vehicles: [], // [{ name: 'Vehicle 1', cost: 0 }]
      buildings: [], // [{ name: 'Building 1', cost: 0 }]
      computerEquipment: [], // [{ name: 'Computer 1', cost: 0 }]
      depreciation: [], // Monthly depreciation values (calculated)
      totalMachinery: 0,
      totalVehicles: 0,
      totalBuildings: 0,
      totalComputerEquipment: 0,
      totalAssets: 0,
    },

    // Production Parameters
    production: {
      qualityYield: 0,
      unitsPerHour: 0,
      hoursPerShift: 0,
      numberOfShifts: 0,
      numberOfLines: 0,
      daysPerWeek: 0,
      weeksPerMonth: 0,
      monthsPerYear: 0,
      // Demand
      firstYearDemand: {
        units: 0,
        months: 0, // Number of months (incomplete year)
      },
      firstFullYearDemand: {
        units: 0,
        months: 12,
      },
    },

    // Workforce
    workforce: {
      directLaborSalaries: 0, // Monthly
      indirectLaborSalaries: 0, // Monthly
      engineeringSalaries: 0, // Monthly
      administrativeSalaries: 0, // Monthly
      totalMonthlySalaries: 0,
    },

    // Operating Expenses
    expenses: [
      // { name: 'Expense 1', monthlyCost: 0 }
    ],

    // Financing
    financing: {
      initialInvestment: 0,
      loan: {
        amount: 0,
        periods: 0,
        interestRate: 0,
      },
    },

    // Revenue Streams (for compatibility with existing engine)
    revenue: {
      productsAndServices: {}, // { 'product1': [month1Val, month2Val, ...], 'service1': [...] }
      totals: [], // Total revenue per month
    },

    // Cost Structure (for compatibility with existing engine)
    costs: {
      salaries: {}, // { 'employee1': [month1Val, ...], ... }
      fixedCosts: {}, // { 'rent': [month1Val, ...], 'utilities': [...], ... }
      variableCosts: {}, // { 'raw_materials': [month1Val, ...], ... }
      totals: [], // Total costs per month
    },

    // Operating Expenses (for compatibility with existing engine)
    operatingExpenses: {
      salaries: {}, // Administrative salaries
      expenses: {}, // Other operating expenses
      totals: [], // Total expenses per month
    },

    // Capital Structure & Project Parameters (for compatibility)
    project: {
      initialInvestment: 0,
      discountRate: 0, // Percentage (e.g., 10 for 10%)
      projectLifetime: 0, // In years or months
      loans: [], // Array of loan objects { amount, rate, term, ... }
      equity: 0,
    },

    // Accounts (optional)
    accounts: {
      receivables: {}, // { 'client1': [month1Val, ...], ... }
      payables: {}, // { 'supplier1': [month1Val, ...], ... }
      months: [], // Months for accounts data
      shouldDisregard: false,
    },

    // Additional context data (for specialized dashboards)
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

  if (!model.metadata?.type) {
    errors.push('Business type is required');
  }

  if (!model.metadata?.country) {
    errors.push('Country is required');
  }

  // For manufacturing templates, validate manufacturing-specific fields
  if (model.metadata?.type === 'manufacturing') {
    if (!model.boms || model.boms.length === 0) {
      errors.push('Manufacturing business must have at least one BOM');
    }

    if (!model.production?.qualityYield) {
      errors.push('Production parameters are required for manufacturing');
    }
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
    country: model.metadata?.country,
    source: model.metadata?.source,
    months: model.timeline?.totalMonths || model.timeline?.months?.length || 0,
    hasBOMs: (model.boms?.length || 0) > 0,
    hasAssets: model.assets?.totalAssets > 0,
    hasFinancing: model.financing?.initialInvestment > 0,
    numberOfProducts: model.boms?.length || 0,
    totalAssets: model.assets?.totalAssets || 0,
  };
}
