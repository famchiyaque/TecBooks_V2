import React from 'react'
import Typography from '@mui/material/Typography'

function Methods({ isActive, handleCastChange }) {
  return (
    <div className='methods-flex'>
        <div className='methods-label'>
            <Typography variant="h6">Methods</Typography>
        </div>
        <div className='methods-buttons'>
            <button value={1} className={`button-81 ${isActive(1) ? 'active': ''}`} onClick={handleCastChange} >
              SMA
            </button>
            <button value={2} className={`button-81 ${isActive(2) ? 'active': ''}`} onClick={handleCastChange} >
              DMA
            </button>
            <button value={3} className={`button-81 ${isActive(3) ? 'active': ''}`} onClick={handleCastChange} >
              SES
            </button>
            <button value={4} className={`button-81 ${isActive(4) ? 'active': ''}`} onClick={handleCastChange} >
              DES
            </button>
            <button value={5} className={`button-81 ${isActive(5) ? 'active': ''}`} onClick={handleCastChange} >
              Winter's
            </button>
            <button value={6} className={`button-81 ${isActive(6) ? 'active': ''}`} onClick={handleCastChange} >
              SLR
            </button>
            <button value={7} className={`button-81 ${isActive(7) ? 'active': ''}`} onClick={handleCastChange} >
              DLR
            </button>
        </div>
    </div>
  )
}

export default Methods