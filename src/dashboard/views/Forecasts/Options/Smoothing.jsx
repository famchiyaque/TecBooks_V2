import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

function Smoothing({ smoothing, smoothingChange, activeForecasts }) {
  // const [enabled, setEnabled] = useState(false)
  // const sesNum = 3

  // useEffect(() => {
  //   if (activeForecasts.includes(sesNum)) setEnabled(true)
  //   else setEnabled(false)
  // }, [activeForecasts])

  const marks = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1 === 1 ? '1' : i + 1 === 10 ? '10' : '',
  }));

  const handleChange = (_, newValue) => {
    smoothingChange(newValue)
  }

  return (
    <Box sx={{ width: '45%', height: '8rem', marginTop: '1rem' }}>
      <Slider
        orientation="vertical"
        min={1}
        value={smoothing}
        onChange={handleChange}
        step={1}
        valueLabelDisplay="off"
        marks={marks}
        max={10}
        // disabled={!enabled}
        sx={{
          '& .MuiSlider-thumb': {
            width: 15,  // Set the thumb width
            height: 15, // Set the thumb height
            backgroundColor: '#00b4d8', // Thumb custom color
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#00b4d8', // Rail custom color
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: '#ff6347', // Custom label background color
            color: '#ffffff', // Label text color
          },
        }}
      />
    </Box>
  )
}

export default Smoothing