import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { operatingExpenseEditsSlice } from '@/store/costTable.store'

// Depreciation used to be 4 fixed rows (Buildings/Transport/Machinery/
// Computer Equipment) - any asset category the project's Excel named
// something else was silently never depreciated. Now one combined row,
// covering however many categories the project actually has (see
// buildCostOfSales.js's BUG FIX, reusing computeFixedAssetsByCategory).
export const OPERATING_EXPENSE_ROWS = [
  { key: 'administrativeExpenses', label: 'Administrative Expenses' },
  { key: 'depreciation', label: 'Depreciation' },
  { key: 'salesExpenses', label: 'Sales Expenses' },
]

function OperatingExpensesTable({ costOfSalesByYear }) {
  const columns = costOfSalesByYear.map((row) => ({ key: row.year, label: row.year }))
  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  return (
    <EditableTable
      title="Operating Expenses"
      slice={operatingExpenseEditsSlice}
      columns={columns}
      rows={OPERATING_EXPENSE_ROWS}
      getValue={getValue}
      totalLabel="Total Operating Expenses"
    />
  )
}

export default OperatingExpensesTable
