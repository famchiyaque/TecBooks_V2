import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function CashflowChart({ chartData, stats }) {
  const options = {
    chart: {
      height: 400,
    },
    title: {
      text: 'Cashflow Projection',
      align: 'left',
    },
    subtitle: {
      text: `Total Cashflow: $${stats.totalCashflow.toLocaleString()} | Average: $${stats.averageCashflow.toLocaleString()}`,
      align: 'left',
    },
    xAxis: {
      categories: chartData.labels,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: 'Net Cashflow',
        },
        labels: {
          formatter: function () {
            return '$' + this.value.toLocaleString()
          },
        },
      },
      {
        title: {
          text: 'Cumulative Cashflow',
        },
        labels: {
          formatter: function () {
            return '$' + this.value.toLocaleString()
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      valuePrefix: '$',
      valueDecimals: 2,
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        dataLabels: {
          enabled: false,
        },
      },
      line: {
        dataLabels: {
          enabled: false,
        },
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    },
    series: [
      {
        name: 'Net Cashflow',
        type: 'column',
        data: chartData.netCashflow,
        color: '#0077b6',
        yAxis: 0,
      },
      {
        name: 'Cumulative Cashflow',
        type: 'line',
        data: chartData.cumulativeCashflow,
        color: '#e63946',
        yAxis: 1,
        lineWidth: 3,
        marker: {
          radius: 5,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Max Cashflow
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              ${stats.maxCashflow.toLocaleString()}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Min Cashflow
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
              ${stats.minCashflow.toLocaleString()}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Final Position
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: stats.finalCumulativeCashflow >= 0 ? '#2e7d32' : '#d32f2f' }}>
              ${stats.finalCumulativeCashflow.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CashflowChart
