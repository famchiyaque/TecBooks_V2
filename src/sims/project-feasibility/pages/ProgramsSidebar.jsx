import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import {
  Box,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { usePrograms } from './ProgramsContext.jsx'

const PROJECT_PATH = (programId, projectId) =>
  `/sims/project-feasibility/programs/${programId}/${projectId}`

function ProgramsSidebar() {
  const { sidebarPrograms, status } = usePrograms()
  const { programId, projectId } = useParams()
  const [openIds, setOpenIds] = useState(() => new Set())

  useEffect(() => {
    if (!programId) return
    setOpenIds((current) => {
      const next = new Set(current)
      next.add(String(programId))
      return next
    })
  }, [programId])

  const toggleProgram = (id) => {
    setOpenIds((current) => {
      const next = new Set(current)
      const key = String(id)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid rgba(7, 58, 90, 0.12)',
        bgcolor: '#f4f7fa',
        height: '94vh',
        overflowY: 'auto',
        textAlign: 'left',
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          component={NavLink}
          to="/sims/project-feasibility/programs"
          variant="overline"
          sx={{ color: '#073a5a', letterSpacing: 1, textDecoration: 'none' }}
        >
          Programas
        </Typography>
      </Box>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {status === 'error' && (
        <Typography sx={{ px: 2, fontSize: 14, color: 'error.main' }}>
          No se pudieron cargar los programas.
        </Typography>
      )}

      {status === 'ready' && sidebarPrograms.length === 0 && (
        <Typography sx={{ px: 2, fontSize: 14, opacity: 0.7 }}>
          Aún no hay programas.
        </Typography>
      )}

      {status === 'ready' && (
        <List disablePadding>
          {sidebarPrograms.map((program) => {
            const isOpen = openIds.has(String(program.id))
            return (
              <Box key={program.id}>
                <ListItemButton onClick={() => toggleProgram(program.id)} sx={{ px: 2 }}>
                  <ListItemText
                    primary={program.name}
                    primaryTypographyProps={{ fontWeight: 600, color: '#073a5a' }}
                  />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {program.projects.map((project) => {
                      const selected =
                        String(program.id) === String(programId)
                        && String(project.id) === String(projectId)
                      return (
                        <ListItemButton
                          key={project.id}
                          component={NavLink}
                          to={PROJECT_PATH(program.id, project.id)}
                          selected={selected}
                          sx={{ pl: 4, '&.active, &.Mui-selected': { bgcolor: 'rgba(30, 144, 255, 0.12)' } }}
                        >
                          <ListItemText primary={project.name} />
                        </ListItemButton>
                      )
                    })}
                  </List>
                </Collapse>
              </Box>
            )
          })}
        </List>
      )}
    </Box>
  )
}

export default ProgramsSidebar
