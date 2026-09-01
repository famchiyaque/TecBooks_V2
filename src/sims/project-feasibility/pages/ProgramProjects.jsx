import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Typography, CircularProgress, Alert, Card, CardContent, CardActions,
} from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import BackButton from '@/components/global/BackButton'
import TourButton from '@/components/global/TourButton'
import { PageTour } from '@/tours/PageTour'
import { useProgram } from '../hooks/useProgram'

const programProjectsTour = new PageTour([
  {
    element: '#projects-list',
    popover: {
      title: 'Projects in this program',
      description: 'Each card is one uploaded Excel file. Click one to open its cost table.',
    },
  },
])

function ProjectCard({ project, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 345,
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, navy 0px 0px 0px 1px',
        borderRadius: '15px',
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cost table generated from this project.
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{ width: '100%', marginLeft: 'auto', paddingRight: '1rem' }}>
          <button className="learn-more continue-btn" style={{ color: '#eec60a' }}>
            Go To Sim
            <EastIcon sx={{ height: '100%', fontSize: '120%', fontWeight: 600 }} />
          </button>
        </div>
      </CardActions>
    </Card>
  )
}

function ProgramProjects() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const { program, status } = useProgram(programId)

  return (
    <Box sx={{ p: 4 }}>
      <BackButton label="Programs" sx={{ mb: 1, ml: -1 }} />

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'error' && (
        <Alert severity="error">Couldn't load the program. Please try again.</Alert>
      )}

      {status === 'not-found' && (
        <Alert severity="warning">Program not found.</Alert>
      )}

      {status === 'ready' && program && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#073a5a' }}>
              {program.name}
            </Typography>
            <TourButton tour={programProjectsTour} />
          </Box>

          {program.projects.length === 0 ? (
            <Typography sx={{ opacity: 0.85 }}>This program has no projects.</Typography>
          ) : (
            <Box id="projects-list" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
              {program.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`projects/${project.id}`)}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default ProgramProjects
