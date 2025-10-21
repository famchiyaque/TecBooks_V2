const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function getXLabel(past, future, startDate) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    let p
    let f
    if (past == 1) {
        p = `${months[month]} 1, ${year}`
    } else if (past == 2) {
        if (month - 6 < 0) p = `${months[month + 6]} ${day}, ${year - 1}`
        else p = `${months[month-6]} ${day}, ${year}`
    } else if (past == 3) {
        p = `Jan 1, ${year}`
    } else if (past == 4) {
        p = `Jan 1, ${startDate.substring(0, 4)}`
    }

    if (future == 1) {
        f = `${months[month]} ${monthDays[month]}, ${year}`
    } else if (future == 2) {
        if (month + 6 >= 12) f = `${months[month - 6]} ${day}, ${year + 1}`
        else f = `${months[months + 6]} ${day}, "${year}`
    } else if (future == 3) {
        f = `Dec 31, ${year}`
    } else if (future == 4) {
        f = `Dec 31, ${year + 1}`
    }

    const result = `${p} - ${f}`
    // console.log(result)

    return result
}

function getPastDateInfo(past, startDate) {
    const date = new Date()
    const currYear = date.getFullYear()
    const monthInt = date.getMonth()
    // const currMonth = months[monthInt]
    const currDay = date.getDate()
    let pastYear, pastMonth, pastDay

    if (past == 1) {
        pastYear = currYear
        pastMonth = monthInt
        pastDay = 1
    } else if (past == 2) {
        if (monthInt - 6 < 0) {
            pastYear = currYear - 1
            pastMonth = monthInt + 6
        } else {
            pastYear = currYear
            pastMonth = monthInt - 6
        }
        pastDay = currDay
    } else if (past == 3) {
        pastYear = currYear
        pastMonth = 0
        pastDay = 1
    } else if (past == 4) {
        pastYear = parseInt(startDate.substring(0, 4))
        pastMonth = parseInt(startDate.substring(5, 8))
        pastDay = parseInt(startDate.substring(9, 12))
    }

    const resultDate = new Date(pastYear, pastMonth, pastDay)
    return resultDate
}

function getFutureDateInfo(future) {
    const date = new Date()
    const currYear = date.getFullYear()
    const monthInt = date.getMonth()
    // const currMonth = months[monthInt]
    const currDay = date.getDate()
    let fYear, fMonth, fDay

    if (future == 1) {
        fDay = monthDays[monthInt]
        fMonth = monthInt
        fYear = currYear
    } else if (future == 2){
        fDay = currDay
        if (monthInt >= 12) {
            fMonth = monthInt - 6
            fYear = currYear + 1
        } else {
            fMonth = monthInt + 6
            fYear = currYear
        }
    } else if (future == 3) {
        fYear = currYear
        fMonth = 11
        fDay = 31
    } else if (future == 4) {
        fYear = currYear + 1
        fMonth = 11
        fDay = 31
    }
    
    const resultDate = new Date(fYear, fMonth, fDay) 
    return resultDate
}

function orderArrayOfArrays() {

}

function getAv(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    return parseInt((sum/array.length).toFixed(0))
}

function getCurrDataSet(index, compound, dataArray) {
    let result = []
    while (compound > 0 && index >= 0) {
        result.push(dataArray[index])
        index--
        compound--
    }
    return result
}

function SMA(pastDate, interval, dataArray, compound, alpha) {
    let smaArray = [...dataArray]
    const dayInterval = getDayInterval(interval)
    const lastPoint = getPastPoints(pastDate, dayInterval)

    for (let i = lastPoint; i < dataArray.length; i++) {
        const baseData = getCurrDataSet(i - 1, compound, smaArray)
        const forecast = getAv(baseData)
        smaArray[i] = forecast
    }

    for (let i = 0; i < lastPoint; i++) smaArray[i] = null

    return smaArray
}

