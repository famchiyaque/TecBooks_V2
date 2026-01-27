import React, { useState } from 'react'
import { useDashboard } from '@/core/store'
import { Typography, Card, CardContent, Grid, Box, CircularProgress } from '@mui/material'
import MetricsCards from './components/MetricsCards'
import CashflowChart from './components/CashflowChart'
import CashflowChartJS from './components/CashflowChartJS'
import ProjectSummary from './components/ProjectSummary'
import NPVByLifetimeChart from './components/NPVByLifetimeChart'
import ProjectInfoStrip from './components/ProjectInfoStrip'
import DemandProjectionMethodSelector from './components/DemandProjectionMethodSelector'
import '@/styles/general.css'

function ProjectEvaluation_View() {
  const { 
    projectMetrics, 
    cashflowData, 
    businessModel, 
    loading, 
    error,
    manufacturingProjections,
    demandProjectionMethod,
    setDemandProjectionMethod,
  } = useDashboard()

  // Check if this is a manufacturing business
  const isManufacturing = manufacturingProjections !== null;

  if (loading) {
    return (
      <div className='view-child'>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Calculating 10-year projections...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Analyzing NPV optimization, cashflows, and project metrics
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

  // Manufacturing business view
  if (isManufacturing && manufacturingProjections) {
    const { bestLifetime, metricsByLifetime, cashflows } = manufacturingProjections;
    const [maxYears, setMaxYears] = useState(10);
    // Use metrics for maxYears instead of bestLifetime to match the chart
    const displayMetrics = metricsByLifetime.find(m => m.lifetime === maxYears) || metricsByLifetime[metricsByLifetime.length - 1];
    const trema = businessModel?.premises?.trema || 0;

    return (
      <div className='view-child' style={{ paddingRight: 0 }}>
        {/* Header */}
        <Box sx={{ mb: 3, pr: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: '600' }}>
                Project Evaluation
              </Typography>
              <Typography variant='subtitle1' color="text.secondary">
                {businessModel?.metadata?.name || 'Manufacturing Business'} | NPV Optimization Analysis
              </Typography>
            </Box>
            
            {/* Demand Projection Method Selector */}
            <DemandProjectionMethodSelector 
              value={demandProjectionMethod}
              onChange={setDemandProjectionMethod}
            />
          </Box>
        </Box>

        {/* Key Metrics Cards (Using maxYears to match chart) */}
        <Box sx={{ pr: 3 }}>
          <MetricsCards 
            metrics={displayMetrics} 
            maxYears={maxYears}
            lifetimeInfo={bestLifetime}
          />

          {/* Project Info Strip - Viability + Recommended Lifetime */}
          <ProjectInfoStrip 
            bestLifetime={bestLifetime}
            irr={displayMetrics.irr}
            trema={trema}
          />
        </Box>

        {/* Charts Grid */}
        <Grid container spacing={3} sx={{ mb: 2, pr: 0 }}>
          {/* NPV by Lifetime Chart (35%) */}
          <Grid item xs={12} lg={4}>
            <NPVByLifetimeChart 
              metricsByLifetime={metricsByLifetime}
              bestLifetime={bestLifetime}
              maxYears={maxYears}
            />
          </Grid>

          {/* Cashflow Chart (65%) */}
          <Grid item xs={12} lg={8}>
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

  // Legacy view (non-manufacturing or fallback)
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

      {/* Key Metrics Cards - IRR, NPV, ROI, Break-even */}
      <MetricsCards metrics={projectMetrics} />

      {/* Cashflow Chart */}
      <CashflowChart 
        chartData={cashflowData.chartData} 
        stats={cashflowData.stats}
      />

      {/* Project Summary */}
      <ProjectSummary 
        metrics={projectMetrics}
        businessModel={businessModel}
      />
    </div>
  )
}

export default ProjectEvaluation_View
