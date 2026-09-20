import { HORIZON_YEARS } from '../constants.js'
import { emptyYearSeries } from '../parse/cells.js'

export function createProjectClass({ fileName } = {}) {
  return {
    metadata: {
      name: '',
      source: 'novus-excel',
      fileName: fileName ?? '',
    },
    timeline: {
      years: [...HORIZON_YEARS],
      startYear: HORIZON_YEARS[0],
      endYear: HORIZON_YEARS[HORIZON_YEARS.length - 1],
      financingPeriods: undefined,
    },
    premises: {
      startingMoney: undefined,
      fxClose: emptyYearSeries(),
      nationalLeadingRate: emptyYearSeries(),
      cpp: emptyYearSeries(),
      cetes: emptyYearSeries(),
      libor: emptyYearSeries(),
      nationalInflation: emptyYearSeries(),
      isr: emptyYearSeries(),
      impac: emptyYearSeries(),
      ptu: emptyYearSeries(),
      foreignInflation: emptyYearSeries(),
      inventoryPct: emptyYearSeries(),
      suppliersPct: emptyYearSeries(),
      shortTermLiabilityPct: emptyYearSeries(),
      directProductCostPct: emptyYearSeries(),
      indirectProductCostPct: emptyYearSeries(),
      salesExpensePct: emptyYearSeries(),
      adminPct: emptyYearSeries(),
      depreciationBuildings: emptyYearSeries(),
      depreciationMachinery: emptyYearSeries(),
      depreciationTransport: emptyYearSeries(),
      depreciationCompute: emptyYearSeries(),
      // Generic capture of every "Porcentaje depreciacion X" row Premisas
      // actually has - keyed by whatever category label X is, not limited
      // to the 4 above.
      depreciationByCategory: {},
      demandGrowth: undefined,
    },
    demand: {
      monthShares: Array.from({ length: 12 }, () => undefined),
      yearZeroOrders: Array.from({ length: 12 }, () => 0),
      history: [],
      yearZeroYear: undefined,
      yearZeroTotal: undefined,
    },
    capacity: {
      // BUG FIX: was a single flat value per field (year-zero only) even
      // though Capacidad's own sheet has a year column per field and these
      // genuinely change year to year (Shifts, Production Lines, Quality
      // Yield, etc. - see readCapacidad). Per-year series now, same
      // HORIZON_YEARS-indexed array shape as premises.* fields.
      line: {
        qualityYield: emptyYearSeries(),
        secondsPerUnit: emptyYearSeries(),
        hoursShift: emptyYearSeries(),
        shifts: emptyYearSeries(),
        productionLines: emptyYearSeries(),
        weekWorkingDays: emptyYearSeries(),
        monthsWorkingWeeks: emptyYearSeries(),
        yearWorkingMonths: emptyYearSeries(),
      },
      machines: [],
    },
    bom: {
      productName: '',
      salePrice: undefined,
      parts: [],
    },
    assets: {
      transport: [],
      buildings: [],
      compute: [],
      // Generic capture of every category the Inversion sheet actually has -
      // keyed by whatever label the Excel uses, not limited to the 3 above.
      byCategory: {},
    },
    employees: [],
    services: [],
    derivedBase: {
      unitsPerHour: undefined,
      annualCapacity: undefined,
      annualCapacityByYear: emptyYearSeries(),
      operatorCount: 0,
      supervisorCount: 0,
      bomMaterialCost: undefined,
      monthShareSum: undefined,
      yearZeroOrdersSum: undefined,
      employees: [],
    },
  }
}

export function createProgram({ name = '', projects = [] } = {}) {
  return {
    name,
    projects: projects.map((project) => ({
      name: project.name ?? project.cbm?.metadata?.name ?? '',
      cbm: project.cbm ?? project,
    })),
  }
}
