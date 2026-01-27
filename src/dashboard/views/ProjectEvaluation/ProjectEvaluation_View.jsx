import React from 'react'
import { useDashboard } from '@/core/store'
import { Typography, Card, CardContent, Grid } from '@mui/material'
import MetricsCards from './components/MetricsCards'
import CashflowChart from './components/CashflowChart'
import ProjectSummary from './components/ProjectSummary'
import '@/styles/general.css'

function ProjectEvaluation_View() {
  const { projectMetrics, cashflowData, businessModel, loading, error } = useDashboard()

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
