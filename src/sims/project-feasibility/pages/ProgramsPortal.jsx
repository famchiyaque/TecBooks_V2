import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material'

function ProgramsPortal() {
  const location = useLocation()
  const createdProgram = location.state?.createdProgram

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto', textAlign: 'left' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
        Programas
      </Typography>

      {createdProgram ? (
        <>
          <Typography sx={{ mb: 1 }}>
            Programa creado: <strong>{createdProgram.name}</strong>
          </Typography>
          <List>
            {(createdProgram.projects ?? []).map((project) => (
              <ListItem key={project.id} disableGutters>
                <ListItemText primary={project.name} secondary={`id ${project.id}`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography sx={{ mb: 2, opacity: 0.85 }}>
          Aún no hay programa en esta sesión. Crea uno.
        </Typography>
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
