import React from 'react'
import { Alert } from '@mui/material'
import ProfitSummaryTable from '@/components/dashboard/ProfitSummaryTable'
import { buildCostOfSales } from './buildCostOfSales'

/**
 * Net Sales / Total Cost / Gross Profit for one project. Same underlying
 * calculation as ProjectCostSummary (shares buildCostOfSales), rendered as
 * its own read-only card so it doesn't get lost among the editable cost
 * rows - see ProfitSummaryTable for why it's not built on EditableTable.
 */
function ProfitSummary({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  return <ProfitSummaryTable costOfSalesByYear={result.costOfSalesByYear} />
}

export default ProfitSummary
