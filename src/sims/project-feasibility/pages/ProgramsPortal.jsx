import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '@/contexts/AuthContext'
import SimCard from '@/components/home/SimCard'
import { listProgramsRequest } from '../api/programs.api'

const PROGRAM_CARD_TITLE = 'Project Feasibility Simulation'
const PROGRAM_CARD_DESC = 'Evaluate whether a project is financially and operationally viable before committing resources.'
const PROGRAM_CARD_IMAGE = 'business_landing.png'

function ProgramsPortal() {
  const { user } = useAuth()
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
            <SimCard
              key={program.id}
              title={PROGRAM_CARD_TITLE}
              desc={PROGRAM_CARD_DESC}
              img_path={PROGRAM_CARD_IMAGE}
              sim_route={`/sims/project-feasibility/programs/${program.id}`}
              requireAuth
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ProgramsPortal
