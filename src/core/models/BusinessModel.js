import { countries } from './countries.js';
import { premises } from './premises.js';
import { laborBenefits } from './employeeBenefits.js';

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
    //////////////////////////////////////////////////
    //---------------- User Inputs -----------------//
    //////////////////////////////////////////////////
    
    // Business Metadata
    metadata: {
      name: '',
      type: '', // 'manufacturing', 'services', 'retail', etc.
      country: '',
      countryData: countries[model.metadata.country], // 'mexico', 'usa', etc.
      startDate: null, // Date object or ISO string; start of operation
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
      // universal fields
      ...premises[model.metadata.country],

      // user-based
      initialInvestment: 0,
      rewardMargin: 0, // Reward margin for TREMA calculation
    },

    // Bills of Materials (Products and their components)
    boms: {
      availableForecastingMethods: ['inflation'],
      forecastingMethod: '', // 'inflation'
      products: [
        // {
        //   name: 'Product Name',
        //   salesPrice: 0,
        //   parts: [
        //     { name: 'Part 1', quantity: 0, cost: 0, subtotal: 0 }
        //   ]
        // }
      ],
    },

    // Demand
    demand: {
      availableForecastingMethods: ['slr', 'dlr', 'sma', 'dma', 'ses', 'des', 'winters'],
      ordersForecastMethod: '', // 'slr', 'sma', 'ses', 'winters'
      monthlyTendency: [], // [0.9, 1.1, 1.2, ...]
      previousYearsDemand: [], // [{ year: 2025, month: 1, orders: 100 }]
      yearZeroDemand: [], // [{ month: 1, orders: 100 }]
    },

    // Production Parameters
    production: {
      availableForecastingMethods: ['log'],
      forecastingMethod: '', // 'log',
      lines: [
        // {
        //   name: '',
        //   qualityYield: 0,
        //   productAssociated: '',
        //   qualityImprovementRate: 0,
        //   utilizationRate: 0,
        //   processes: [
        //     {
        //       name: '',
        //       durationMinutes: 0,
        //       numberOfWorkers: 0,
        //       unitsPerHour: 0,
        //     }
        //   ],
        //   numberOfShifts: 0,
        //   hoursPerShift: 0,
        //   daysPerWeek: 0,
        //   weeksPerYear: 0,
        // }
      ],
    },

    // Assets
    assets: {
      categories: [
        'machinery', 'vehicles', 'buildings', 'computerEquipment', 'furniture'
      ],
      assets: [
        {
          name: '',
          category: '',
          cost: 0,
          dateOfPurchase: null, // Date object or ISO string
          amount: 0,
        }
      ],
    },

    // Workforce
    workforce: {
      categories: [
        'direct', 'indirect', 'engineering', 'administrative'
      ],
      employees: [
        {
          title: '',
          category: '',
          amount: 0,
          baseSalary: 0,
          laborBenefits: laborBenefits[model.metadata.country],
        }
      ]
    },

    // Operating Expenses
    expenses: {
      availableForecastingMethods: ['inflation', 'static', 'production'],
      forecastingMethod: '', // 
      fixedExpenses: [
        // {
        //   name: '',
        //   cost: 0,
        // }
      ],
      variablesExpenses: [
        // {
        //   name: '',
        //   cost: 0,
        //   period: 0,
        // }
      ]
    },

    // Financing
    financing: {
      initialInvestment: 0,
      loan: {
        name: '',
        period: 0,
        amount: 0,
        periods: 0,
        rate: 0,
      },
    },

    ////////////////////////////////////////////////////////////
    //-------------------- Derived Values --------------------//
    ////////////////////////////////////////////////////////////

    bomDerived: [
      // {
      //   name: '',
      //   salesPrice: [], // forecasted sales by period prices using inflation
      //   totalCost: [], // forecasted total costs by period using inflation
      // }
    ],

    demandDerived: [
      // {
      //   product: '',
      //   purchaseOrders: [], // forecasted purchase orders by period using chosen statistical method
      // }
    ],

    productionDerived: [
      // {
      //   line: '',
      //   qualityYield: [], // forecasted quality yield by period using quality improvement rate
      //   capacity: [], // forecasted capacity by period using production parameters and quality yield
      //   workOrders: [], // forecasted work orders by period using forecasted purchase orders and quality yield
      // },
    ],

    workforceDerived: {
      // directLaborSalaries: [], // forecasted direct labor salaries by period using inflation
      // indirectLaborSalaries: [], // forecasted indirect labor salaries by period using inflation
      // engineeringSalaries: [], // forecasted engineering salaries by period using inflation
      // administrativeSalaries: [], // forecasted administrative salaries by period using inflation
    },

    assetsDerived: {
      // machineryDepreciation: [], // forecasted machinery depreciation by period using depreciation rate
      // machineryTotal: [], // calculated total machinery value by period  
      // vehiclesDepreciation: [], // forecasted vehicles depreciation by period using depreciation rate
      // vehiclesTotal: [], // calculated total vehicles value by period
      // buildingsDepreciation: [], // forecasted buildings depreciation by period using depreciation rate
      // buildingsTotal: [], // calculated total buildings value by period
      // computerEquipmentDepreciation: [], // forecasted computer equipment depreciation by period using depreciation rate
      // computerEquipmentTotal: [], // calculated total computer equipment value by period
      // furnitureDepreciation: [], // forecasted furniture depreciation by period using depreciation rate
      // furnitureTotal: [], // calculated total furniture value by period
    },

    expensesDerived: [
      // {
      //   name: '',
      //   cost: [], // forecasted cost by period using inflation, static, or production forecasting method
      // }
    ],

    financingDerived: [
      // {
      //   name: '',
      //   amortization: [], // forecasted amortization by period using loan amount, periods, and rate
      //   interest: [], // forecasted interest by period using loan amount, periods, and rate
      // }
    ],

    ////////////////////////////////////////////////////////////
    //-------------------- Final Values --------------------//
    ////////////////////////////////////////////////////////////

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
