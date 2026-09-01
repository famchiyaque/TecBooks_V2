import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import { useStaging } from '../staging/StagingContext.jsx'
import ProjectDropzone from './ProjectDropzone.jsx'
import BackButton from '@/components/global/BackButton'

function NewProgram() {
  const navigate = useNavigate()
  const {
    programName,
    setProgramName,
    items,
    fileErrors,
    confirmError,
    isSubmitting,
    canConfirm,
    remove,
    confirm,
  } = useStaging()

  const onConfirm = async () => {
    const createdProgram = await confirm()
    if (createdProgram) {
      navigate('..', { replace: true, state: { createdProgram } })
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto', textAlign: 'left' }}>
      <BackButton label="Programas" sx={{ mb: 1, ml: -1 }} />

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
        Nuevo programa
      </Typography>

      <TextField
        label="Nombre del programa"
        fullWidth
        value={programName}
        onChange={(event) => setProgramName(event.target.value)}
        sx={{ mb: 3 }}
      />

      <ProjectDropzone />

      {fileErrors.map((error) => (
        <Alert key={error.fileName || error.messages[0]} severity="error" sx={{ mt: 2 }}>
          {error.fileName ? `${error.fileName}: ` : ''}
          {error.messages.join(' ')}
        </Alert>
      ))}

      {confirmError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {confirmError}
        </Alert>
      )}

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600, color: '#073a5a' }}>
        Proyectos en staging
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ opacity: 0.8 }}>Aún no hay proyectos validados.</Typography>
      ) : (
        <List>
          {items.map((item, index) => (
            <ListItem
              key={`${item.fileName}-${index}`}
              secondaryAction={
                <IconButton edge="end" aria-label="quitar" onClick={() => remove(index)}>
                  <DeleteOutline />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.project.metadata.name || item.fileName}
                secondary={
                  item.validation.warnings?.length
                    ? item.validation.warnings.join(' ')
                    : item.fileName
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        disabled={!canConfirm}
        onClick={onConfirm}
        sx={{ mt: 3, bgcolor: '#073a5a', borderRadius: 999, px: 3 }}
      >
        {isSubmitting ? 'Guardando…' : 'Confirmar programa'}
      </Button>
    </Box>
  )
}

export default NewProgram
