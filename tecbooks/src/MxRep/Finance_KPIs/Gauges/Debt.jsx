import React, { useState, useEffect } from 'react'
import Gauge from '../../Novus Components/Gauge'
import { Typography } from '@mui/material'

function Debt() {

  return (
    <div style={{ width: '100%' }}>
      {/* <div className='whitecard-label' 
        style={{ paddingBottom: '0.5rem', width: '95%', textAlign: 'left', margin: '0 auto' }}>
        <i>Debt</i>
      </div> */}
      
      <Gauge percentage={43} size={120} metric={"oee"} />
      <Typography variant="subtitle2" sx={{ color: '#212121'}}>Debt Ratio</Typography>
      {/* <Typography variant="subtitle2">Debt</Typography> */}
    </div>
  )
}

export default Debt
