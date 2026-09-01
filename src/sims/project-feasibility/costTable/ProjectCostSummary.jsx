import React from 'react'
import { Provider } from 'react-redux'
import { Alert } from '@mui/material'
import CostOfSalesTable from '@/components/dashboard/CostOfSalesTable'
import { costTableEditsSlice } from '@/store/costTable.store'
import {
  areCostsNumeric, sumSalariesByCategory, computeNetSales, computeRawMaterialCost,
  computeIndirectMaterialCosts, buildCostOfSalesTable, findUnclassifiedEmployees,
} from '@/utils/dashboard/costCalculations'
import { cbmToCostTableInputs } from './cbmToCostTableInputs'

function buildCostOfSales(cbm) {
  const { employees, production, premises } = cbmToCostTableInputs(cbm)

  if (employees.length === 0) {
    return { error: 'This project has no registered employees.' }
  }
  if (!areCostsNumeric(employees, production)) {
    return { error: 'This project has non-numeric data in employees or production.' }
  }

  const years = Object.keys(production.purchaseOrders).map(Number)
  if (years.length === 0) {
    return { error: 'This project has no year-zero record.' }
  }

  const { MOD, MOIndirecta, Ingenieria, Administracion } = sumSalariesByCategory(employees)
  const MP = computeRawMaterialCost(production)
  const netSales = computeNetSales(production)
  const indirectMaterials = computeIndirectMaterialCosts(premises, netSales)
  const costOfSalesByYear = buildCostOfSalesTable(years, {
    MP, MOD, MOIndirecta, Ingenieria, Administracion, indirectMaterials,
  })
  const unclassifiedEmployees = findUnclassifiedEmployees(employees)

  return { costOfSalesByYear, unclassifiedEmployees }
}

/**
 * Cost-of-sales table for one project's parsed Excel (cbm). Owns its own
 * Redux store for edits/custom rows, fresh per project id so nothing leaks
 * between projects when navigating the sidebar.
 */
function ProjectCostSummary({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])
  const editsStore = React.useMemo(() => costTableEditsSlice.createStore(), [project.id])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  return (
    <>
      {result.unclassifiedEmployees.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {result.unclassifiedEmployees.length} employee{result.unclassifiedEmployees.length === 1 ? '' : 's'} with an
          unrecognized category weren't counted in this table: {result.unclassifiedEmployees.join(', ')}
        </Alert>
      )}
      <Provider store={editsStore}>
        <CostOfSalesTable costOfSalesByYear={result.costOfSalesByYear} />
      </Provider>
    </>
  )
}

export default ProjectCostSummary
