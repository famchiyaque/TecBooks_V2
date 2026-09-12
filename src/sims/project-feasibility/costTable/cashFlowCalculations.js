import { buildCostOfSales } from './buildCostOfSales'
import { OUTFLOW_ROWS, computeCapexByYear, outflowBaseValue } from './outflowCalculations'

const INITIAL_BALANCE = 1_000_000

export const ENTRADA_ROWS = [
  { key: 'saldoInicial', label: 'Beginning Balance' },
  { key: 'ventas', label: 'Sales' },
  { key: 'prestamoLargoPlazo', label: 'Long-term Loan' },
  { key: 'prestamoCortoPlazo', label: 'Short-term Loans' },
  { key: 'otrosIngresos', label: 'Other Income' },
]

/** rowByYear: costOfSalesByYear keyed by year (buildCostOfSales output). */
export function baseEntradaValue(rowKey, year, rowByYear) {
  const row = rowByYear[year]
  switch (rowKey) {
    case 'ventas': return row?.netSales ?? 0
    case 'prestamoLargoPlazo': return row?.financingAmount ?? 0
    case 'prestamoCortoPlazo': return 0
    case 'otrosIngresos': return 0
    default: return 0
  }
}

/**
 * Same running cash balance CashTable.jsx computes for its live UI (Saldo
 * Inicial[year] = prior year's Total Entradas - Total Salidas, chained from
 * INITIAL_BALANCE), but base values only - no Redux override-awareness,
 * since this is a plain calc function (Balance Sheet's Current Actives has
 * no access to the cash/outflow edits slices' override state, unlike the
 * Cash Flow tab's own component). Returns BOTH the beginning-of-year balance
 * (matches CashTable's own row) and the ending-of-year balance (what the
 * Balance Sheet's "Caja y Bancos" actually needs - CashTable never exposes
 * this for the final year since it only ever looks one year back).
 */
export function computeCashBalanceByYear(cbm) {
  const result = buildCostOfSales(cbm)
  if (result.error) return { saldoInicialByYear: {}, endingBalanceByYear: {}, years: [] }

  const rowByYear = Object.fromEntries(result.costOfSalesByYear.map((row) => [row.year, row]))
  const years = result.costOfSalesByYear.map((row) => row.year)
  const capexByYear = computeCapexByYear(cbm, years)

  const totalEntradasSalidas = (year, saldoInicial) => {
    const totalEntradas = ENTRADA_ROWS.reduce((sum, row) => sum + (
      row.key === 'saldoInicial' ? saldoInicial : baseEntradaValue(row.key, year, rowByYear)
    ), 0)
    const totalSalidas = OUTFLOW_ROWS.reduce(
      (sum, row) => sum + outflowBaseValue(row.key, year, rowByYear, capexByYear), 0
    )
    return totalEntradas - totalSalidas
  }

  const saldoInicialByYear = {}
  years.forEach((year, index) => {
    saldoInicialByYear[year] = index === 0
      ? INITIAL_BALANCE
      : totalEntradasSalidas(years[index - 1], saldoInicialByYear[years[index - 1]])
  })

  const endingBalanceByYear = {}
  years.forEach((year) => {
    endingBalanceByYear[year] = totalEntradasSalidas(year, saldoInicialByYear[year])
  })

  return { saldoInicialByYear, endingBalanceByYear, years }
}
