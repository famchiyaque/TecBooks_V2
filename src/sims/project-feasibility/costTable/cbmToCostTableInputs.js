import { HORIZON_YEARS } from '../constants.js'

/**
 * RF-54-02: InputNovus only ever gives us one real data point - year-zero's
 * order total (COs sheet has no future-years column, unlike Template
 * Financiero's). To get a multi-year cost table without that data, project
 * forward the same way Expenses' AdminExpensesTable does: one base value
 * compounded by a per-year rate from Premisas, instead of reading a real
 * number per year. Quality yield has no comparable rate anywhere in
 * InputNovus, so it's held flat at the year-zero value - a documented
 * simplification, not a real read.
 */
function projectPurchaseOrders(yearZeroYear, yearZeroTotal, inflationByIndex) {
  const purchaseOrders = {}
  let previous = yearZeroTotal

  HORIZON_YEARS.forEach((year, index) => {
    if (year < yearZeroYear) return
    if (year === yearZeroYear) {
      purchaseOrders[year] = yearZeroTotal
      return
    }
    const rate = inflationByIndex[index] ?? 0
    previous = previous * (1 + rate)
    purchaseOrders[year] = previous
  })

  return purchaseOrders
}

function projectQualityYield(yearZeroYear, qualityYieldAtYearZero) {
  const qualityYield = {}
  HORIZON_YEARS.forEach((year) => {
    if (year < yearZeroYear) return
    qualityYield[year] = qualityYieldAtYearZero
  })
  return qualityYield
}

/**
 * Maps a saved project's canonical business model (cbm, from parseNovusProject)
 * into the { employees, production, premises } shape costCalculations.js
 * expects - same functions the standalone Cost Table upload page uses, just
 * fed from the already-parsed program data instead of a fresh Excel upload.
 */
export function cbmToCostTableInputs(cbm) {
  const employees = (cbm.derivedBase?.employees ?? []).map((employee, index) => ({
    id: index,
    name: employee.name,
    category: employee.category,
    quantity: employee.quantity,
    monthlySalary: employee.salarioIntegrado,
  }))

  const yearZeroYear = cbm.demand?.yearZeroYear
  let purchaseOrders = {}
  let qualityYield = {}
  if (yearZeroYear !== undefined) {
    purchaseOrders = projectPurchaseOrders(
      yearZeroYear,
      cbm.demand?.yearZeroTotal,
      cbm.premises?.nationalInflation ?? []
    )
    qualityYield = projectQualityYield(yearZeroYear, cbm.capacity?.line?.qualityYield)
  }

  const indirectProductPercentage = {}
  HORIZON_YEARS.forEach((year, index) => {
    indirectProductPercentage[year] = cbm.premises?.indirectProductCostPct?.[index]
  })

  return {
    employees,
    production: {
      purchaseOrders,
      qualityYield,
      materialCostPerUnit: cbm.derivedBase?.bomMaterialCost,
      salesPricePerUnit: cbm.bom?.salePrice,
    },
    premises: {
      indirectProductPercentage,
    },
  }
}

function yearMapFromSeries(series, years) {
  const map = {}
  years.forEach((year) => {
    const index = HORIZON_YEARS.indexOf(year)
    map[year] = series?.[index] ?? 0
  })
  return map
}

function mapAssetsToYears(assetList, years) {
  return (assetList ?? []).map((asset) => ({
    name: asset.name,
    acquisitionByYear: yearMapFromSeries(asset.acquisitionByYear, years),
  }))
}

/**
 * RF-55/RF-56: assets (buildings/transport/compute), machinery
 * (capacity.machines - Inversion has no "maquinaria" block, machine
 * acquisition cost lives in Capacidad instead) and the Premisas rates
 * depreciation/admin/sales-expense/financing need, all re-keyed from
 * HORIZON_YEARS-indexed arrays to {year: value} maps matching
 * cbmToCostTableInputs' own output shape.
 */
export function cbmToOperatingExpenseInputs(cbm, years) {
  return {
    assets: {
      buildings: mapAssetsToYears(cbm.assets?.buildings, years),
      transport: mapAssetsToYears(cbm.assets?.transport, years),
      compute: mapAssetsToYears(cbm.assets?.compute, years),
    },
    machines: mapAssetsToYears(cbm.capacity?.machines, years),
    adminPct: yearMapFromSeries(cbm.premises?.adminPct, years),
    salesExpensePct: yearMapFromSeries(cbm.premises?.salesExpensePct, years),
    depreciationBuildings: yearMapFromSeries(cbm.premises?.depreciationBuildings, years),
    depreciationTransport: yearMapFromSeries(cbm.premises?.depreciationTransport, years),
    depreciationMachinery: yearMapFromSeries(cbm.premises?.depreciationMachinery, years),
    depreciationCompute: yearMapFromSeries(cbm.premises?.depreciationCompute, years),
    // RF-56 "Tasa": Premisas "Tasa lider nacional" - the closest match to a
    // generic bank lending rate InputNovus actually provides.
    financingPeriods: cbm.timeline?.financingPeriods,
    nationalLeadingRate: yearMapFromSeries(cbm.premises?.nationalLeadingRate, years),
  }
}
