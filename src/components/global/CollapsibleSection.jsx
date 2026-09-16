import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoTooltip from '@/components/global/InfoTooltip'

function CollapsibleSection({ title, tooltip, defaultExpanded = false, children }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      sx={{
        '&:before': { display: 'none' },
        borderRadius: '12px !important',
        border: '1px solid rgba(7, 58, 90, 0.12)',
        boxShadow: 'none',
        mb: 2,
        overflow: 'hidden',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(7, 58, 90, 0.03)' }}>
        <Typography sx={{ fontWeight: 700, color: '#073a5a', display: 'inline-flex', alignItems: 'center' }}>
          {title}
          <InfoTooltip title={tooltip} />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}

export default CollapsibleSection
