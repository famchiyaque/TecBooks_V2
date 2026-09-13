import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { ProgramsProvider } from './ProgramsContext.jsx'
import ProgramsSidebar from './ProgramsSidebar.jsx'

function ProgramsWorkspace() {
  return (
    <ProgramsProvider>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flex: 1,
          minHeight: 0,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <ProgramsSidebar />
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </ProgramsProvider>
  )
}

export default ProgramsWorkspace
