import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '@/contexts/AuthContext'
import { PageTour } from '@/tours/PageTour'
import TourButton from '@/components/global/TourButton'
import { projectDisplayName } from '../model/programExtractors'
import { usePrograms } from './ProgramsContext.jsx'

const programsPortalTour = new PageTour([
  {
    element: '#add-project-btn',
    popover: {
      title: 'Upload a project',
      description: 'Upload your InputNovus Excel file here to create a new program.',
    },
  },
  {
    element: '#programs-list',
    popover: {
      title: 'Your programs',
      description: 'Click any project link to open its dashboard and cost table.',
    },
  },
])

function ProgramsPortal() {
  const { user } = useAuth()
  const { programs, status } = usePrograms()

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#073a5a' }}>
              Project Feasibility Simulation
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.8 }}>
              Welcome{user?.first_name ? `, ${user.first_name}` : ''}.
            </Typography>
          </Box>
          <TourButton tour={programsPortalTour} />
        </Box>

        <Button
          id="add-project-btn"
          component={RouterLink}
          to="new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#1e90ff', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap' }}
        >
          Add Project
        </Button>
      </Box>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Couldn't load your programs. Please try again.
        </Alert>
      )}

      {status === 'ready' && programs.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No project programs have been created yet.
        </Alert>
      )}

      {status === 'ready' && programs.length > 0 && (
        <Box id="programs-list" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, mt: 4 }}>
          {programs.map((program) => (
            <Card key={program.id} sx={{ borderRadius: 2, boxShadow: '0 0 0 1px rgba(7, 58, 90, 0.12)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#073a5a' }}>
                  {program.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 1.5 }}>
                  {program.projects?.length ?? 0} project{(program.projects?.length ?? 0) === 1 ? '' : 's'}
                </Typography>
                {(program.projects ?? []).map((project) => (
                  <Typography key={project.id} variant="body2" sx={{ mb: 0.5 }}>
                    <RouterLink
                      to={`${program.id}/${project.id}`}
                      style={{ color: '#1e90ff', textDecoration: 'none' }}
                    >
                      {projectDisplayName(project) || `Project ${project.id}`}
                    </RouterLink>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ProgramsPortal
