import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useSimData } from '../SimDataContext'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

function Year({ year, setYear }) {
  const { simData, isLoading, error } = useSimData()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      navigate('/error')
    } else if (!simData && !isLoading) {
      navigate('/production-line')
    }
  }, [simData, error, isLoading, navigate])

  const handleChange = (event) => {
    const newYear = parseInt(event.target.value)
    setYear(newYear)
  }

  // console.log("before using simData")
  let startDay = simData?.startDate || null
  // console.log("after using simData")
  // console.log(startDay)
  let startYear
  const thisYear = new Date().getFullYear()
  const years = []
  years.push(thisYear)
  if (startDay != null) {
    startYear = parseInt(startDay.substring(0, 4))
    while (startYear < thisYear) {
      years.push(startYear)
      startYear++
    }
  }
  // console.log(startYear)

  if (isLoading) return <Loader />

  return (
    <Box sx={{ color: 'white' }}>
      <FormControl fullWidth variant='standard'>
        {/* <InputLabel id="demo-simple-select-label">Year</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={year}
          label="Age"
          onChange={handleChange}
          sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' } }}
        >
          {years.map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Year