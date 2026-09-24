import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, Chip, Collapse, IconButton, Stack, TextField, Typography } from '@mui/material'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'
import { useStaging } from '../staging/StagingContext.jsx'
import ProjectDropzone from './ProjectDropzone.jsx'
import BackButton from '@/components/global/BackButton'

function StagedProjectCard({ item, onRemove }) {
  const [warningsOpen, setWarningsOpen] = useState(false)
  const warnings = item.validation.warnings ?? []

  return (
    <Card
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, borderColor: 'rgba(7, 58, 90, 0.15)' }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, color: '#073a5a' }} noWrap>
            {item.project.metadata.name || item.fileName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }} noWrap>
            {item.fileName}
          </Typography>
        </Box>
        <IconButton edge="end" aria-label="remove" onClick={onRemove} size="small">
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Stack>

      {warnings.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Chip
            icon={<WarningAmberOutlined fontSize="small" />}
            label={`${warnings.length} warning${warnings.length > 1 ? 's' : ''}`}
            size="small"
            color="warning"
            variant="outlined"
            onClick={() => setWarningsOpen((open) => !open)}
            deleteIcon={<ExpandMoreOutlined sx={{ transform: warningsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />}
            onDelete={() => setWarningsOpen((open) => !open)}
            sx={{ cursor: 'pointer' }}
          />
          <Collapse in={warningsOpen}>
            <Stack spacing={0.5} sx={{ mt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'warning.light' }}>
              {warnings.map((warning, i) => (
                <Typography key={i} variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                  {warning}
                </Typography>
              ))}
            </Stack>
          </Collapse>
        </Box>
      )}
    </Card>
  )
}

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
    <Box sx={{ p: 4 }}>
      <BackButton label="Programs" sx={{ mb: 1, ml: -1 }} />

      <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'left' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a', mb: 2 }}>
        New program
      </Typography>

      <TextField
        label="Program name"
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
        Staged projects
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ opacity: 0.8 }}>No validated projects yet.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <StagedProjectCard
              key={`${item.fileName}-${index}`}
              item={item}
              onRemove={() => remove(index)}
            />
          ))}
        </Stack>
      )}

      <Button
        variant="contained"
        disabled={!canConfirm}
        onClick={onConfirm}
        sx={{ mt: 3, bgcolor: '#073a5a', borderRadius: 999, px: 3 }}
      >
        {isSubmitting ? 'Saving…' : 'Confirm program'}
      </Button>
      </Box>
    </Box>
  )
}

export default NewProgram
