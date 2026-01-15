import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

function Graph({ lifetime, projectType, order, initialInvestment, inflows, outflows }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const year = new Date().getFullYear()
    const firstYear = year.toString()
    let labels = [firstYear]
    for (let i = 1; i < lifetime; i++) {
      labels.push((year + i).toString())
    }

    // Calculate cash flow per year (bar dataset)
    const cashflows = inflows.map((inflow, index) => {
      if (index === 0) return inflow - outflows[index] - initialInvestment
      else return inflow - outflows[index]
    })

    // Calculate cumulative cash flow (line dataset) - You can adjust this if you need a different metric
    const cumulativeCashFlow = cashflows.reduce((acc, cashflow, index) => {
      if (index === 0) acc.push(cashflow)
      else acc.push(acc[index - 1] + cashflow)
      return acc
    }, [])

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cumulative Cash Flow',
          data: cumulativeCashFlow,
          borderColor: 'blue',  // Line color for cumulative cash flow
          backgroundColor: 'transparent', // Make the line chart transparent
          fill: false,  // Do not fill the area under the line
          type: 'line',  // Line chart dataset
          tension: order / 10, // Smoother line curve, can be adjusted
          borderWidth: 2,
          pointRadius: 5, // Optional: radius for the points on the line
        },
        {
          label: 'Annual Cash Flow',
          data: cashflows,
          backgroundColor: cashflows.map((cashflow) => {
            if (cashflow >= 0) return 'green'
            else return 'red'
          }),
          borderColor: 'black',  // Optional: Add border color for better distinction
          borderWidth: 1,
          type: 'bar',  // Bar chart dataset
        }
      ]
    }

    const graphTitle = projectType
      ? projectType
          .split(' ')
          .map((word) => word ? word[0].toUpperCase() + word.slice(1) : '') // Guard for empty words
          .join(' ')
      : ''

    const config = {
      type: 'bar',  // Use bar chart as the base type
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: graphTitle + " Cash Flow Graph",
          }
        },
        scales: {
          y: {
            beginAtZero: true,  // Optional: Make sure the y-axis starts at zero
          }
        }
      }
    }

    const chart = new Chart(ctx, config)

    return () => chart.destroy()
  }, [lifetime, projectType, inflows, outflows, initialInvestment, order])

  return (
    <div style={{ width: "90%", margin: "0 auto", height: '100%' }}>
      <canvas ref={canvasRef} ></canvas>
    </div>
  )
}

export default Graph
