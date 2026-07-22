import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DashboardProvider, LegacySimDataProvider } from '@/contexts'
import { hydrateCanonicalBusinessModel } from '@/models/canonical-business-model'
import Layout from './Layout'
import ProjectEvaluation from './ProjectEvaluation'
import Overview from './Overview'
import Accounting from './Accounting'
import Forecasts from './Forecasts'
import Finances from './Finances'
import { Typography, Box, CircularProgress } from '@mui/material'
import '@/styles/homepage.css'
import '@/styles/general.css'

/**
 * Dashboard Entry Point
 *
 * This component wraps the dashboard with the DashboardProvider
 * and accepts a businessModel from either props or location state.
 * The Provider must wrap the Routes to make context available to all components.
 *
 * LegacySimDataProvider wraps Finance KPIs only (static demo sim data).
 * Canonical statements live at Accounting.
 */
function Dashboard({ businessModel: propBusinessModel }) {
  const location = useLocation()
  const [businessModel, setBusinessModel] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let model = propBusinessModel || location.state?.businessModel
    
    if (!model) {
      const storedModel = sessionStorage.getItem('currentBusinessModel')
      if (storedModel) {
        try {
          model = JSON.parse(storedModel)
        } catch (err) {
          console.error('[Dashboard] Error parsing stored model:', err)
        }
      }
    }

    if (model) {
      model = hydrateCanonicalBusinessModel(model)
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
      <LegacySimDataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="project-evaluation" />} />
            <Route path="project-evaluation" element={<ProjectEvaluation />} />
            <Route path="overview" element={<Overview />} />
            <Route path="accounting" element={<Accounting />} />
            <Route path="forecasts" element={<Forecasts />} />
            <Route path="finances" element={<Finances />} />
          </Route>
        </Routes>
      </LegacySimDataProvider>
    </DashboardProvider>
  )
}

export default Dashboard
