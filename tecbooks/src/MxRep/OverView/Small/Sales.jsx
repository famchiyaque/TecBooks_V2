import React from 'react'
import Typography from '@mui/material/Typography'
import { useSimData } from '../../SimDataContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Sales() {
  const { simData } = useSimData()
  const color = 'green'
  const change = 6.43
  const changeColor = 'green'

  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number).substring(1,10)
  }

  const position = formatToCurrency(simData.lifetimeSales)

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <p style={{ display: 'inline' }}>$</p>
          <Typography variant="h4"  style={{ display: 'inline' }}>{position}</Typography>
        </div>
        <div className='top-box-subtitle'>
          <Typography style={{ display: 'inline' }} variant="subtitle1">Team Lifetime Sales</Typography>
          <p style={{ display: 'inline', color: changeColor, fontSize: 'small' }}>&nbsp;&nbsp;+{change}%</p>

        </div>
      </div>
      
      <div className='top-box-image'>
          <TrendingUpIcon sx={{ fontSize: '35px', color: `${color}` }} />
      </div>
    </>
  )
}

export default Sales