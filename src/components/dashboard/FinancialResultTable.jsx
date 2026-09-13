import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { financialResultEditsSlice } from '@/store/costTable.store'

export const FINANCIAL_RESULT_ROWS = [
  { key: 'financialExpenses', label: 'Financial Expenses' },
  { key: 'creditPayment', label: 'Credit Payment' },
  // No source field in InputNovus ("Productos Financieros") - base 0,
  // double-click to enter a value, same override mechanism as any row.
  { key: 'financialIncome', label: 'Financial Income' },
]

function FinancialResultTable({ costOfSalesByYear }) {
  const columns = costOfSalesByYear.map((row) => ({ key: row.year, label: row.year }))
  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  return (
    <EditableTable
      title="Financial Result"
      slice={financialResultEditsSlice}
      columns={columns}
      rows={FINANCIAL_RESULT_ROWS}
      getValue={getValue}
      totalLabel="Total"
    />
  )
}

export default FinancialResultTable
