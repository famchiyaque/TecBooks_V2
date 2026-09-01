import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import Construction from '@mui/icons-material/Construction'
import { HORIZON_YEARS } from '../constants'
import { findProgramProject, projectDisplayName } from '../model/programExtractors'
import { usePrograms } from './ProgramsContext.jsx'

const TABS = [
  { id: 'balance', label: 'Balance General' },
  { id: 'razones', label: 'Razones' },
  { id: 'flujo', label: 'Flujo de Efectivo' },
  { id: 'resultados', label: 'Estado de Resultados' },
]

const MOCK_ROWS = ['Activo', 'Pasivo', 'Capital', 'Total']

function MockStatement({ title }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Construction sx={{ color: '#c77800' }} />
        <Typography sx={{ color: '#073a5a' }}>
          {title} — en construcción
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
            {HORIZON_YEARS.slice(0, 4).map((year) => (
              <TableCell key={year} align="right" sx={{ fontWeight: 700 }}>
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {MOCK_ROWS.map((row) => (
            <TableRow key={row}>
              <TableCell>{row}</TableCell>
              {HORIZON_YEARS.slice(0, 4).map((year) => (
                <TableCell key={year} align="right">—</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

function ProjectDashboard() {
  const { programId, projectId } = useParams()
  const { programs, status } = usePrograms()
  const [tab, setTab] = useState(0)
  const { program, project } = findProgramProject(programs, programId, projectId)

  if (status === 'loading') return null

  if (status === 'error') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">No se pudieron cargar los programas.</Alert>
      </Box>
    )
  }

  if (!program || !project) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">No se encontró este proyecto.</Alert>
      </Box>
    )
  }

  const activeTab = TABS[tab]

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Typography variant="overline" sx={{ color: '#073a5a' }}>
        {program.name}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
        {projectDisplayName(project)}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((item) => (
          <Tab key={item.id} label={item.label} />
        ))}
      </Tabs>

      <MockStatement key={`${programId}-${projectId}-${activeTab.id}`} title={activeTab.label} />
    </Box>
  )
}

export default ProjectDashboard
