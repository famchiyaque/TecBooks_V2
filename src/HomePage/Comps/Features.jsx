import { Typography } from '@mui/material'
import React from 'react'
import Carousel from './Carousel'

function Features() {
  return (
    <div className='page-1' style={{ textAlign: 'left' }}>
        <div >
          <Typography variant='h3' sx={{ fontWeight: '600', padding: '3rem 0 0 10%' }}>Features</Typography>
          <div className='more-carousel'>
            <Carousel />
            <Carousel />
          </div>
        </div>
    </div>
  )
}

export default Features