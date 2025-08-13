import React from 'react'
import Typography from '@mui/material/Typography'
import { useSimData } from '../../SimDataContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'


function Capital() {
  const { simData } = useSimData()
  const color = 'red'

  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number).substring(1,8)
  }
  const position = formatToCurrency(simData.teamCurrentMoney)
  const change = -4320
  let changeColor, prefix
  if (change > 0) changeColor = 'green'
  else {
    changeColor = 'red'
    prefix = '-'
  } 

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <p style={{ display: 'inline' }}>$</p>
          <Typography variant="h4"  style={{ display: 'inline' }}>{position}</Typography>
        </div>
        <div className='top-box-subtitle'>
          <Typography style={{ display: 'inline' }} variant="subtitle1">Team Capital</Typography>
          <p style={{ display: 'inline', color: changeColor, fontSize: 'small' }}>&nbsp;&nbsp;{change}</p>
        </div>
      </div>
      
      <div className='top-box-image'>
          <TrendingDownIcon sx={{ fontSize: '35px', color: `${color}` }} />
      </div>
    </>
  )
}

export default Capital