import { Typography } from '@mui/material'
import React, { useState } from 'react'
import Dropzone from '../Global Components/Dropzone'
import { useNavigate } from 'react-router-dom'

function TempUpload() {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/home')
  }

  return (
    <div className='landing temp-upload-page'>
        <Typography variant='h2' sx={{ padding: '2rem 0', fontWeight: '600' }}>Upload your<br></br> Business Data Spreadsheet</Typography>
        <Dropzone />
        <Typography variant='body1' sx={{ padding: '2rem 0 0 0', fontWeight: '600' }}>
            Try to fill out as much as you can in order to get the most accurate results dah dah dah...
        </Typography>
        <div className='go-home-div' onClick={goHome} >
          <p style={{ fontWeight: '600', fontSize: '110%' }}>Home</p>
          <img className='home-btn' src={'/imgs/site-icon-hd.png'} />
        </div>
    </div>
  )
}

export default TempUpload