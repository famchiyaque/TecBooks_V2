import React from 'react'
import { DashboardProvider } from '@/core/store'
import DashboardRouter from './Router'

/**
 * Dashboard Entry Point
 * 
 * This component wraps the dashboard with the DashboardProvider
 * and accepts a businessModel prop to initialize the dashboard.
 */
function Dashboard({ businessModel }) {
  return (
    <DashboardProvider businessModel={businessModel}>
      <DashboardRouter />
    </DashboardProvider>
  )
}

export default Dashboard
