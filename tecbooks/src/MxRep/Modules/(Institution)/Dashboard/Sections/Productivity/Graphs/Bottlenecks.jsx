import React, { useState, useEffect } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { useSimData } from '../../SimDataContext'
import { getProcessProductivity } from '../Calcs/bottlenecks'

function BottleneckChart({ period, year }) {
  const { simData } = useSimData()
  const productivityData = simData.productivityData

  const [seriesData, setSeriesData] = useState([{data: [2.4]}, {data: [3.8]}])
  const seriesDataX = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]

  useEffect(() => {
    const newData = getProcessProductivity(period, year, productivityData)
    setSeriesData(newData)
  }, [period, year])

  console.log("series data being passed: ")
  console.log(seriesData)
  console.log(seriesDataX)

  return (
    <div style={{ position: 'relative', width: 500, height: 350 }}>
      <div
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          transform: 'rotate(-90deg) translateY(-50%)',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        units/hour
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '-0px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        Productivity by Process
      </div>
      <BarChart
        xAxis={[{
          scaleType: 'band',
          data: ['Cutting', 'Assembly', 'Body', 'Interior', 'Exterior', 'Paint'],
          }]}
        series={seriesData}
        width={500}
        height={300}
      />
  </div>
  )
}

export default BottleneckChart