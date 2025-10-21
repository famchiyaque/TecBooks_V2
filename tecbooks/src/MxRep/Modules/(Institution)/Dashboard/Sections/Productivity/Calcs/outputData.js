const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function getXTimeline(period, year) {
    if (period == 12) {
        return "Jan - Dec, " + year.toString()
    } 
    return months[period] + " " + year.toString()
}

function getAv(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    return parseFloat((sum/array.length).toFixed(1))
}

function getTheoData(period, year, outputData) {
    let data
    if (period == 12) {
        data = Array(12).fill(2)
    } else {
        data = Array(monthDays[period]).fill(2)
    }
    return data
}

function getActualData(period, year, outputData) {
    let data
    if (period == 12) {
        data = Array(12).fill(0)
        let monthData = Array(12).fill([0])
        for (let i = 0; i < outputData.length; i++) {
            if (parseInt(outputData[i].date.substring(0, 4)) == year) {
                const monthInt = parseInt(outputData[i].date.substring(5, 7)) - 1
                monthData[monthInt].push(parseFloat(outputData.unitsProduced / outputData.hoursRunning))
                // data[monthInt] += (outputData.unitsProduced / outputData.hoursRunning)
            }
        }
        for (let i = 0; i < monthData.length; i++) {
            const monthOutput = getAv(monthData[i])
            data[i] = monthOutput
        }

    } else {
        // console.log("in get data for month period")
        data = Array(monthDays[period]).fill(0)
        for (let i = 0; i < outputData.length; i++) {
            // console.log("i: ", i)
            // console.log("data: ", outputData[i])
            const monthInt = parseInt(outputData[i].date.substring(5, 7))
            // console.log("monthInt: ", monthInt)
            if (monthInt == period + 1) {
                // console.log("in if")
                const dayInt = parseInt(outputData[i].date.substring(8, 10))
                // console.log("dayInt: ",dayInt)
                
                data[dayInt] = parseFloat((outputData[i].unitsProduced / outputData[i].hoursRunning).toFixed(1))
            }
        }
        // console.log("data, ")
        console.log(data)
    }

    return data
}

export function getOutputData(period, year, outputData) {
    // console.log("period: ", period)
    // console.log("year: ", year)
    // console.log("output data function")
    // console.log(outputData)
    let seriesData = []
    const actualData = getActualData(period, year, outputData)

    seriesData.push({ // add salesArray object to seriesData
        name: "Actual Output",
        data: actualData,
        color: "orange"
    })

    const theoData = getTheoData(period, year, outputData)

    seriesData.push({
        name: "Theoretical Output",
        data: theoData,
        color: 'green'
    })

    return seriesData
}