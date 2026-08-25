import { countries } from '@/config/business/countries.config.js'
import { premises } from '@/config/business/premises.config.js'
import { laborBenefits } from '@/config/business/employee-benefits.config.js'

/**
 * Canonical Business Model factory
 *
 * Single approved constructor for a fresh, serializable CBM.
 * Adapters fill source-specific sections; structural defaults come from here.
 */

function deepCopy(value) {
  if (value === null || value === undefined) return value
  return JSON.parse(JSON.stringify(value))
}

function buildEmptyCanonicalBusinessModel() {
  return {
    //////////////////////////////////////////////////
    //---------------- User Inputs -----------------//
    //////////////////////////////////////////////////

    // Business Metadata
    metadata: {
      name: '',
      type: '', // 'manufacturing', 'services', 'retail', etc.
      country: '',
      countryData: null, // Will be set from countries lookup
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
      // Will be populated from countries[model.metadata.country]
      // Plus user-based values:
      initialInvestment: 0,
      rewardMargin: 0, // Reward margin for TREMA calculation
      forecastWindowSize: 5, // Number of periods to use for statistical forecasting methods
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

    // Demand
    demand: {
      availableForecastingMethods: ['slr', 'dlr', 'sma', 'dma', 'ses', 'des', 'winters'],
      ordersForecastMethod: '', // 'slr', 'sma', 'ses', 'winters'
      monthlyTendency: [], // [0.9, 1.1, 1.2, ...]
      previousYearsDemand: [], // [{ year: 2025, month: 1, orders: 100 }]
      yearZeroDemand: [], // [{ month: 1, orders: 100 }]
      firstFullYearDemand: [], // [{ month: 1, orders: 100 }]
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
      availableForecastingMethods: ['inflation'],
      forecastingMethod: '', // 'inflation',
      categories: [
        'direct', 'indirect', 'engineering', 'administrative'
      ],
      employees: [
        {
          title: '',
          category: '',
          amount: 0,
          baseSalary: 0,
          laborBenefits: null, // Will be populated from laborBenefits[model.metadata.country]
        }
      ],
      totalMonthlySalaries: 0,
      directLaborSalaries: 0,
      indirectLaborSalaries: 0,
      engineeringSalaries: 0,
      administrativeSalaries: 0,
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
      loans: [{
        name: '',
        period: 0,
        amount: 0,
        periods: 0,
        rate: 0,
      }],
    },

    ////////////////////////////////////////////////////////////
    //-------------------- Derived Values --------------------//
    ////////////////////////////////////////////////////////////

    bomsDerived: [
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
      //   occupiedCapacity: [], // forecasted occupied capacity by period dividing capacity by work orders
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
      //   remaining: [], // remaining loan balance by period
      // }
    ],

    ////////////////////////////////////////////////////////////
    //-------------------- Cash Flows --------------------//
    ////////////////////////////////////////////////////////////

    cashFlows: {
      inflows: [], // Total cash inflows per period (sales revenue + loan disbursements)
      outflows: [], // Total cash outflows per period (costs + salaries + expenses + asset purchases + loan payments)
      netCashFlow: [], // Net cash flow per period (inflows - outflows)
      cumulativeCashFlow: [], // Cumulative cash flow over time
    },

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
  }
}

/**
 * Creates a fresh canonical business model.
 * @param {{ source?: string, metadata?: Object }} [options]
 * @returns {Object}
 */
export function createCanonicalBusinessModel(options = {}) {
  const model = buildEmptyCanonicalBusinessModel()
  const metaOpts = options.metadata || {}

  for (const [key, value] of Object.entries(metaOpts)) {
    model.metadata[key] = value ?? model.metadata[key]
  }

  if (options.source != null) {
    model.metadata.source = options.source
  }

  const country = model.metadata.country
  if (country && countries[country]) {
    model.metadata.countryData = { ...countries[country] }

    const countryPremises = deepCopy(premises[country] || {})
    model.premises = {
      ...countryPremises,
      initialInvestment: countryPremises.initialInvestment ?? 0,
      rewardMargin: countryPremises.rewardMargin ?? 0,
      forecastWindowSize: countryPremises.forecastWindowSize ?? 5,
    }

    const countryLaborBenefits = laborBenefits[country]
      ? deepCopy(laborBenefits[country])
      : null
    model.workforce.employees = [
      {
        title: '',
        category: '',
        amount: 0,
        baseSalary: 0,
        laborBenefits: countryLaborBenefits,
      },
    ]
  }

  return model
}

/**
 * Hydrate a persisted / partially filled CBM against factory defaults.
 * @param {Object|null|undefined} rawModel
 * @returns {Object}
 */
export function hydrateCanonicalBusinessModel(rawModel) {
  if (!rawModel) {
    return createCanonicalBusinessModel()
  }

  const base = createCanonicalBusinessModel({
    source: rawModel.metadata?.source,
    metadata: rawModel.metadata,
  })

  const hydrated = {
    ...base,
    ...rawModel,
    metadata: { ...base.metadata, ...rawModel?.metadata },
    timeline: { ...base.timeline, ...rawModel?.timeline },
    premises: { ...base.premises, ...rawModel?.premises },
    boms: {
      ...base.boms,
      ...rawModel?.boms,
      products: rawModel?.boms?.products ?? base.boms.products,
    },
    production: {
      ...base.production,
      ...rawModel?.production,
      lines: rawModel?.production?.lines ?? base.production.lines,
    },
    demand: { ...base.demand, ...rawModel?.demand },
    assets: {
      ...base.assets,
      ...rawModel?.assets,
      assets: rawModel?.assets?.assets ?? base.assets.assets,
    },
    workforce: {
      ...base.workforce,
      ...rawModel?.workforce,
      employees: rawModel?.workforce?.employees ?? base.workforce.employees,
    },
    expenses: { ...base.expenses, ...rawModel?.expenses },
    financing: { ...base.financing, ...rawModel?.financing },
    cashFlows: { ...base.cashFlows, ...rawModel?.cashFlows },
    revenue: { ...base.revenue, ...rawModel?.revenue },
    costs: { ...base.costs, ...rawModel?.costs },
    operatingExpenses: { ...base.operatingExpenses, ...rawModel?.operatingExpenses },
    project: { ...base.project, ...rawModel?.project },
    accounts: { ...base.accounts, ...rawModel?.accounts },
    additionalData: { ...base.additionalData, ...rawModel?.additionalData },
    bomsDerived: rawModel?.bomsDerived ?? base.bomsDerived,
    demandDerived: rawModel?.demandDerived ?? base.demandDerived,
    productionDerived: rawModel?.productionDerived ?? base.productionDerived,
    workforceDerived: rawModel?.workforceDerived ?? base.workforceDerived,
    assetsDerived: rawModel?.assetsDerived ?? base.assetsDerived,
    expensesDerived: rawModel?.expensesDerived ?? base.expensesDerived,
    financingDerived: rawModel?.financingDerived ?? base.financingDerived,
  }

  // Normalize startDate to ISO string for session safety (no Date objects)
  const startDate = hydrated.metadata?.startDate
  if (startDate != null) {
    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      hydrated.metadata.startDate = startDate.toISOString()
    } else if (typeof startDate === 'string') {
      const parsed = new Date(startDate)
      if (!isNaN(parsed.getTime())) {
        hydrated.metadata.startDate = parsed.toISOString()
      }
    }
  }

  return hydrated
}
