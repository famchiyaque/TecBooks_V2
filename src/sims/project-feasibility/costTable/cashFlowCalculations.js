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
