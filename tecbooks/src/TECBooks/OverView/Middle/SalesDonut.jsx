import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useExcel } from '../../Comps/ExcelContext';
import { getSalesData } from '../Calcs/calcs';
import Loader from '../../Comps/Loader';

function SalesDonut() {
  const { loading, overviewData } = useExcel();

  const [chartTitle, setChartTitle] = useState("Distribution of Profitability")
  const [totalSales, setTotalSales] = useState("")
  const [seriesData, setSeriesData] = useState(null)
  // const months = ['January', 'February', 'March', 'April', 'May', 
  //   'June', 'July', 'August', 'September', 'October', 'November', 'December'
  // ]

  const formatToCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
  }

  useEffect(() => {
    if (overviewData) {

      const newTotal = formatToCurrency(overviewData.revenue.reduce((prev, curr) => prev + curr, 0))
      setTotalSales(newTotal)
      console.log("total sales, ", newTotal)

      // const totalCosts = formatToCurrency(overviewData.revenue.reduce((prev, curr) => prev + curr, 0))
      const newData = getSalesData(overviewData)
      setSeriesData(newData)
    }
  }, [overviewData])

  const options = seriesData
    ? {
        chart: {
          type: 'pie',
          height: '80%',
          borderRadius: '5px',
          events: {
            render() {
              const chart = this;
              const series = chart.series[0];

              // Guard for undefined series
              if (!series || !series.center) return;
              let customLabel = chart.options.chart.custom?.label;

              if (!customLabel) {
                customLabel = chart.options.chart.custom = {
                  label: chart.renderer
                    .label(
                      `<div style="font-size: large;">Total<br/><strong>${totalSales}</strong></div>`,
                      0,
                      0
                    )
                    .css({
                      color: '#000',
                      textAnchor: 'middle',
                    })
                    .add(),
                }
              }

              const x = series.center[0] + chart.plotLeft;
              const y =
                series.center[1] +
                chart.plotTop -
                (customLabel.label?.attr('height') || 0) / 2;

              customLabel.label?.attr({ x, y });
              customLabel.label?.css({
                fontSize: `${series.center[2] / 12}px`,
              })
            },
          },
          custom: {},
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        title: {
          text: chartTitle,
          align: 'left',
          x: 20,
          style: { color: '#4f4F4F' }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 5,
            // dataLabels: labelsData,
            dataLabels: [
              {
                enabled: true,
                distance: 20,
                formatter: function() {
                  const change = this.point.change;
                  const sign = change > 0 ? "+" : "";
                  const color = change > 0 ? 'green' : 'red'; // Set color based on change
                  return `<div style="font-size: small;">${this.point.name}<span style="color: ${color};"> <br>${sign}${change}%</span></div>`;
                }
              },
              {
                enabled: true,
                distance: -15,
                format: '{point.percentage:.0f}%',
                style: {
                  fontSize: '0.9em',
                },
              },
            ],
            showInLegend: true,
          },
        },
        series: [
          {
            name: 'Total',
            colorByPoint: true,
            innerSize: '75%',
            data: seriesData,
          },
        ],
      }
    : null // Null to avoid rendering the chart until data is ready

  if (loading) return <Loader />
  if (!overviewData || !options) return null // Wait for data to load

  return (
    <div style={{ height: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default SalesDonut;
