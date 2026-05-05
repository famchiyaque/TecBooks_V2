import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function Alpha({ alpha, alphaChange }) {
  // Generate marks for every 0.1 increment
  const marks = Array.from({ length: 9 }, (_, i) => {
    const value = 0.1 + i * 0.1;
    return {
      value: parseFloat(value.toFixed(1)), // Ensures proper floating-point representation
      label: value === 0.1 || value === 0.9 ? `${value}` : '', // Only label 0.1 and 0.9
    };
  });

  const handleChange = (_, newValue) => {
    alphaChange(newValue);
  };

  return (
    <Box sx={{ width: '45%', height: '8rem', marginTop: '1rem' }}>
      <Slider
        orientation="vertical"
        min={0.1}
        max={0.9}
        value={alpha}
        onChange={handleChange}
        step={0.1}
        valueLabelDisplay="off"
        marks={marks}
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
  );
}

export default Alpha;
