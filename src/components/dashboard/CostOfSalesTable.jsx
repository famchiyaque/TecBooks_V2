import React from 'react'
import EditableTable from '@/components/global/EditableTable'
import { costTableEditsSlice } from '@/store/costTable.store'

const COST_ROWS = [
  { key: 'rawMaterial', label: 'Costo de Materias Primas (MP)' },
  { key: 'directLabour', label: 'Mano de Obra Directa (MOD)' },
  { key: 'indirectManufacturing', label: 'Mano de Obra Indirecta' },
  { key: 'engineeringSalaries', label: 'Costos de Ingenieria' },
  { key: 'administrativeExpenses', label: 'Costos de Administracion' },
  { key: 'indirectMaterials', label: 'Costos Materiales Indirectos' },
]

function CostOfSalesTable({ costOfSalesByYear }) {
  const columns = costOfSalesByYear.map((row) => ({ key: row.year, label: row.year }))
  const getValue = (rowKey, year) => costOfSalesByYear.find((row) => row.year === year)?.[rowKey] ?? 0

  return (
    <EditableTable
      title="Tabla de costos"
      slice={costTableEditsSlice}
      columns={columns}
      rows={COST_ROWS}
      getValue={getValue}
      totalLabel="Total de Costos"
    />
  )
}

export default CostOfSalesTable
