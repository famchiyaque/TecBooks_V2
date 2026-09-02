import React from 'react'
import { Alert } from '@mui/material'
import CostOfSalesTable from '@/components/dashboard/CostOfSalesTable'
import { buildCostOfSales } from './buildCostOfSales'

/**
 * Cost breakdown table for one project's parsed Excel (cbm). Reads/writes
 * the costTableEditsSlice store provided by the parent (ProjectDashboard) -
 * shared with ProfitSummary/Utilidades so edits here are reflected there
 * live (RF-54-07). Must be rendered under that shared <Provider>.
 */
function ProjectCostSummary({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

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
      <CostOfSalesTable costOfSalesByYear={result.costOfSalesByYear} />
    </>
  )
}

export default ProjectCostSummary
