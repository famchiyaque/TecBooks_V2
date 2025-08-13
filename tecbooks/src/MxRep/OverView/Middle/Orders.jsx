import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSimData } from '../../SimDataContext'
import { getOrdersData } from '../Calcs/calcs'

function Orders({ period, year }) {
  const { simData } = useSimData()
  const [seriesData, setSeriesData] = useState([{}])
  const [yLabel, setYLabel] = useState("by week")
  const months = ['January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    if (period == 12) setYLabel("by month for " + year)
    else setYLabel("by week for " + months[period])
    const newData = getOrdersData(simData, period, year)
    setSeriesData(newData)
  }, [period, year])

  const options = {
    chart: {
      type: 'area',
      borderRadius: '5px',
      height: '60%'
    },
    title: {
      text: 'Orders: Units Sold by Product',
      align: 'left',
          x: 20,
          style: { color: '#4f4F4F' }
    },
    yAxis: {
      title: {
        useHTML: true,
        text: 'Units Sold',
      },
    },
    xAxis: {
      title: {
        text: yLabel
      }
    },
    tooltip: {
      shared: true,
      headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
    },
    plotOptions: {
      // series: {
      //   pointStart: 2012,
      // },
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666',
        },
      },
    },
    series: seriesData
  }

  return (
    <div style={{ height: '90%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default Orders