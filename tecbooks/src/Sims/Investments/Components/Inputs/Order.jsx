import React from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { setOrder } from '../../store'

function Compound() {
  const dispatch = useDispatch()

  const order = useSelector((state) => state.order)

  const handleChange = (_, newValue) => {
    dispatch(setOrder(newValue))
  }

  return (
    <Box sx={{ width: '20%',  position: 'absolute', top: '5px', left: '10px' }}>
      <Typography variant='subtitle2' sx={{ fontSize: 'small', color: 'gray' }}>Order of Polynomial</Typography>
      <Slider
        min={0}
        value={order}
        onChange={handleChange}
        step={1}
        valueLabelDisplay="auto"
        marks
        max={10}
        sx={{
            '& .MuiSlider-thumb': {
              width: 12,  // Set the thumb width
              height: 12, // Set the thumb height
            },
        }}
      />
    </Box>
  )
}

export default Compound