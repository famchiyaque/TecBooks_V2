import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

/** Drop anywhere on a page to launch that page's PageTour instance. */
function TourButton({ tour, label = 'Ver guía de la página', sx }) {
  return (
    <Tooltip title={label}>
      <IconButton onClick={() => tour.start()} aria-label={label} sx={{ color: '#073a5a', ...sx }}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  )
}

export default TourButton
