import React from 'react'
import { Box, Typography } from '@mui/material'
import GenericHeader from '@/components/global/GenericHeader'
import { useAuth } from '@/contexts/AuthContext'

function ProjectFeasibility() {
  const { user } = useAuth()

  return (
    <>
      <GenericHeader pageName="Project Feasibility Simulation" />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#073a5a' }}>
          Project Feasibility Simulation
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Bienvenido{user?.first_name ? `, ${user.first_name}` : ''}. Simulador en construcción.
        </Typography>
      </Box>
    </>
  )
}

export default ProjectFeasibility
