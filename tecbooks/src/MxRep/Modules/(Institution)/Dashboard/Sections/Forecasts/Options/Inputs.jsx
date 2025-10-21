import React from 'react'
import Intervals from './Intervals'
import Smoothing from './Smoothing'
import Alpha from './Alpha'
import Typography from '@mui/material/Typography'
import Winters from './Winters'

function Inputs({ interval, past, future, intervalChange, smoothing, smoothingChange, alpha, alphaChange, activeForecasts }) {
  return (
    <div className='all-options whitecard-b'>
        <div className='intervals-and-winters'>
            <div className='input-quadrant'>
                <Typography variant='body1' sx={{ fontWeight: '600', color: '#33363d' }}>Intervals</Typography>
                {/* <Tooltip title="what are intervals?" content="they are for the assigning the data length type shit"> */}
                {/* <HelpIcon className='help-icon' /> */}
                {/* </Tooltip> */}
                <Intervals interval={interval} past={past} future={future} intervalChange={intervalChange} />
            </div>
            <div className='input-quadrant'>
                <Typography variant="body1" sx={{ fontWeight: '600', color: '#33363d' }}>Winter's</Typography>
                <Winters />
            </div>
        </div>
        <div className='sliders'>
            <div className='input-quadrant'>
                <Typography variant="body1" sx={{ fontWeight: '600', color: '#33363d' }}>Smoothing</Typography>
                <Smoothing smoothing={smoothing} smoothingChange={smoothingChange} 
                    activeForecasts={activeForecasts}
                />
            </div>
            <div className='input-quadrant'>
                <Typography variant="body1" sx={{ fontWeight: '600', color: '#33363d' }}>Alpha</Typography>
                <Alpha alpha={alpha} alphaChange={alphaChange} 
                    activeForecasts={activeForecasts}
                />
            </div>
        </div>
    </div>
  )
}

export default Inputs