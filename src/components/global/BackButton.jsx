import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function BackButton({ label = 'Back', sx }) {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate(-1)}
      startIcon={<ArrowBackIcon />}
      sx={{ color: '#073a5a', fontWeight: 600, ...sx }}
    >
      {label}
    </Button>
  )
}

export default BackButton
