import React from 'react'
import BulletGraph from '../../Novus Components/BulletGraph'
import { Typography } from '@mui/material'

function InventoryTurnover() {
  const min = 0
  let max = 3
  let colorSections = []
  const value = 1.8
  if (value > max) {
    max = value
    const red = parseFloat((0.75 / max).toFixed(2)) * 100
    const yellow = parseFloat((1.5 / max).toFixed(2)) * 100
    const green = 100 - red - yellow
    colorSections = [{ "#FF6F61": red }, { "#FFD66B": yellow }, { "#63C78D": green }]
  } else {
    colorSections = [{ "#FF6F61": 25 }, { "#FFD66B": 50 }, { "#63C78D": 25 }]
  }


  return (
    <div className='efficiency-bullet'>
      <Typography variant='subtitle2'>Inventory Turnover Ratio</Typography>
      <div>
        <BulletGraph min={min} max={max} value={value} colorSections={colorSections} />
      </div>
    </div>
  )
}

export default InventoryTurnover