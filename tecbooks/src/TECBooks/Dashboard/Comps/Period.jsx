import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useExcel } from '../Comps/ExcelContext'

function Period({ period, setPeriod }) {
  const { bizInfo } = useExcel()
  
  // Notice we're not parsing to integer anymore since we're using string values
  const handleChange = (event) => {
    const newPeriod = event.target.value
    setPeriod(newPeriod)
  }
  
  // Initialize period to first month when bizInfo becomes available
  useEffect(() => {
    if (bizInfo && bizInfo.months && bizInfo.months.length > 0 && !period) {
      setPeriod(bizInfo.months[0]);
    }
  }, [bizInfo, period, setPeriod]);

  // Default months in case bizInfo isn't loaded
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
          {/* Show a placeholder if period is not set */}
          {!period && (
            <MenuItem value="" disabled>
              Select Period
            </MenuItem>
          )}
          
          {/* Show months from bizInfo if available */}
          {bizInfo && bizInfo.months ? (
            bizInfo.months.map((month, index) => (
              <MenuItem key={index} value={month}>{month}</MenuItem>
            ))
          ) : (
            // Fallback to default months
            defaultMonths.map((month, index) => (
              <MenuItem key={index} value={month}>{month}</MenuItem>
            ))
          )}
          
          {/* Optional: Add Full Year option */}
          {/* <MenuItem value="Lifetime">Lifetime</MenuItem> */}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Period