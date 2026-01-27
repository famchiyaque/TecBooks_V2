import React from 'react'
import Typography from '@mui/material/Typography'
import PastTime from './PastTime'
import FutureTime from './FutureTime'

function TimeLine({ past, future, pastChange, futureChange }) {
  return (
    <div className="timelines-container whitecard-b">
        <div className="timelines-labels">
            <Typography variant='body1' sx={{ fontWeight: '600', color: '#33363d' }}>Based On</Typography>
            <Typography variant='body1' sx={{ fontWeight: '600', color: '#33363d' }}>Forecast For</Typography>
        </div>

        <div className='timelines-labels' style={{ paddingBottom: '5px' }}>
            <PastTime past={past} pastChange={pastChange} />
            <FutureTime future={future} futureChange={futureChange} />
        </div>
    </div>
  )
}

export default TimeLine