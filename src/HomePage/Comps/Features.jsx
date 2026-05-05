import { Typography } from '@mui/material'
import React from 'react'
import Carousel from './Carousel'

function Features() {
  return (
    <div className='page-1' style={{ textAlign: 'left' }}>
        <div >
          <Typography variant='h3' sx={{ fontWeight: '700', padding: '3rem 0 0 10%', color: '#073a5a' }}>
            Key Features
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: '400', padding: '0.5rem 0 0 10%', color: '#555', mb: 2 }}>
            Everything you need for comprehensive financial analysis
          </Typography>
          <div className='more-carousel'>
            <Carousel />
            <Carousel />
          </div>
        </div>
    </div>
  )
}

export default Features