function DMA(pastDate, interval, dataArray, compound, alpha) {
    let smaArray = [...dataArray]

    const dayInterval = getDayInterval(interval)
    const lastPoint = getPastPoints(pastDate, dayInterval)

    for (let i = lastPoint; i < dataArray.length; i++) {
        const baseData = getCurrDataSet(i - 1, compound, smaArray)
        const forecast = getAv(baseData)
        smaArray[i] = forecast
    }

    for (let i = 0; i < lastPoint; i++) smaArray[i] = null

    let dmaArray = Array(dataArray.length).fill(null)

    for (let i = lastPoint + compound; i < dataArray.length; i++) {
        const baseData = getCurrDataSet(i - 1, compound, smaArray)
        const forecast = getAv(baseData)
        dmaArray[i] = forecast
    }

    return dmaArray
}

function SES(pastDate, interval, dataArray, compound, alpha) {
    // 1. create copy of dataArray or actual sales data, it's important not
    // to use the passed array
    let sesArray = [...dataArray]

    // 2. Get interval in days from interval passed 'daily' or 'weekly'
    const dayInterval = getDayInterval(interval)

    // 3. Get the number of data points in the sales array given the interval,
    //    the # will serve as the starting point for us to build our new forecast data
    const lastPoint = getPastPoints(pastDate, dayInterval)

    // 4. Calculate each new point from the last actual point to the end of the array,
    // which from the last point on is filled with null
    sesArray[lastPoint] = dataArray[0]
    let lastCalculated = sesArray[lastPoint]
    for (let i = lastPoint + 1; i < dataArray.length; i++) {
        sesArray[i] = (alpha * dataArray[i - lastPoint]) + ((1 - alpha) * lastCalculated)
    }

    // 5. Clear the initial actual sales data from the new ses array
    for (let i = 0; i < lastPoint; i++) sesArray[i] = null

    return sesArray
}

function DES(pastDate, interval, dataArray, compound) {

}

function Winters(salesArray, future) {

}

function SLR(pastDate, interval, dataArray, compound) {
    let slrArray = [...dataArray]
    const dayInterval = getDayInterval(interval)
    const lastPoint = getPastPoints(pastDate, dayInterval)

    let xArray = Array(lastPoint)
    for (let i = 0; i < lastPoint; i++) xArray[i] = i + 1
    const X = getAv(xArray)
    const yArray = slrArray.slice(0, lastPoint)
    const Y = getAv(yArray)

    const topArray = Array(lastPoint)
    for (let i = 0; i < topArray.length; i++) topArray[i] = (xArray[i] - X) * (yArray[i] - Y)
    const bottomArray = Array(lastPoint)
    for (let i = 0; i < bottomArray.length; i++) bottomArray[i] = Math.pow((xArray[i] - X), 2)

    const topSum = topArray.reduce((accum, curr) => curr + accum, 0)
    const bottomSum = bottomArray.reduce((accum, curr) => curr + accum, 0)

    const b1 = parseFloat((topSum / bottomSum).toFixed(3))
    const b0 = Y - (b1 * X)

    // use y = mx + b to calculate new points
    for (let i = lastPoint; i < dataArray.length; i++) {
        const newVal = (b1 * (i + 1)) + b0
        slrArray[i] = newVal  
    }

    // clear original sales data
    for (let i = 0; i < lastPoint; i++) slrArray[i] = null

    console.log(slrArray)
    return slrArray
}

function DLR(salesArray, future) {

}

function getSalesMonthy() {

}

function getDayInterval(interval) {
    if (interval == 'daily') return 1
    if (interval == 'weekly') return 7
    if (interval == 'biweekly') return 14
    if (interval == 'monthly') return -1 // other method of calculating sales, per month
}

function getPastPoints(pastDate, dayInterval) {
    const today = new Date()
    const dateDiff = (today - pastDate) / (1000 * 60 * 60 * 24) 
    const points = Math.ceil(dateDiff / dayInterval)
    return points
}

function getFuturePoints(futureDate, dayInterval) {
    const today = new Date()
    const dateDiff = (futureDate - today) / (1000 * 60 * 60 * 24)
    return Math.ceil(dateDiff / dayInterval)
}

