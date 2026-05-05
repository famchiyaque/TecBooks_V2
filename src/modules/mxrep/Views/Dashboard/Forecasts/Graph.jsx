import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function Graph({ dataType, graphTitle, xTitle, xAxis, seriesData }){
    const dataTitle = String(dataType).charAt(0).toUpperCase() + String(dataType).slice(1)

    const options = {
        chart: {
          type: 'line',
          borderRadius: '5px'
        },
        title: {
          text: dataTitle +  " Forecast of: " + graphTitle
        },
        xAxis: {
          title: {
            text: xTitle
          },
          categories: xAxis
        },
        yAxis: {
          title: {
            text: dataType
          }
        },
        series: seriesData 
    }
 
  return (
    <div style={{ maxHeight: '100%' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default Graph