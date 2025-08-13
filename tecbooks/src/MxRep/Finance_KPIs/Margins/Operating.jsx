import React from 'react'
import { Typography } from '@mui/material'
import { useSimData } from '../../SimDataContext'

function Operating() {
  const { simData } = useSimData()
  const operatingProfit = simData.salesThisMonth - simData.costsThisMonth - simData.expensesThisMonth

  return (
    <div className='margin-box'>
      <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Operating Profit</i></div>
      </div>
      <div>
        <p style={{ display: 'inline' }}>$</p>
        <Typography variant="h4"  style={{ display: 'inline' }}>{operatingProfit}</Typography>
      </div>
    </div>
  )
}

export default Operating