export function getSalesData(simData, period, year) {
    let seriesData = []

    const profit = simData.profit
    const costs = simData.costs
    const expenses = simData.expenses

    const names = ['Costs', 'Expenses', 'Profit']
    const nums = [costs, expenses, profit]
    const changes = [-1.2, -0.8, 3.3]
    const colors = ['red', 'purple', 'green']

    for (let i = 0; i < names.length; i++) {
        seriesData.push({
            name: names[i],
            y: nums[i],
            color: colors[i],
            change: changes[i]
        })
    }

    console.log(seriesData)

    return seriesData
}

export function getOrdersData(simData, period, year) {
    let seriesData = []
    let datapoints
    const names = ['buggy', 'f1', 'aston-martin']
    const colors = ['orange', 'red', 'yellow']
    let buggies = []
    let fOnes = []
    let astons = []

    if (period != 12) {
        datapoints = 4
        buggies = [32, 48, 24, 19]
        fOnes = [42, 58, 34, 23]
        astons = [26, 33, 12, 23]
    } else {
        datapoints = 12
        buggies = [32, 48, 24, 13, 32, 48, 24, 13, 32, 48, 24, 13]
        fOnes = [32, 48, 24, 13, 32, 48, 24, 13, 32, 48, 24, 13]
        astons = [32, 48, 24, 13, 32, 48, 24, 13, 32, 48, 24, 13]
    }

    const dataArrays = [buggies, fOnes, astons]

    for (let i = 0; i < names.length; i++) {
        seriesData.push({
            name: names[i],
            data: dataArrays[i],
            color: colors[i]
        })
    }

    return seriesData
}