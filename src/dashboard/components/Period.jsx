import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useDashboard } from '@/core/store'

function Period({ period, setPeriod }) {
  const { businessModel } = useDashboard()
  const timeline = businessModel?.timeline
  
  const handleChange = (event) => {
    const newPeriod = event.target.value
    setPeriod(newPeriod)
  }
  
  // Initialize period to first month when timeline becomes available
  useEffect(() => {
    if (timeline && timeline.months && timeline.months.length > 0 && !period) {
      setPeriod(timeline.months[0]);
    }
  }, [timeline, period, setPeriod]);

  // Default months in case timeline isn't loaded
  const defaultMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <Box sx={{ color: 'white', borderBottom: '0', textDecoration: 'none' }}>
      <FormControl fullWidth variant='standard' sx={{ borderBottom: '0', textDecoration: 'none' }}>
        <Select
          labelId="period-select-label"
          id="period-select"
          value={period || ""}
          onChange={handleChange}
          sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' }, borderBottom: '0' }}
          displayEmpty
        >
          {!period && (
            <MenuItem value="" disabled>
              Select Period
            </MenuItem>
          )}
          
          {timeline && timeline.months ? (
            timeline.months.map((month, index) => (
              <MenuItem key={index} value={month}>{month}</MenuItem>
            ))
          ) : (
            defaultMonths.map((month, index) => (
              <MenuItem key={index} value={month}>{month}</MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Period
