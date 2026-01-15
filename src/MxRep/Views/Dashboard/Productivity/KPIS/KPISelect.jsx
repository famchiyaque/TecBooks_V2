import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function SelectVariants({ process, handleProcess }) {
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: '6rem', padding: '0', margin: '0' }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={process}
          onChange={handleProcess}
          label="Whole Line"
        >
          <MenuItem value={1}>Whole Line</MenuItem>
          <MenuItem value={2}>Cutting</MenuItem>
          <MenuItem value={3}>Assembly</MenuItem>
          <MenuItem value={4}>Body</MenuItem>
          <MenuItem value={5}>Interior</MenuItem>
          <MenuItem value={6}>Exterior</MenuItem>
          <MenuItem value={7}>Paint</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
