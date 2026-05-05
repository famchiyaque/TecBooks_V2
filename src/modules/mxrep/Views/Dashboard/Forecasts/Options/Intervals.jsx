import React, { useEffect } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

function Intervals({ interval, past, future, intervalChange }) {
  // console.log("interval passed on render: ", interval)

    const dailyEnabled = true
    const weeklyEnabled = true
    const biweeklyEnabled = true
    const monthlyEnabled = true

    // const dailyEnabled = (past == 1 && future == 1)
    // const weeklyEnabled = (past != 1 || future != 1)
    // const biweeklyEnabled = (past != 1 || future != 1)
    // const monthlyEnabled = (past >= 3 && future >= 3)

    // console.log("dailyEnabled: ", dailyEnabled)
    // console.log("weeklyEnabled: ", weeklyEnabled)
    // console.log("biweeklyEnabled: ", biweeklyEnabled)
    // console.log("monthlyEnabled: ", monthlyEnabled)

    // useEffect(() => {
    //   console.log("in useEffect intervals", interval)
    //   if (dailyEnabled && interval != 4) {
    //     console.log("forced to daily")
    //     intervalChange("daily")
    //   }
    //   else if (!dailyEnabled && interval == 4) {
    //     console.log("forced to weekly")
    //     intervalChange("weekly")
    //   }


      // console.log("inside useEffect intervals")
      // console.log(interval)
      // console.log(past)
      // console.log(future)
      // defaultInterval()
  // }, [past, future])

    // const defaultInterval = () => {
    //   if (dailyEnabled && interval != 4) {
    //       console.log('interval forced to 4')
    //       intervalChange(4) 
    //   } else if (!dailyEnabled && interval == 4) {
    //       console.log('interval forced to 7')
    //       intervalChange(7)
    //   } 
    // }

    const handleChange = (event) => {
      const newInterval = event.target.value
      console.log("handle change: ", newInterval)
      intervalChange(newInterval)
    }

  return (
    <FormControl>
      <RadioGroup 
        name="row-radio-buttons-group"
        // value={interval || defaultInterval()}
        value={interval}
        onChange={handleChange}
      >
        <FormControlLabel disabled={!dailyEnabled} value="daily" control={
            <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '12px' } }} />
            } label={<span style={{ fontSize: '12px' }}>daily</span>} 
        />
        <FormControlLabel disabled={!weeklyEnabled} value="weekly" control={
            <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '12px' } }} />
            } label={<span style={{ fontSize: '12px' }}>weekly</span>} 
        />
        <FormControlLabel disabled={!biweeklyEnabled} value="biweekly" control={
            <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '12px' } }} />
            } label={<span style={{ fontSize: '12px' }}>biweekly</span>} 
        />
        <FormControlLabel disabled={!monthlyEnabled} value="monthly" control={
            <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '12px' } }} />
            } label={<span style={{ fontSize: '12px' }}>monthly</span>} 
        />
      </RadioGroup>
    </FormControl>
  );
}

export default Intervals