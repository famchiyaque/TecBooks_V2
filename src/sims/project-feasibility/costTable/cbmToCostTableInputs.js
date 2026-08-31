import { HORIZON_YEARS } from '../constants.js'

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
  const purchaseOrders = {}
  const qualityYield = {}
  if (yearZeroYear !== undefined) {
    purchaseOrders[yearZeroYear] = cbm.demand?.yearZeroTotal
    qualityYield[yearZeroYear] = cbm.capacity?.line?.qualityYield
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
