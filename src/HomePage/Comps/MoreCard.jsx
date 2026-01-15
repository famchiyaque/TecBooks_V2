import React from 'react'
import Typography from '@mui/material/Typography';

function MoreCard({ icon, title, subtitle }) {

  return (
    <div className='carousel-box'>
        {icon}
        <Typography variant='h6' className='box-title' gutterBottom>{title}</Typography>
        <p className='box-p'>{subtitle}</p><br></br><br></br>
        <button className='learn-more' sx={{ paddingLeft: '0' }}>Learn More</button>
    </div>
  )
}

export default MoreCard