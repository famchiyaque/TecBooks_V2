import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
} from '@/utils/dashboard/costCalculations'
import { cbmToCostTableInputs } from './cbmToCostTableInputs'

/**
 * Shared by ProjectCostSummary (Cost Table section) and ProfitSummary
 * (Utilidades section) - both need the same computed costOfSalesByYear,
 * just render different rows from it. One source of truth for the
 * validation + calculation pipeline so they can't drift apart.
 */
export function buildCostOfSales(cbm) {
  const { employees, production, premises } = cbmToCostTableInputs(cbm)

  if (employees.length === 0) {
    return { error: 'This project has no registered employees.' }
  }
  if (!areCostsNumeric(employees, production)) {
    return { error: 'This project has non-numeric data in employees or production.' }
  }

  const years = Object.keys(production.purchaseOrders).map(Number)
  if (years.length === 0) {
    return { error: 'This project has no year-zero record.' }
  }

  const { MOD, MOIndirecta, Ingenieria, Administracion } = sumSalariesByCategory(employees)
  const MP = computeRawMaterialCost(production)
  const netSales = computeNetSales(production)
  const indirectMaterials = computeIndirectMaterialCosts(premises, netSales)
  const costOfSalesByYear = buildCostOfSalesTable(years, {
    MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials, netSales,
  })
  const unclassifiedEmployees = findUnclassifiedEmployees(employees)

  return { costOfSalesByYear, unclassifiedEmployees }
}
