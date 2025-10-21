import React from 'react'
import { Typography } from '@mui/material'

function ROS() {
  return (
    <div className='ros-flex'>
      {/* <div className='whitecard-appbar'>
        <div className='whitecard-label'><i>Return on Sales</i></div>
      </div> */}
      <Typography variant='h6' style={{ display: 'inline' }}>Return on Sales</Typography>
      <div style={{ display: 'inline' }}>
        <Typography variant="h4"  style={{ display: 'inline' }}>24</Typography>
        <p style={{ display: 'inline' }}>%</p>
      </div>
    </div>
  )
}

export default ROS