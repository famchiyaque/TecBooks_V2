import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { costTableEditsSlice } from '@/store/costTable.store'
import { computeGrossProfit } from '@/utils/dashboard/costCalculations'

const COST_ROWS = [
  { key: 'rawMaterial', label: 'Raw Material Cost (MP)' },
  { key: 'directLabour', label: 'Direct Labor (MOD)' },
  { key: 'indirectManufacturing', label: 'Indirect Labor' },
  { key: 'engineeringSalaries', label: 'Engineering Costs' },
  { key: 'administrativeExpenses', label: 'Administrative Costs' },
  { key: 'indirectMaterials', label: 'Indirect Material Costs' },
]

function CostOfSalesTable({ costOfSalesByYear }) {
  const columns = costOfSalesByYear.map((row) => ({ key: row.year, label: row.year }))
  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  // RF-54: Net Sales stays fixed per year (not one of the editable cost
  // rows), Gross Profit is recomputed from the live, override-aware total
  // cost every render so it never goes stale (RF-54-07).
  const summaryRows = [
    {
      key: 'netSales',
      label: 'Net Sales',
      compute: (_effectiveTotal, year) => getValue('netSales', year),
    },
    {
      key: 'grossProfit',
      label: 'Gross Profit',
      compute: (effectiveTotal, year) => computeGrossProfit(getValue('netSales', year), effectiveTotal),
    },
  ]

  return (
    <EditableTable
      title="Cost Table"
      slice={costTableEditsSlice}
      columns={columns}
      rows={COST_ROWS}
      getValue={getValue}
      totalLabel="Total Cost"
      summaryRows={summaryRows}
    />
  )
}

export default CostOfSalesTable
