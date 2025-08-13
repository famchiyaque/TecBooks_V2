import React from 'react'
import { useSimData } from '../../SimDataContext'
import Typography from '@mui/material/Typography'

function Capital() {
  const { simData } = useSimData
  const capital = 12412

  return (
    <div style={{ width: '30%' }}>
      {/* <Typography variant="subtitle2" sx={{ color: '#212121'}}>Working Capital</Typography> */}
      <div>
        <p style={{ display: 'inline' }}>$</p>
        <Typography variant="h4"  style={{ display: 'inline' }}>2140</Typography>
      </div>
    </div>
  )
}

export default Capital