import { Typography } from '@mui/material'
import React from 'react'

function Cast({ title, total, color }) {

  return (
    <div className='cast' style={{ borderBottom: `solid ${color} 2px`}}>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body2">{total}</Typography>
    </div>
  )
}

export default Cast