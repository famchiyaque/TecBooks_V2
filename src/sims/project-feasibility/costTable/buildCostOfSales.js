import {
  areCostsNumeric, sumSalariesByCategory, sumSalariesByCategoryPerYear, computeNetSales,
  computeRawMaterialCost, computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
  computeAssetDepreciation, computeSalesExpenses, computeAdministrativeExpenses,
  computeOperatingExpenses, computeOperatingProfit, computeCumulativeInvestment,
  computeFinancingAmount, computeAmortizationSchedule, computeIncomeBeforeTaxes,
  computeTaxes, computeNetIncome,
} from '@/utils/dashboard/costCalculations'
import { cbmToCostTableInputs, cbmToOperatingExpenseInputs } from './cbmToCostTableInputs'
import { Logger } from '../utils/logger.js'
import {computeAdminExpenses} from "@/utils/dashboard/computeAdminExpenses.js"

import computeInvestment from "@/sims/project-feasibility/income/computeInvestment.js"
import computeAmortizationInterest from "@/sims/project-feasibility/income/computeAmortizationInterest.js"

const logger = new Logger('BuildCostOfSales')

/**
 * Shared by ProjectCostSummary (Cost Table section) and ProfitSummary
 * (Profit Summary section) - both need the same computed costOfSalesByYear,
 * just render different rows from it. One source of truth for the
 * validation + calculation pipeline so they can't drift apart.
 */
export function buildCostOfSales(cbm) {
  if (!cbm) {
    logger.warn('buildCostOfSales: no cbm - project is stored as rows')
    return { error: 'This project is stored as rows. Cost tables will load from the server in a follow-up.' }
  }
  const { employees, production, premises } = cbmToCostTableInputs(cbm)

  if (employees.length === 0) {
    logger.warn('buildCostOfSales: no registered employees')
    return { error: 'This project has no registered employees.' }
  }
  if (!areCostsNumeric(employees, production)) {
    logger.warn('buildCostOfSales: non-numeric data in employees or production', { employees, production })
    return { error: 'This project has non-numeric data in employees or production.' }
  }

  const years = Object.keys(production.purchaseOrders).map(Number)
  if (years.length === 0) {
    logger.warn('buildCostOfSales: no year-zero record')
    return { error: 'This project has no year-zero record.' }
  }

  // Flat, year-zero totals - only for financingAmount below (the loan is
  // sized once, at origination, off year-zero costs - see RF-56 BUG FIX
  // further down). Everything the Cost Table/Operating Expenses actually
  // display uses the per-year, inflation-grown version instead.
  const { MOD, MOIndirecta, Ingenieria, Administrative } = sumSalariesByCategory(employees)
  // BUG FIX: cbmToCostTableInputs()'s `premises` only carries
  // indirectProductPercentage - nationalInflation lives on cbm.premises
  // directly (the raw, index-based array getInflation expects), not on that
  // destructured object.
  const salariesByYear = sumSalariesByCategoryPerYear(employees, years, cbm.premises)
  const MODByYear = {}, MOIndirectaByYear = {}, IngenieriaByYear = {}, AdministrativeByYear = {}
  years.forEach((year) => {
    MODByYear[year] = salariesByYear[year].MOD
    MOIndirectaByYear[year] = salariesByYear[year].MOIndirecta
    IngenieriaByYear[year] = salariesByYear[year].Ingenieria
    AdministrativeByYear[year] = salariesByYear[year].Administrative
  })

  const MP = computeRawMaterialCost(production)
  const netSales = computeNetSales(production)
  const indirectMaterials = computeIndirectMaterialCosts(premises, netSales)
  const costOfSalesByYear = buildCostOfSalesTable(years, {
    MP, MOD: MODByYear, MOIndirecta: MOIndirectaByYear, Ingenieria: IngenieriaByYear, indirectMaterials, netSales,
  })
  const unclassifiedEmployees = findUnclassifiedEmployees(employees)
  logger.debug('buildCostOfSales: cost of sales', { salariesByYear, MP, netSales, indirectMaterials, costOfSalesByYear, unclassifiedEmployees })

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
  const administrativeExpenses = computeAdminExpenses(cbm)
  const operatingExpenses = computeOperatingExpenses(administrativeExpenses, depreciationTotal, salesExpenses, years)
  logger.debug('buildCostOfSales: operating expenses', {
    depreciationBuildings, depreciationTransport, depreciationCompute, depreciationMachinery, depreciationTotal,
    salesExpenses, administrativeExpenses, operatingExpenses,
  })

  const salariesTotal = MOD + MOIndirecta + Ingenieria + Administrative
  const investment = computeCumulativeInvestment([opex.assets.buildings, opex.assets.transport, opex.assets.compute], years)
  const machineryInvestment = computeCumulativeInvestment([opex.machines], years)
  const managementBills = {}
  years.forEach((year) => { managementBills[year] = (netSales[year] || 0) * (opex.adminPct[year] || 0) })
  // RF-56 BUG FIX: the loan is originated once, at project year zero - it is
  // a single fixed amount, not resized off a growing cumulative investment
  // every year. investment/machineryInvestment/managementBills are read at
  // years[0] on purpose (Egresos!B215 is itself a year-zero figure).
  const financingAmount = computeFinancingAmount(
    investment, salariesTotal, managementBills, machineryInvestment, [years[0]]
  )[years[0]]

  // RF-56 BUG FIX: one loan, amortized once over its own life in monthly
  // 12-month blocks - not a fresh full-life schedule re-loaded onto every
  // projection year. Rate is the leading rate at origination (year zero),
  // fixed for the life of the loan.
  const { financialExpensesByYear: financialExpenses, creditPaymentByYear: creditPayment } =
    computeAmortizationSchedule(
      financingAmount, opex.financingPeriods, opex.nationalLeadingRate[years[0]], years
    )

  logger.debug('buildCostOfSales: financing', {
    investment, machineryInvestment, managementBills, salariesTotal, financingAmount, financialExpenses, creditPayment,
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
    // Split out of administrativeExpenses (= administrativeSalary + netSales
    // * adminPct) so the Cash Outflows table can show "Administrative
    // Salaries" and "General Administrative Expenses" as separate lines,
    // same as Flujo sheet rows 18-19 (Egresos!B154 / Egresos!B206).
    administrativeSalary: AdministrativeByYear[row.year],
    // Single fixed loan (see BUG FIX above) - same amount reported on every row.
    financingAmount,
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

  const result = { costOfSalesByYear: incomeStatementByYear, unclassifiedEmployees }
  logger.debug('buildCostOfSales: final income statement', result)
  return result
}
