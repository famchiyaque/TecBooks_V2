import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, CircularProgress, Alert,
  Card, CardMedia, CardContent, CardActions,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EastIcon from '@mui/icons-material/East'
import { useAuth } from '@/contexts/AuthContext'
import { listProgramsRequest } from '../api/programs.api'

const PROGRAM_CARD_IMAGE = 'business_landing.png'

function ProgramCard({ program, onClick }) {
  const projectNames = program.projects.map((project) => project.name)

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
      <CardMedia sx={{ height: 140 }} image={`/imgs/${PROGRAM_CARD_IMAGE}`} title={program.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {program.name}
        </Typography>
        {projectNames.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sin proyectos todavía.
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {projectNames.length} proyecto{projectNames.length === 1 ? '' : 's'}: {projectNames.join(', ')}
          </Typography>
        )}
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

function ProgramsPortal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [programs, setPrograms] = React.useState([])
  const [status, setStatus] = React.useState('loading')

  React.useEffect(() => {
    let cancelled = false

    listProgramsRequest()
      .then((data) => {
        if (cancelled) return
        setPrograms(data)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => { cancelled = true }
  }, [])

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#073a5a' }}>
            Project Feasibility Simulation
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.8 }}>
            Welcome{user?.first_name ? `, ${user.first_name}` : ''}.
          </Typography>
        </Box>

        <Button
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
          No se pudieron cargar tus programas. Intenta de nuevo.
        </Alert>
      )}

      {status === 'ready' && programs.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No project programs have been created yet.
        </Alert>
      )}

      {status === 'ready' && programs.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mt: 4 }}>
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={() => navigate(`/sims/project-feasibility/programs/${program.id}`)}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ProgramsPortal
