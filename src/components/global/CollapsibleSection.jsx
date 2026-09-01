import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/**
 * Reusable dropdown/accordion pattern for organizing a page with several
 * tables/sections. Drop any content in as children - used to group the
 * Expenses tables and the Cost Table under the Ratios tab, but works for
 * any other page that wants the same "click to expand" organization.
 */
function CollapsibleSection({ title, defaultExpanded = false, children }) {
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
        <Typography sx={{ fontWeight: 700, color: '#073a5a' }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}

export default CollapsibleSection
