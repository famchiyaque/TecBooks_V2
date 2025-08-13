import React from 'react'
import Typography from '@mui/material/Typography'
import { useSimData } from '../../SimDataContext'
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


function LeaderBoard() {
  const { simData } = useSimData()
  const position = simData.leaderboard
  const color = 'green'
  const change = 1
  const changeColor = 'green'
  let suffix

  if (position == 1) suffix = "st"
  else if (position == 2) suffix = "nd"
  else if (position == 3) suffix = "rd"
  else suffix = "th"

  return (
    <>
      <div className='top-box-content'>
        <div className='top-box-metric'>
          <Typography variant="h4" style={{ display: 'inline' }}>{position}</Typography>
          <p style={{ display: 'inline' }}>{suffix}</p>
        </div>
        <div className='top-box-subtitle'>
          <Typography style={{ display: 'inline' }} variant="subtitle1">Leaderboard Position</Typography>
          <p style={{ display: 'inline', color: changeColor, fontSize: 'small' }}>&nbsp;&nbsp;+{change}</p>
        </div>
      </div>
      <div className='top-box-image'>
        <TrendingUpIcon sx={{ fontSize: '35px', color: `${color}` }} />
      </div>
    </>
  )
}

export default LeaderBoard