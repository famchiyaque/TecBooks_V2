import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { costTableEditsSlice } from '@/store/costTable.store'

export const COST_ROWS = [
  { key: 'rawMaterial', label: 'Raw Material Cost (MP)' },
  { key: 'directLabour', label: 'Direct Labor (MOD)' },
  { key: 'indirectManufacturing', label: 'Indirect Labor' },
  { key: 'engineeringSalaries', label: 'Engineering Costs' },
  { key: 'indirectMaterials', label: 'Indirect Material Costs' },
]

function CostOfSalesTable({ costOfSalesByYear }) {
  const columns = costOfSalesByYear.map((row) => ({ key: row.year, label: row.year }))
  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  return (
    <EditableTable
      title="Cost Table"
      slice={costTableEditsSlice}
      columns={columns}
      rows={COST_ROWS}
      getValue={getValue}
      totalLabel="Total Cost"
    />
  )
}

export default CostOfSalesTable
