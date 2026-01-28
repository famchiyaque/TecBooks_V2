import React from 'react'
import { useLegacySimData } from '@/dashboard/contexts/LegacySimDataContext'
import Typography from '@mui/material/Typography'

function Sales({ period, year }) {
  const { simData } = useLegacySimData()
  const sales = simData?simData.salesThisMonth:0

  return (
    <div className='margin-box'>
      <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Sales</i></div>
      </div>
      <div>
        <p style={{ display: 'inline' }}>$</p>
        <Typography variant="h4"  style={{ display: 'inline' }}>{sales}</Typography>
      </div>
    </div>
  )
}

export default Sales