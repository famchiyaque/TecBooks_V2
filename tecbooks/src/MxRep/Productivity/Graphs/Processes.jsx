import React from 'react'
import Stack from '@mui/material/Stack'
import { Gauge } from '@mui/x-charts/Gauge'
import { useSimData } from '../../SimDataContext'
import { Typography } from '@mui/material'

function Processes() {
  const { simData } = useSimData()

  let cutting = simData?.cutting || 0
  let body = simData?.body || 0
  let assembly = simData?.assembly || 0
  let interior = simData?.interior || 0
  let exterior = simData?.exterior || 0
  let paint = simData?.paint || 0

  return (
    <div>
      <div className='process-flex processes-top'>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ position: 'relative',  paddingLeft: '35px' }}>
          <div className='top-process'><Typography variant="subtitle2">Cutting</Typography></div>
          <Gauge width={100} height={60} value={cutting} startAngle={-90} endAngle={90} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ position: 'relative',  paddingLeft: '35px' }}>
          <div className='top-process'><Typography variant="subtitle2">Assembly</Typography></div>
          <Gauge width={100} height={60} value={assembly} startAngle={-90} endAngle={90} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ position: 'relative',  paddingLeft: '35px' }}>
          <div className='top-process'><Typography variant="subtitle2">Exterior</Typography></div>
          <Gauge width={100} height={60} value={exterior} startAngle={-90} endAngle={90} />
        </Stack>
      </div>
      <div className='process-flex processes-bottom'>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ position: 'relative',  paddingLeft: '35px' }}>
          <Gauge width={100} height={60} value={body} startAngle={90} endAngle={270} />
          <div className='bottom-process'><Typography variant="subtitle2">Body</Typography></div>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}  style={{ position: 'relative',  paddingLeft: '35px' }}>
          <Gauge width={100} height={60} value={interior} startAngle={90} endAngle={270} />
          <div className='bottom-process'><Typography variant="subtitle2">Interior</Typography></div>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} style={{ position: 'relative',  paddingLeft: '35px' }}>
          <Gauge width={100} height={60} value={paint} startAngle={90} endAngle={270} />
          <div className='bottom-process'><Typography variant="subtitle2">Paint</Typography></div>
        </Stack>
      </div>
      
      <div className='labels-graph-flex'>
        <div className='proc-data'>

        </div>
        <div className='proc-bar-chart'>
          
        </div>
      </div>

    </div>
  )
}

export default Processes