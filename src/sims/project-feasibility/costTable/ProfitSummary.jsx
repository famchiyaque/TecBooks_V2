import React from 'react'
import { Alert } from '@mui/material'
import OperatingExpensesTable from '@/components/dashboard/OperatingExpensesTable'
import FinancialResultTable from '@/components/dashboard/FinancialResultTable'
import ProfitSummaryTable from '@/components/dashboard/ProfitSummaryTable'
import { buildCostOfSales } from './buildCostOfSales'

/**
 * Profit Summary section: editable Operating Expenses (RF-55) and Financial
 * Result (RF-56) breakdowns - same double-click pattern as the Cost Table -
 * followed by the read-only summary (Net Sales through Net Income). Taxes
 * (RF-57, ISR/PTU) has no table of its own - only 2 rows, so it's editable
 * directly inside ProfitSummaryTable's "Total Taxes" breakdown instead.
 * Same underlying calculation as ProjectCostSummary (shares buildCostOfSales).
 */
function ProfitSummary({ project }) {
  const result = React.useMemo(() => buildCostOfSales(project.cbm), [project])

  if (result.error) {
    return <Alert severity="warning">{result.error}</Alert>
  }

  return (
    <>
      <OperatingExpensesTable costOfSalesByYear={result.costOfSalesByYear} />
      <FinancialResultTable costOfSalesByYear={result.costOfSalesByYear} />
      <ProfitSummaryTable costOfSalesByYear={result.costOfSalesByYear} />
    </>
  )
}

export default ProfitSummary
