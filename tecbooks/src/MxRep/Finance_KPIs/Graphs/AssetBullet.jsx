import React from 'react'
import BulletGraph from '../../Novus Components/BulletGraph'
import { Typography } from '@mui/material'
import { useSimData } from '../../SimDataContext'

function AssetTurnover() {
  const { simData } = useSimData()

  const min = 0
  let max = 3
  let colorSections = []
  const value = 1.8

  // sales is sales of the month, calculated by adding revenue from all orders of 
  // the current month
  const salesThisMonth = simData.salesThisMonth
  // total active assets is of the whole line
  const activoTotal = simData.activoTotal
  // asset turnover is sales / active assets, but since we are using monthly sales, 
  // we multipily by 12 to get the asset turnover ratio at this sales rate
  const assetTurnover = parseFloat((salesThisMonth * 12 / activoTotal).toFixed(2))

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
      <Typography variant='subtitle2'>Asset Turnover Ratio</Typography>
      <div>
        <BulletGraph min={min} max={max} value={assetTurnover} colorSections={colorSections} />
      </div>
    </div>
  )
}

export default AssetTurnover