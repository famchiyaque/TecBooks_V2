import React from 'react'
import FusionCharts from 'fusioncharts'
import Widgets from 'fusioncharts/fusioncharts.widgets'
import ReactFC from 'react-fusioncharts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import { useSimData } from '../../SimDataContext'
import { Typography } from '@mui/material'

ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme)

function GaugeChart() {
    const { simData } = useSimData
    // const currentRatio = simData.current
    const quickRatio = 1.3

  const chartConfigs = {
    type: 'angulargauge',
    // width,
    // height,
    width: 200,
    height: 120,
    dataFormat: 'json',
    dataSource: {
      chart: {
        lowerLimit: '0',
        upperLimit: '3',
        theme: 'fusion',
        showValue: '1',
        chartLeftMargin: '0',  // Remove left margin
        chartRightMargin: '0', // Remove right margin
        chartTopMargin: '0',   // Remove top margin
        chartBottomMargin: '0', // Remove bottom margin
        gaugeOuterRadius: '95%', // Increase gauge radius
        showBorder: '0', // Hide border
        borderThickness: '0', // Ensure no border
      },
      colorRange: {
        color: [
          { minValue: '0', maxValue: '0.8', code: '#F2726F' },
          { minValue: '0.8', maxValue: '1.2', code: '#FFC533' },
          { minValue: '1.2', maxValue: '3', code: '#62B58F' },
        ],
      },
      dials: {
        dial: [{ value: quickRatio }], // Use the value prop to set the gauge pointer
      },
    },
  }

  return (
    <div className='liq-gauge'>
      {/* <Typography variant="subtitle2" sx={{ color: '#212121'}}>Quick Ratio</Typography> */}
      <div>
        <ReactFC {...chartConfigs} />
      </div>
    </div>
  )
}

export default GaugeChart
