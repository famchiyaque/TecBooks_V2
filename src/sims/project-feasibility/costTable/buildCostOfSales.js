import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
  computeAssetDepreciation, computeSalesExpenses, computeAdministrativeExpenses,
  computeOperatingExpenses, computeOperatingProfit,
} from '@/utils/dashboard/costCalculations'
import { cbmToCostTableInputs, cbmToOperatingExpenseInputs } from './cbmToCostTableInputs'

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
    MP, MOD, MOIndirecta, Ingenieria, indirectMaterials, netSales,
  })
  const unclassifiedEmployees = findUnclassifiedEmployees(employees)

  const opex = cbmToOperatingExpenseInputs(cbm, years)
  const depreciationBuildings = computeAssetDepreciation(opex.assets.buildings, opex.depreciationBuildings, years)
  const depreciationTransport = computeAssetDepreciation(opex.assets.transport, opex.depreciationTransport, years)
  const depreciationCompute = computeAssetDepreciation(opex.assets.compute, opex.depreciationCompute, years)
  const depreciationMachinery = computeAssetDepreciation(opex.machines, opex.depreciationMachinery, years)
  const depreciationTotal = {}
  years.forEach((year) => {
    depreciationTotal[year] = depreciationBuildings[year] + depreciationTransport[year]
      + depreciationCompute[year] + depreciationMachinery[year]
  })
  const salesExpenses = computeSalesExpenses(netSales, opex.salesExpensePct, years)
  const administrativeExpenses = computeAdministrativeExpenses(Administracion, opex.adminPct, netSales, years)
  const operatingExpenses = computeOperatingExpenses(administrativeExpenses, depreciationTotal, salesExpenses, years)

  const incomeStatementByYear = costOfSalesByYear.map((row) => ({
    ...row,
    administrativeExpenses: administrativeExpenses[row.year],
    depreciationBuildings: depreciationBuildings[row.year],
    depreciationTransport: depreciationTransport[row.year],
    depreciationMachinery: depreciationMachinery[row.year],
    depreciationCompute: depreciationCompute[row.year],
    salesExpenses: salesExpenses[row.year],
    operatingExpenses: operatingExpenses[row.year],
    operatingProfit: computeOperatingProfit(row.grossProfit, operatingExpenses[row.year]),
  }))

  return { costOfSalesByYear: incomeStatementByYear, unclassifiedEmployees }
}
