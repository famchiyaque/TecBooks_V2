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
    },
    demand: {
      monthShares: Array.from({ length: 12 }, () => undefined),
      yearZeroOrders: Array.from({ length: 12 }, () => 0),
      history: [],
      yearZeroYear: undefined,
      yearZeroTotal: undefined,
    },
    capacity: {
      line: {
        qualityYield: undefined,
        secondsPerUnit: undefined,
        hoursShift: undefined,
        shifts: undefined,
        productionLines: undefined,
        weekWorkingDays: undefined,
        monthsWorkingWeeks: undefined,
        yearWorkingMonths: undefined,
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
