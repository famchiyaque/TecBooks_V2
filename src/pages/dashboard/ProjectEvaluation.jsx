import React, { useState } from 'react'
import { useDashboard } from '@/contexts'
import { Typography, Grid, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import MetricsCards from '@/components/dashboard/project-evaluation/MetricsCards'
import CashflowChart from '@/components/dashboard/project-evaluation/CashflowChart'
import CashflowChartJS from '@/components/dashboard/project-evaluation/CashflowChartJS'
import ProjectSummary from '@/components/dashboard/project-evaluation/ProjectSummary'
import NPVByLifetimeChart from '@/components/dashboard/project-evaluation/NPVByLifetimeChart'
import ProjectInfoStrip from '@/components/dashboard/project-evaluation/ProjectInfoStrip'
import '@/styles/general.css'

function ProjectEvaluation() {
  const [maxYears, setMaxYears] = useState(10)
  const { 
    projectMetrics, 
    cashflowData, 
    businessModel, 
    loading, 
    error,
    projectEvaluationProjections,
    manufacturingProjections,
    forecastingMethods,
    updateForecastingMethod,
  } = useDashboard()

  const projections = projectEvaluationProjections || manufacturingProjections

  if (loading) {
    return (
      <div className='view-child'>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Loading dashboard...
          </Typography>
        </Box>
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

  if (projections) {
    const { bestLifetime, metricsByLifetime, cashflows } = projections
    
    const maxAvailableYears = metricsByLifetime?.length || 0
    const effectiveMaxYears = Math.min(maxYears, maxAvailableYears || 1)
    
    const displayMetrics = metricsByLifetime?.find(m => m.lifetime === effectiveMaxYears) 
      || metricsByLifetime?.[metricsByLifetime.length - 1]
    const trema = businessModel?.premises?.trema || 0
    const demandMethods = businessModel?.demand?.availableForecastingMethods || ['sma', 'slr']

    if (!displayMetrics || !cashflows) {
      return (
        <div className='view-child'>
          <Typography>Could not compute project metrics from cash flow data.</Typography>
        </div>
      )
    }

    return (
      <div className='view-child' style={{ paddingRight: 0 }}>
        <Box sx={{ mb: 3, pr: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: '600' }}>
                Project Evaluation
              </Typography>
              <Typography variant='subtitle1' color="text.secondary">
                {businessModel?.metadata?.name || 'Business'} | NPV optimization (from CBM cash flows)
              </Typography>
            </Box>
            
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="demand-forecast-method">Demand forecast</InputLabel>
              <Select
                labelId="demand-forecast-method"
                value={forecastingMethods?.demand || 'sma'}
                label="Demand forecast"
                onChange={(e) => updateForecastingMethod('demand', e.target.value)}
              >
                {demandMethods.map((method) => (
                  <MenuItem key={method} value={method}>{method.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ pr: 3 }}>
          <MetricsCards 
            metrics={displayMetrics} 
            maxYears={effectiveMaxYears}
            lifetimeInfo={bestLifetime}
          />

          <ProjectInfoStrip 
            bestLifetime={bestLifetime}
            irr={displayMetrics.irr}
            trema={trema}
          />
        </Box>

        <Grid container spacing={3} sx={{ mb: 2, pr: 0 }}>
          <Grid item xs={12} lg={3}>
            <NPVByLifetimeChart 
              metricsByLifetime={metricsByLifetime}
              bestLifetime={bestLifetime}
              maxYears={effectiveMaxYears}
            />
          </Grid>

          <Grid item xs={12} lg={9}>
            <CashflowChartJS 
              cashflows={cashflows}
              bestLifetime={bestLifetime}
              maxYears={maxYears}
              onMaxYearsChange={setMaxYears}
              businessName={businessModel?.metadata?.name || 'Business'}
            />
          </Grid>
        </Grid>
      </div>
    )
  }

  if (!projectMetrics || !cashflowData) {
    return (
      <div className='view-child'>
        <Typography>No project data available</Typography>
      </div>
    )
  }

  return (
    <div className='view-child'>
      <div className='view-title'>
        <Typography variant='h4' sx={{ fontWeight: '600' }}>
          Project Evaluation
        </Typography>
        <Typography variant='subtitle1' color="text.secondary">
          Financial feasibility analysis and cashflow projections
        </Typography>
      </div>

      <MetricsCards metrics={projectMetrics} />

      <CashflowChart 
        chartData={cashflowData.chartData} 
        stats={cashflowData.stats}
      />

      <ProjectSummary 
        metrics={projectMetrics}
        businessModel={businessModel}
      />
    </div>
  )
}

export default ProjectEvaluation