function getArray(pastDate, futureDate, interval, simSales, dataType) {
    // console.log("future date: ", futureDate)
    // if (interval == 'monthly') return getSalesMonthly()
    
    const dayInterval = getDayInterval(interval)
    // console.log("day interval: ", dayInterval)

    const pastPoints = getPastPoints(pastDate, dayInterval)
    const futurePoints = getFuturePoints(futureDate, dayInterval)
    // console.log("past points: ", pastPoints)
    // console.log("future points: ", futurePoints)

    let salesArray = Array(pastPoints + futurePoints).fill(null)
    for (let i = 0; i < pastPoints; i++) salesArray[i] = 0

    const today = new Date()

    simSales.forEach(order => {
        const orderDate = new Date(order.date)
        if (orderDate <= today) {
            const dayDiff = Math.ceil((orderDate - pastDate) / (1000 * 60 * 60 * 24))
            const point = Math.floor(dayDiff/ dayInterval)
            if (point >= 0) {
                if (dataType == 'sales') salesArray[point] += order.revenue
                else if (dataType == 'orders') salesArray[point] += 1
                else if (dataType == 'demand') salesArray[point] += order.quantity
            }
        }
    })

    return salesArray
}

const names = {1: "SMA", 2: "DMA", 3: "SES", 4: "DES", 5: "Winter's", 6: "SLR", 7: "DLR"}
const colors = {1: "green", 2: "blue", 3: "purple", 4: "pink", 5: "skyblue", 6: "red", 7: "yellow"}
const forecasters = {1: SMA, 2: DMA, 3: SES, 4: DES, 5: Winters, 6: SLR, 7: DLR}

export function getXCategories(past, future, simStartDate, interval) {
    const pastDate = getPastDateInfo(past, simStartDate) // gets past date as Date object
    const futureDate = getFutureDateInfo(future)
    const dayInterval = getDayInterval(interval)

    const pastPoints = getPastPoints(pastDate, dayInterval)
    // console.log("past points: ", pastPoints)

    const futurePoints = getFuturePoints(futureDate, dayInterval)
    // console.log("future points: ", futurePoints)


    let labels = Array(pastPoints + futurePoints).fill(null)
    const today = new Date()
    labels[0] = pastDate.toISOString().split('T')[0]
    labels[pastPoints - 1] = today.toISOString().split('T')[0]
    labels[pastPoints + futurePoints - 1] = futureDate.toISOString().split('T')[0]
    // console.log(labels)

    return labels
}

export function getData(past, future, methods, simSales, simStartDate, interval, compound, dataType, alpha) {
    // console.log("past: ", past)
    // console.log("future: ", future)
    // console.log("methods: ", methods)
    // console.log("interval: ", interval)
    // console.log("compound: ", compound)
    // console.log("dataType: ", dataType)
    let seriesData = []
    const pastDate = getPastDateInfo(past, simStartDate) // gets past date as Date object
    const futureDate = getFutureDateInfo(future) // gets future date as object

    const dataArray = getArray(pastDate, futureDate, interval, simSales, dataType) // gets sales data array
    // console.log(dataArray)
    seriesData.push({ // add salesArray object to seriesData
        name: dataType,
        data: dataArray,
        color: "orange"
    })

    // console.log(seriesData)

    methods.forEach(method => {
        const forecastFunction = forecasters[method]
        if (forecastFunction) {
            seriesData.push({
                name: names[method],
                color: colors[method],
                data: forecastFunction(pastDate, interval, dataArray, compound, alpha),
                dashStyle: 'Dash'
            })
        }
    })

    console.log(seriesData)
    return seriesData
}

export function getCastTotals(seriesData, dataType) {
    let castTotals = []

    seriesData.forEach(obj => {
        if (obj.name != 'sales' && obj.name != 'orders' && obj.name != 'demand') {
            if (obj.data) {
                const sum = obj.data.reduce((accum, curr) => accum + curr, 0)
                const fixedSum = parseInt(sum.toFixed(0))
                castTotals.push([obj.name, fixedSum, obj.color])
            }
        }
    })

    castTotals.sort((a, b) => b[1] - a[1])

    castTotals.map(pair => {
        const fixedSum = pair[1]
        let newFormat
        if (dataType == 'sales') {
            newFormat = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(fixedSum)
        } else if (dataType == 'orders') {
            newFormat = pair[1].toString() + " orders"
        } else if (dataType == 'demand') {
            newFormat = pair[1].toString() + " units"
        }

        pair[1] = newFormat
    })

    return castTotals
}