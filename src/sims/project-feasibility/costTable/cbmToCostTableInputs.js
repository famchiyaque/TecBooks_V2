import { HORIZON_YEARS } from '../constants.js'
import { projectPurchaseOrders } from '../demand/projectPurchaseOrders.js'

// BUG FIX: Quality Yield genuinely changes year to year (Capacidad's own
// sheet has a year column for it) - was reading a single year-zero value
// and repeating it flat across the whole projection.
function projectQualityYield(yearZeroYear, qualityYieldSeries) {
  const qualityYield = {}
  HORIZON_YEARS.forEach((year, index) => {
    if (year < yearZeroYear) return
    qualityYield[year] = qualityYieldSeries?.[index]
  })
  return qualityYield
}

/**
 * RF-56-XX BUG FIX: the sale price is not flat across the projection - it
 * grows by national inflation every year (Ingresos!C23 = B23 * (1 + Premisas!C12)).
 * Volume (purchase orders) uses demandGrowth, not this inflation series -
 * see projectPurchaseOrders (demand module). Capacity (Capacidad sheet) is
 * a separate, derived utilization check - it does not drive CO.
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
 * MP material cost per unit grows by national inflation every year, mirroring
 * the Template Financiero IN3001B and the sales-price treatment above -
 * until this, materialCostPerUnit was a flat scalar for every year even
 * though CO volume was already real/per-year.
 */
function projectMaterialCost(yearZeroYear, yearZeroCost, inflationByIndex) {
  const materialCostPerUnit = {}
  let previous = yearZeroCost

  HORIZON_YEARS.forEach((year, index) => {
    if (year < yearZeroYear) return
    if (year === yearZeroYear) {
      materialCostPerUnit[year] = yearZeroCost
      return
    }
    const rate = inflationByIndex[index] ?? 0
    previous = previous * (1 + rate)
    materialCostPerUnit[year] = previous
  })

  return materialCostPerUnit
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
  let materialCostPerUnit = cbm.derivedBase?.bomMaterialCost ?? 0
  if (yearZeroYear !== undefined) {
    purchaseOrders = projectPurchaseOrders({
      yearZeroYear,
      yearZeroTotal: cbm.demand?.yearZeroTotal,
      yearZeroOrders: cbm.demand?.yearZeroOrders,
      monthShares: cbm.demand?.monthShares,
      history: cbm.demand?.history,
      demandGrowth: cbm.premises?.demandGrowth,
    })
    // BUG FIX: COs' "Año Cero | Total" block gives a real total per year,
    // not just year zero (see readCOs) - any year the Excel actually gives
    // wins outright over the demandGrowth-projected guess above. Years the
    // Excel doesn't cover keep the projection.
    console.log('[DEBUG-CO] cbm.demand.yearlyTotals:', JSON.stringify(cbm.demand?.yearlyTotals))
    console.log('[DEBUG-CO] purchaseOrders before overlay:', JSON.stringify(purchaseOrders))
    for (const { year, total } of cbm.demand?.yearlyTotals ?? []) {
      if (year !== undefined && total !== undefined) purchaseOrders[year] = total
    }
    console.log('[DEBUG-CO] purchaseOrders after overlay:', JSON.stringify(purchaseOrders))
    qualityYield = projectQualityYield(yearZeroYear, cbm.capacity?.line?.qualityYield)
    salesPricePerUnit = projectSalesPrice(
      yearZeroYear,
      cbm.bom?.salePrice,
      cbm.premises?.nationalInflation ?? []
    )
    materialCostPerUnit = projectMaterialCost(
      yearZeroYear,
      cbm.derivedBase?.bomMaterialCost,
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
      // {year: cost} map, grown by national inflation - see projectMaterialCost.
      materialCostPerUnit,
      // {year: price} map, grown by national inflation - see projectSalesPrice.
      salesPricePerUnit,
    },
    premises: {
      startingMoney: typeof cbm.premises?.startingMoney === 'number' ? cbm.premises.startingMoney : 0,
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

// BUG FIX: machinery $ used to come from capacity.machines (Capacidad) -
// that sheet's machine list is for production planning (operator counts,
// cycle time), not investment. Machinery acquisition cost lives on
// Inversion's own category (whatever it's labeled - "Maquinaria y equipo",
// "Machinery", etc.), same as Buildings/Transport/Compute - find it there
// instead of Capacidad, so Investment/Cash Outflows/Balance Sheet all
// reflect the real Inversion sheet, not the unrelated Capacidad numbers.
const MACHINERY_CATEGORY_PATTERN = /^maquinaria|^machinery/
function machineryAssetsFromInversion(cbm) {
  const byCategory = cbm.assets?.byCategory ?? {}
  const key = Object.keys(byCategory).find((category) => (
    MACHINERY_CATEGORY_PATTERN.test(String(category ?? '').toLowerCase().trim())
  ))
  return key ? byCategory[key] : []
}

/**
 * RF-55/RF-56: assets (buildings/transport/compute/maquinaria, all from
 * Inversion) and the Premisas rates depreciation/admin/sales-expense/
 * financing need, all re-keyed from HORIZON_YEARS-indexed arrays to
 * {year: value} maps matching cbmToCostTableInputs' own output shape.
 */
export function cbmToOperatingExpenseInputs(cbm, years) {
  return {
    assets: {
      buildings: mapAssetsToYears(cbm.assets?.buildings, years),
      transport: mapAssetsToYears(cbm.assets?.transport, years),
      compute: mapAssetsToYears(cbm.assets?.compute, years),
    },
    machines: mapAssetsToYears(machineryAssetsFromInversion(cbm), years),
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
