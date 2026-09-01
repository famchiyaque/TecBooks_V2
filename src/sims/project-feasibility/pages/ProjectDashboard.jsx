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
import Expenses from '@/components/sims/program/Expenses'
import CollapsibleSection from '@/components/global/CollapsibleSection'
import { PageTour } from '@/tours/PageTour'
import TourButton from '@/components/global/TourButton'
import { HORIZON_YEARS } from '../constants'
import { findProgramProject, projectDisplayName } from '../model/programExtractors'
import { usePrograms } from './ProgramsContext.jsx'
import ProjectCostSummary from '../costTable/ProjectCostSummary.jsx'

const TABS = [
  { id: 'balance', label: 'Balance Sheet' },
  { id: 'razones', label: 'Ratios' },
  { id: 'flujo', label: 'Cash Flow' },
  { id: 'resultados', label: 'Income Statement' },
]

const projectDashboardTour = new PageTour([
  {
    element: '#project-dashboard-tabs',
    popover: {
      title: 'Financial statements',
      description: 'Switch between Balance Sheet, Ratios, Cash Flow and Income Statement.',
    },
  },
  {
    element: '#project-dashboard-content',
    popover: {
      title: 'Ratios tab',
      description: 'Expenses and your Cost Table live here, each collapsible so you can focus on one at a time.',
    },
  },
])

const MOCK_ROWS = ['Activo', 'Pasivo', 'Capital', 'Total']

function MockStatement({ title }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Construction sx={{ color: '#c77800' }} />
        <Typography sx={{ color: '#073a5a' }}>
          {title} — under construction
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Concept</TableCell>
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
        <Alert severity="error">Couldn't load the programs.</Alert>
      </Box>
    )
  }

  if (!program || !project) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Project not found.</Alert>
      </Box>
    )
  }

  const activeTab = TABS[tab]

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Typography variant="overline" sx={{ color: '#073a5a' }}>
        {program.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 0 }}>
          {projectDisplayName(project)}
        </Typography>
        <TourButton tour={projectDashboardTour} />
      </Box>

      <Tabs
        id="project-dashboard-tabs"
        value={tab}
        onChange={(_, next) => setTab(next)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((item) => (
          <Tab key={item.id} label={item.label} />
        ))}
      </Tabs>

      <Box id="project-dashboard-content">
        {activeTab.id === 'razones' ? (
          <Box sx={{ mt: 2 }}>
            <Expenses />
            <CollapsibleSection title="Cost Table" defaultExpanded>
              <ProjectCostSummary project={project} />
            </CollapsibleSection>
          </Box>
        ) : (
          <MockStatement key={`${programId}-${projectId}-${activeTab.id}`} title={activeTab.label} />
        )}
      </Box>
    </Box>
  )
}

export default ProjectDashboard
