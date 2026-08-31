import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Button, List, ListItem, ListItemText, Typography, CircularProgress, Alert,
} from '@mui/material'
import { listProgramsRequest } from '../api/programs.api'

function ProgramsPortal() {
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
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto', textAlign: 'left' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
        Programas
      </Typography>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudieron cargar tus programas. Intenta de nuevo.
        </Alert>
      )}

      {status === 'ready' && programs.length === 0 && (
        <Typography sx={{ mb: 2, opacity: 0.85 }}>
          Aún no hay programas registrados. Crea uno.
        </Typography>
      )}

      {status === 'ready' && programs.length > 0 && (
        <List>
          {programs.map((program) => (
            <ListItem key={program.id} disableGutters alignItems="flex-start">
              <ListItemText
                primary={program.name}
                secondary={
                  <>
                    {new Date(program.createdAt).toLocaleDateString()}
                    {' — '}
                    {program.projects.length} proyecto{program.projects.length === 1 ? '' : 's'}:{' '}
                    {program.projects.map((project) => project.name).join(', ')}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        component={RouterLink}
        to="new"
        variant="contained"
        sx={{ bgcolor: '#073a5a', borderRadius: 999, px: 3 }}
      >
        Nuevo programa
      </Button>
    </Box>
  )
}

export default ProgramsPortal
