import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useExcel } from '../../Comps/ExcelContext'
import { getOrdersData } from '../Calcs/calcs'

function Orders() {
  const { loading, bizInfo, revenueData } = useExcel()
  const [seriesData, setSeriesData] = useState([])
  const [monthLabels, setMonthLabels] = useState([])

  const formatMonthLabel = (fullDate) => {
    try {
      // Handle cases where date might be in "Month YYYY" format
      const [month, year] = fullDate.split(' ');
      const shortMonth = month.substring(0, 3); // Take first 3 letters
      return `${shortMonth} ${year}`;
    } catch (e) {
      return fullDate; // Fallback to original if formatting fails
    }
  };

  useEffect(() => {
    if (!revenueData || !bizInfo?.months) return

    // ✅ Get the last 6 months
    const allMonths = [...bizInfo.months]
    const last6 = allMonths.slice(-6).reverse().map(formatMonthLabel);

    setMonthLabels(last6)
    setSeriesData(getOrdersData(revenueData))
  }, [revenueData, bizInfo])

  const options = {
    chart: {
      type: 'area',
      borderRadius: '5px',
      height: '60%'
    },
    title: {
      text: 'Sales by Product/Service',
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
        text: 'Last 6 Months'
      },
      categories: monthLabels,
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0
    },
    tooltip: {
      shared: true,
      headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
    },
    plotOptions: {
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
