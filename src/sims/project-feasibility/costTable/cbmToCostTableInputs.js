import { HORIZON_YEARS } from '../constants.js'
import { projectPurchaseOrders } from '../demand/projectPurchaseOrders.js'

function projectQualityYield(yearZeroYear, qualityYieldAtYearZero) {
  const qualityYield = {}
  HORIZON_YEARS.forEach((year) => {
    if (year < yearZeroYear) return
    qualityYield[year] = qualityYieldAtYearZero
  })
  return qualityYield
}

/**
 * RF-56-XX BUG FIX: the sale price is not flat across the projection - it
 * grows by national inflation every year (Ingresos!C23 = B23 * (1 + Premisas!C12)).
 * Volume (purchase orders) uses demandGrowth, not this inflation series.
 */
function projectSalesPrice(yearZeroYear, yearZeroPrice, inflationByIndex) {
  const salesPricePerUnit = {}
  let previous = yearZeroPrice

  HORIZON_YEARS.forEach((year, index) => {
    if (year < yearZeroYear) return
    if (year === yearZeroYear) {
      salesPricePerUnit[year] = yearZeroPrice
      return
    }
    const rate = inflationByIndex[index] ?? 0
    previous = previous * (1 + rate)
    salesPricePerUnit[year] = previous
  })

  return salesPricePerUnit
}

/**
 * Maps a saved project's canonical business model (cbm, from parseNovusProject)
 * into the { employees, production, premises } shape costCalculations.js
 * expects - same functions the standalone Cost Table upload page uses, just
 * fed from the already-parsed program data instead of a fresh Excel upload.
 */
export function cbmToCostTableInputs(cbm) {
  if (!cbm) {
    return { employees: [], production: {}, premises: {} }
  }

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
  let salesPricePerUnit = {}
  if (yearZeroYear !== undefined) {
    purchaseOrders = projectPurchaseOrders({
      yearZeroYear,
      yearZeroTotal: cbm.demand?.yearZeroTotal,
      yearZeroOrders: cbm.demand?.yearZeroOrders,
      monthShares: cbm.demand?.monthShares,
      history: cbm.demand?.history,
      demandGrowth: cbm.premises?.demandGrowth,
    })
    qualityYield = projectQualityYield(yearZeroYear, cbm.capacity?.line?.qualityYield)
    salesPricePerUnit = projectSalesPrice(
      yearZeroYear,
      cbm.bom?.salePrice,
      cbm.premises?.nationalInflation ?? []
    )
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
      // {year: price} map, grown by national inflation - see projectSalesPrice.
      salesPricePerUnit,
    },
    premises: {
      indirectProductPercentage,
    },
  }
}

export function yearMapFromSeries(series, years) {
  const map = {}
  years.forEach((year) => {
    const index = HORIZON_YEARS.indexOf(year)
    map[year] = series?.[index] ?? 0
  })
  return map
}

export function mapAssetsToYears(assetList, years) {
  return (assetList ?? []).map((asset) => ({
    // Machines (capacity.machines) have no "name", only code/description.
    name: asset.name ?? asset.description ?? asset.code,
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
    // RF-57: Premisas "Tasa ISR" / "Tasa de PTU".
    isr: yearMapFromSeries(cbm.premises?.isr, years),
    ptu: yearMapFromSeries(cbm.premises?.ptu, years),
    // RF-65 TREMA: Premisas "Inflacion nacional" - the other rate TREMA sums
    // (market rate + inflation + risk premium, risk premium has no source
    // field so it's a manual input, same situation as Financial Income).
    nationalInflation: yearMapFromSeries(cbm.premises?.nationalInflation, years),
  }
}
