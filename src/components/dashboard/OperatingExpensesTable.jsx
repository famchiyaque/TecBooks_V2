import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { operatingExpenseEditsSlice } from '@/store/costTable.store'

export const OPERATING_EXPENSE_ROWS = [
  { key: 'administrativeExpenses', label: 'Administrative Expenses' },
  { key: 'depreciationBuildings', label: 'Depreciation - Buildings' },
  { key: 'depreciationTransport', label: 'Depreciation - Transport Equipment' },
  { key: 'depreciationMachinery', label: 'Depreciation - Machinery' },
  { key: 'depreciationCompute', label: 'Depreciation - Computer Equipment' },
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
