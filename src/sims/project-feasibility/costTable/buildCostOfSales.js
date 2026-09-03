import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
  computeAssetDepreciation, computeSalesExpenses, computeAdministrativeExpenses,
  computeOperatingExpenses, computeOperatingProfit, computeCumulativeInvestment,
  computeFinancingAmount, computeAmortizationSchedule, computeIncomeBeforeTaxes,
  computeTaxes, computeNetIncome,
} from '@/utils/dashboard/costCalculations'
import { cbmToCostTableInputs, cbmToOperatingExpenseInputs } from './cbmToCostTableInputs'

/**
 * Shared by ProjectCostSummary (Cost Table section) and ProfitSummary
 * (Profit Summary section) - both need the same computed costOfSalesByYear,
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

  const { MOD, MOIndirecta, Ingenieria, Administrative } = sumSalariesByCategory(employees)
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
  const administrativeExpenses = computeAdministrativeExpenses(Administrative, opex.adminPct, netSales, years)
  const operatingExpenses = computeOperatingExpenses(administrativeExpenses, depreciationTotal, salesExpenses, years)

  const salariesTotal = MOD + MOIndirecta + Ingenieria + Administrative
  const investment = computeCumulativeInvestment([opex.assets.buildings, opex.assets.transport, opex.assets.compute], years)
  const machineryInvestment = computeCumulativeInvestment([opex.machines], years)
  const managementBills = {}
  years.forEach((year) => { managementBills[year] = (netSales[year] || 0) * (opex.adminPct[year] || 0) })
  const financingAmount = computeFinancingAmount(investment, salariesTotal, managementBills, machineryInvestment, years)

  const financialExpenses = {}
  const creditPayment = {}
  years.forEach((year) => {
    const schedule = computeAmortizationSchedule(
      financingAmount[year], opex.financingPeriods, opex.nationalLeadingRate[year]
    )
    financialExpenses[year] = schedule.financialExpenses
    creditPayment[year] = schedule.creditPayment
  })

  const incomeBeforeTaxes = {}
  costOfSalesByYear.forEach((row) => {
    const operatingProfit = computeOperatingProfit(row.grossProfit, operatingExpenses[row.year])
    // RF-56 "Financial Income" has no source field - base 0 here, only ever
    // set through an override, same as this static row for every other year.
    incomeBeforeTaxes[row.year] = computeIncomeBeforeTaxes(
      operatingProfit, financialExpenses[row.year], creditPayment[row.year], 0
    )
  })
  const taxes = computeTaxes(incomeBeforeTaxes, opex.isr, opex.ptu, years)

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
    financialExpenses: financialExpenses[row.year],
    creditPayment: creditPayment[row.year],
    // RF-56 "Financial Income" ("Productos Financieros") has no source field
    // in InputNovus - base 0, manual/overridable only, same as any other row.
    financialIncome: 0,
    incomeBeforeTaxes: incomeBeforeTaxes[row.year],
    isr: taxes[row.year].isr,
    ptu: taxes[row.year].ptu,
    netIncome: computeNetIncome(incomeBeforeTaxes[row.year], taxes[row.year].total),
  }))

  return { costOfSalesByYear: incomeStatementByYear, unclassifiedEmployees }
}
