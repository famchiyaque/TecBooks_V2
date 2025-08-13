import React from 'react'
import { Typography } from '@mui/material'
import { useSimData } from '../../SimDataContext'

function Gross() {
  const { simData } = useSimData()
  const gross = simData.salesThisMonth - simData.costsThisMonth

  return (
    <div className='margin-box'>
      <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Gross Profit</i></div>
      </div>
      <div>
        <p style={{ display: 'inline' }}>$</p>
        <Typography variant="h4"  style={{ display: 'inline' }}>{gross}</Typography>
      </div>
    </div>
  )
}

export default Gross