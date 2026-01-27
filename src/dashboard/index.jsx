import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DashboardProvider } from '@/core/store'
import MainLayout from './MainLayout'
import ProjectEvaluation_View from './views/ProjectEvaluation/ProjectEvaluation_View'
import Overview_View from './views/OverView/Overview_View'
import FinancialStatements_View from './views/FinancialStatements/FinancialStatements_View'
import Forecasts_View from './views/Forecasts/Forecasts_View'
import { Typography, Box, CircularProgress } from '@mui/material'
import '@/styles/homepage.css'
import '@/styles/general.css'

/**
 * Dashboard Entry Point
 * 
 * This component wraps the dashboard with the DashboardProvider
 * and accepts a businessModel from either props or location state.
 * The Provider must wrap the Routes to make context available to all components.
 */
function Dashboard({ businessModel: propBusinessModel }) {
  const location = useLocation()
  const [businessModel, setBusinessModel] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    console.log('[Dashboard] Initializing...')
    console.log('[Dashboard] Props businessModel:', propBusinessModel)
    console.log('[Dashboard] Location state:', location.state)
    console.log('[Dashboard] Location pathname:', location.pathname)
    
    // Try multiple sources for business model
    let model = propBusinessModel || location.state?.businessModel
    
    // If not found, try sessionStorage
    if (!model) {
      console.log('[Dashboard] Checking sessionStorage...')
      const storedModel = sessionStorage.getItem('currentBusinessModel')
      if (storedModel) {
        try {
          model = JSON.parse(storedModel)
          console.log('[Dashboard] Business model loaded from sessionStorage')
          console.log('[Dashboard] Stored model metadata:', model?.metadata)
        } catch (err) {
          console.error('[Dashboard] Error parsing stored model:', err)
        }
      } else {
        console.log('[Dashboard] No model found in sessionStorage')
      }
    }
    
    console.log('[Dashboard] Final businessModel:', model ? 'Found' : 'Not found')
    if (model) {
      console.log('[Dashboard] Model metadata:', model.metadata)
      console.log('[Dashboard] Model keys:', Object.keys(model))
    }
    
    setBusinessModel(model)
    setLoading(false)
  }, [propBusinessModel, location.state, location.pathname])

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
        sx={{ px: 3 }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading dashboard...
        </Typography>
      </Box>
    )
  }

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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Debug: pathname = {location.pathname}
        </Typography>
      </Box>
    )
  }

  return (
    <DashboardProvider businessModel={businessModel}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="project-evaluation" />} />
          <Route path="project-evaluation" element={<ProjectEvaluation_View />} />
          <Route path="overview" element={<Overview_View />} />
          <Route path="statements" element={<FinancialStatements_View />} />
          <Route path="forecasts" element={<Forecasts_View />} />
        </Route>
      </Routes>
    </DashboardProvider>
  )
}

export default Dashboard
