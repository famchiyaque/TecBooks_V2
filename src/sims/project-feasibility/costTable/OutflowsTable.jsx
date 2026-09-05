import React from 'react'
import { Alert } from '@mui/material'
import EditableTable from '@/components/global/EditableTable'
import { outflowEditsSlice } from '@/store/costTable.store'
import { buildCostOfSales } from './buildCostOfSales'
import { OUTFLOW_ROWS, computeCapexByYear, outflowBaseValue } from './outflowCalculations'

/**
 * Cash Outflows "Salidas" (RF-63, Flujo sheet rows 12-32) - every fixed
 * computed field the Income Statement already has (raw material, labor,
 * salaries, sales expenses, credit payment/interest, taxes) plus each asset
 * class's raw per-year purchase spend, and 3 rows the template leaves blank
 * (Civil Works, Insurance, Other Expenses) - editable like every other row
 * here, same double-click override pattern.
 */
function OutflowsTable({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

  const years = React.useMemo(
    () => (result.error ? [] : result.costOfSalesByYear.map((row) => row.year)),
    [result]
  )

  const rowByYear = React.useMemo(() => {
    if (result.error) return {}
    return Object.fromEntries(result.costOfSalesByYear.map((row) => [row.year, row]))
  }, [result])

  const capexByYear = React.useMemo(() => (
    result.error ? {} : computeCapexByYear(project.cbm, years)
  ), [project, result, years])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  const getValue = (rowKey, year) => outflowBaseValue(rowKey, year, rowByYear, capexByYear)
  const columns = years.map((year) => ({ key: year, label: year }))

  return (
    <EditableTable
      title="Cash Outflows"
      slice={outflowEditsSlice}
      columns={columns}
      rows={OUTFLOW_ROWS}
      getValue={getValue}
      totalLabel="Total Cash Outflows"
    />
  )
}

export default OutflowsTable
