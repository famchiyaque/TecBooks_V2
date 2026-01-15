export function getSalesData(overviewData) {
    let seriesData = []

    const profit = (overviewData.total.reduce((prev, curr) => prev + curr, 0)).toFixed(0)
    const costs = (overviewData.costs.reduce((prev, curr) => prev + curr, 0)).toFixed(0)
    const expenses = (overviewData.expenses.reduce((prev, curr) => prev + curr, 0)).toFixed(0)
    console.log(profit)
    console.log(costs)
    console.log(expenses)

    const names = ['Costs', 'Expenses', 'Profit']
    const nums = [costs, expenses, profit]
    const changes = [-1.2, -0.8, 3.3]
    const colors = ['red', 'purple', 'green']

    for (let i = 0; i < names.length; i++) {
        seriesData.push({
            name: names[i],
            y: Number(nums[i]),
            color: colors[i],
            change: changes[i]
        })
    }

    console.log(seriesData)

    return seriesData
}

export function getOrdersData(revenueData) {
    const seriesData = []
    const colors = ['orange', 'red', 'yellow', 'blue', 'green'] // extend as needed
    let colorIndex = 0
  
    for (const key in revenueData.productsAndServices) {
      const data = revenueData.productsAndServices[key]
      if (Array.isArray(data) && data.some(v => v !== null)) {
        seriesData.push({
          name: key,
          data: [...data].reverse(), // reverse safely here
          color: colors[colorIndex % colors.length]
        })
        colorIndex++
      }
    }
  
    return seriesData
  }
  
