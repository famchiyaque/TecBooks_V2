import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography } from '@mui/material'
import { useStaging } from '../staging/StagingContext.jsx'

function ProjectDropzone() {
  const { addFiles, isParsing } = useStaging()

  const onDrop = useCallback(
    (acceptedFiles) => {
      addFiles(acceptedFiles)
    },
    [addFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isParsing,
    multiple: true,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #073a5a',
        borderRadius: '20px',
        padding: 4,
        textAlign: 'center',
        cursor: isParsing ? 'wait' : 'pointer',
        backgroundColor: isDragActive ? '#f0f8ff' : 'transparent',
      }}
    >
      <input {...getInputProps()} />
      <Typography sx={{ color: '#073a5a' }}>
        {isParsing
          ? 'Reading Excel…'
          : isDragActive
            ? 'Drop the files here'
            : 'Drag one or more project Excel files (.xlsx), or click to choose'}
      </Typography>
    </Box>
  )
}

export default ProjectDropzone
