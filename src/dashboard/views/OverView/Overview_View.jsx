import React from 'react'
import { useDashboard } from '@/core/store'
import { Typography, Card, CardContent } from '@mui/material'
import '@/styles/general.css'

/**
 * Overview View
 * 
 * TODO: Migrate the full overview implementation from TECBooks/Dashboard/OverView
 * This is currently a placeholder showing basic revenue/costs/expenses data
 */
function Overview_View() {
  const { businessModel, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className='view-child'>
        <div className='loader'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='view-child'>
        <Typography color="error">Error: {error}</Typography>
      </div>
    )
  }

  const { revenue, costs, expenses, timeline } = businessModel || {}

  return (
    <div className='view-child'>
      <div className='view-title'>
        <Typography variant='h4' sx={{ fontWeight: '600' }}>
          Overview
        </Typography>
        <Typography variant='subtitle1' color="text.secondary">
          Business performance summary
        </Typography>
      </div>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Financial Summary
          </Typography>
          <Typography variant="body1">
            Total Revenue: ${revenue?.totals?.reduce((a, b) => a + b, 0).toLocaleString() || 0}
          </Typography>
          <Typography variant="body1">
            Total Costs: ${costs?.totals?.reduce((a, b) => a + b, 0).toLocaleString() || 0}
          </Typography>
          <Typography variant="body1">
            Total Expenses: ${expenses?.totals?.reduce((a, b) => a + b, 0).toLocaleString() || 0}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 600 }}>
            Net Profit: ${(
              (revenue?.totals?.reduce((a, b) => a + b, 0) || 0) -
              (costs?.totals?.reduce((a, b) => a + b, 0) || 0) -
              (expenses?.totals?.reduce((a, b) => a + b, 0) || 0)
            ).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This view will be fully implemented with charts, KPIs, and detailed breakdowns.
            For now, it shows basic financial totals from the canonical business model.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview_View
