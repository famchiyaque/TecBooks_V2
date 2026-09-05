import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import EditableTable from '@/components/global/EditableTable'
import { cashFlowEditsSlice, outflowEditsSlice } from '@/store/costTable.store'
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

function baseEntradaValue(rowKey, year, rowByYear) {
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
 * Cash Table "Entradas" (RF-63) - Saldo Inicial, Ventas (= BOM price * CO,
 * already computed as netSales), Préstamo a largo plazo (= financingAmount),
 * and the two manual rows (Préstamos a corto plazo / Otros Ingresos) the
 * activity diagram leaves as open inputs - double-click any cell to fill
 * those in, same override pattern as the other cost tables.
 */
function CashTable({ project }) {
  const overrides = useSelector(cashFlowEditsSlice.selectOverrides)
  const customRows = useSelector(cashFlowEditsSlice.selectCustomRows)
  const outflowOverrides = useSelector(outflowEditsSlice.selectOverrides)
  const outflowCustomRows = useSelector(outflowEditsSlice.selectCustomRows)

  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

  const rowByYear = React.useMemo(() => {
    if (result.error) return {}
    return Object.fromEntries(result.costOfSalesByYear.map((row) => [row.year, row]))
  }, [result])

  const years = React.useMemo(
    () => (result.error ? [] : result.costOfSalesByYear.map((row) => row.year)),
    [result]
  )

  const capexByYear = React.useMemo(() => (
    result.error ? {} : computeCapexByYear(project.cbm, years)
  ), [project, result, years])

  // Saldo Inicial[year] = prior year's Flujo Neto (Entradas - Salidas), first
  // year seeded with the initial cash balance. Sequential (each year only
  // ever looks back one year), and override-aware on BOTH sides: editing
  // Ventas (Entradas) or, say, Other Expenses (Outflows) for 2025 both
  // ripple into Saldo Inicial 2026 through their respective effectiveTotal.
  const saldoInicialByYear = React.useMemo(() => {
    const map = {}
    years.forEach((year, index) => {
      if (index === 0) {
        map[year] = INITIAL_BALANCE
        return
      }
      const prevYear = years[index - 1]
      const prevEntradaValue = (rowKey) => (
        rowKey === 'saldoInicial' ? map[prevYear] : baseEntradaValue(rowKey, prevYear, rowByYear)
      )
      const prevTotalEntradas = cashFlowEditsSlice.effectiveTotal(
        { overrides, customRows }, ENTRADA_ROWS, prevEntradaValue, prevYear
      )
      const prevOutflowValue = (rowKey) => outflowBaseValue(rowKey, prevYear, rowByYear, capexByYear)
      const prevTotalSalidas = outflowEditsSlice.effectiveTotal(
        { overrides: outflowOverrides, customRows: outflowCustomRows }, OUTFLOW_ROWS, prevOutflowValue, prevYear
      )
      map[year] = prevTotalEntradas - prevTotalSalidas
    })
    return map
  }, [years, overrides, customRows, outflowOverrides, outflowCustomRows, rowByYear, capexByYear])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  const getValue = (rowKey, year) => (
    rowKey === 'saldoInicial' ? (saldoInicialByYear[year] ?? 0) : baseEntradaValue(rowKey, year, rowByYear)
  )

  const columns = years.map((year) => ({ key: year, label: year }))

  return (
    <EditableTable
      title="Cash Table"
      slice={cashFlowEditsSlice}
      columns={columns}
      rows={ENTRADA_ROWS}
      getValue={getValue}
      totalLabel="Total Cash Inflows"
    />
  )
}

export default CashTable
