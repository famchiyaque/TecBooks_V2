import React from 'react'
import { useLocation } from 'react-router-dom'
import { DashboardProvider } from '@/core/store'
import DashboardRouter from './Router'
import { Typography, Box } from '@mui/material'

/**
 * Dashboard Entry Point
 * 
 * This component wraps the dashboard with the DashboardProvider
 * and accepts a businessModel from either props or location state.
 */
function Dashboard({ businessModel: propBusinessModel }) {
  const location = useLocation()
  const businessModel = propBusinessModel || location.state?.businessModel

  // If no business model is provided, show a message
  if (!businessModel) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
        sx={{ px: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          No Business Data Available
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Please upload an Excel template or create a project through one of our input methods.
        </Typography>
      </Box>
    )
  }

  return (
    <DashboardProvider businessModel={businessModel}>
      <DashboardRouter />
    </DashboardProvider>
  )
}

export default Dashboard
