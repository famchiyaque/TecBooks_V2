export function getRunningtime(data, period, year) {
    let runningtime = 0

    if (period == 12) {
        for (let i = 0; i < data.length; i++) {
            const currYear = parseInt(data[i].date.substring(0, 4))
            if (currYear == year) {
                runningtime += parseInt((data[i].hoursRunning / 60).toFixed(0))
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            const currYear = data[i].date.substring(0, 4)
            const currMonth = data[i].date.substring(5, 7)
            if (currYear == year && currMonth == period + 1) {
                const hoursRunning = data[i].hoursRunning
                console.log(hoursRunning)
                runningtime += hoursRunning
            }
        }
    }

    console.log(runningtime)
    return runningtime
}

export function getDowntime(data, period, year) {
    let downtime = 0

    if (period == 12) {
        for (let i = 0; i < data.length; i++) {
            const currYear = parseInt(data[i].date.substring(0, 4))
            if (currYear == year) {
                downtime += parseInt((data[i].minutesDown / 60).toFixed(0))
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            const currYear = parseInt(data[i].date.substring(0, 4))
            const currMonth = parseInt(data[i].date.substring(5, 7))
            if (currYear == year && currMonth == period + 1) {
                downtime += parseInt((data[i].minutesDown / 60).toFixed(0))
            }
        }
    }

    return downtime
}

export function getKPIData(simData, process, period, year) {
    let data = {}

    // const runningtime = getRunningtime(simData.actualOutputData, period, year)
    // const downtime = getDowntime(simData.actualOutputData, period, year)
    const downtime = simData.downtime
    const runningtime = simData.runningtime
    // const uptime = runningtime - downtime
    // const unitsProduced = 212
    // const actualOutput = unitsProduced / uptime
    // const idealOutput = simData.idealOutput
    // const goodParts = simData.goodParts
    // const totalParts = simData.totalParts

    data.runningtime = runningtime
    data.uptime = runningtime - downtime
    data.unitsProduced = 439
    data.actualOutput = parseFloat((data.unitsProduced / data.uptime).toFixed(1))
    data.idealOutput = 3.8 // per hour
    data.goodParts = simData.goodParts
    data.totalParts = simData.totalParts
    data.laborHours = simData.workers * simData.hoursWorked

    const availabilityPerc = (data.uptime / data.runningtime).toFixed(2)
    const performancePerc = (data.actualOutput / data.idealOutput).toFixed(2)
    const qualityPerc = (data.goodParts / data.totalParts).toFixed(2)
    const productivityPerc = (data.unitsProduced / data.laborHours).toFixed(2)
    const oee = (availabilityPerc * performancePerc * qualityPerc).toFixed(2)

    data.availability = parseInt(availabilityPerc * 100)
    data.performance = parseInt(performancePerc * 100)
    data.quality = parseInt(qualityPerc * 100)
    data.productivity = parseInt(productivityPerc * 100)
    data.oee = parseInt(oee * 100)

    console.log("actual outpue: ", data.actualOutput)
    console.log("uptime: ", data.uptime)
    console.log("availability: ", data.availability)
    console.log("performance: ", data.performance)
    console.log("quality: ", data.quality)
    console.log("productivity: ", data.productivity)
    // console.log("running time: ", data.runningtime)

    return data
}

export function getOee(simData, period, year) {
    // should process all production line data to find the following 3 metrics 
    // based on the current period/year, process doesn't matter it's of the whole line
    const availability = .93
    const performance = .95
    const quality = .84

    return parseInt((availability * performance * quality) * 100)
}