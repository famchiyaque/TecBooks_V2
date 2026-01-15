import React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'

function ViewTabs({ view, handleView }) {
  return (
    <Box
      sx={{
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        // border: 'solid black 1px',
        margin: '0',
        padding: '0',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup size="small" aria-label="Small button group" 
      style={{ fontSize: 'smaller', margin: '0', padding: '0' }}
      >
        <Button variant={view == 1 ? "contained" : "outlined"}
        sx={{ fontSize: '12px', minHeight: '30px', minWidth: '25px', textTransform: 'none' }}
          onClick={() => handleView(1)}>Bottlenecks</Button>
        <Button variant={view == 2 ? "contained" : "outlined"}
        sx={{ fontSize: '12px', minHeight: '30px', minWidth: '25px', textTransform: 'none' }}
          onClick={() => handleView(2)}>Output</Button>
        {/* <Button variant={view == 3 ? "contained" : "outlined"}
        sx={{ fontSize: '12px', minHeight: '30px', minWidth: '25px', textTransform: 'none' }}
          onClick={() => handleView(3)}>OEE History</Button> */}
      </ButtonGroup>
    </Box>
  )
}

export default ViewTabs