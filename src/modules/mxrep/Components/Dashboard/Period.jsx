import React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

function Period({ period, setPeriod }) {
  const handleChange = (event) => {
    const newPeriod = parseInt(event.target.value)
    setPeriod(newPeriod)
  }

  return (
    <Box sx={{ color: 'white', borderBottom: '0', textDecoration: 'none' }}>
      <FormControl fullWidth variant='standard' sx={{ borderBottom: '0', textDecoration: 'none' }}>
        {/* <InputLabel id="demo-simple-select-label">Period</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={period}
          label="Age"
          onChange={handleChange}
          sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' }, borderBottom: '0' }}
        >
          <MenuItem value={12}>Full Year</MenuItem>
          <MenuItem value={0}>January</MenuItem>
          <MenuItem value={1}>February</MenuItem>
          <MenuItem value={2}>March</MenuItem>
          <MenuItem value={3}>April</MenuItem>
          <MenuItem value={4}>May</MenuItem>
          <MenuItem value={5}>June</MenuItem>
          <MenuItem value={6}>July</MenuItem>
          <MenuItem value={7}>August</MenuItem>
          <MenuItem value={8}>September</MenuItem>
          <MenuItem value={9}>October</MenuItem>
          <MenuItem value={10}>November</MenuItem>
          <MenuItem value={11}>December</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Period