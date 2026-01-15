function getNonNullRange(baseArray) {
    const firstNonNull = baseArray.findIndex(v => v !== null);
    const lastNonNull = baseArray.findLastIndex(v => v !== null);

    if (firstNonNull === -1) return { x: [], y: [], firstNonNull: -1, lastNonNull: -1 };

    const x = [];
    const y = [];
    for (let i = firstNonNull; i <= lastNonNull; i++) {
        if (baseArray[i] !== null) {
            x.push(i + 1);  // 1-based index
            y.push(baseArray[i]);
        }
    }

    return { x, y, firstNonNull, lastNonNull };
}

function simpleLinear(baseArray, interval) {
    const result = [...baseArray];

    const { x, y, firstNonNull, lastNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result; // no data at all

    // linear regression coefficients
    const X = x.reduce((a, b) => a + b, 0) / x.length;
    const Y = y.reduce((a, b) => a + b, 0) / y.length;

    const topSum = x.map((xi, i) => (xi - X) * (y[i] - Y)).reduce((a, b) => a + b, 0);
    const bottomSum = x.map(xi => (xi - X) ** 2).reduce((a, b) => a + b, 0);

    const b1 = topSum / bottomSum;
    const b0 = Y - b1 * X;

    // forecast future points
    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        result[i] = b0 + b1 * (i + 1);
    }

    // clear original past points
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}


function doubleLinear(baseArray, interval) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;

    // compute linear regression on non-null points
    const x = y.map((_, idx) => firstNonNull + idx + 1);
    const X = x.reduce((a, b) => a + b, 0) / x.length;
    const Y = y.reduce((a, b) => a + b, 0) / y.length;
    const topSum = x.map((xi, i) => (xi - X) * (y[i] - Y)).reduce((a, b) => a + b, 0);
    const bottomSum = x.map(xi => (xi - X) ** 2).reduce((a, b) => a + b, 0);
    const slope = topSum / bottomSum;
    const intercept = Y - slope * X;

    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        result[i] = intercept + slope * (i + 1);
    }

    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}


function simpleMoving(baseArray, interval, compound = 3) {
    const result = [...baseArray];

    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result; // no data at all

    // SMA for future points
    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        // get last `compound` points
        const startIdx = Math.max(0, i - compound);
        const dataWindow = result.slice(startIdx, i).filter(v => v !== null);

        // calculate average
        const avg = dataWindow.length ? Math.round(dataWindow.reduce((a, b) => a + b, 0) / dataWindow.length) : 0;
        result[i] = avg;
    }

    // clear past points
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}

function doubleMoving(baseArray, interval, compound = 30) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);

    if (firstNonNull === -1) return result; // no data at all

    // Step 1: Compute first SMA
    const smaArray = [...baseArray];
    for (let i = firstNonNull + compound; i < baseArray.length; i++) {
        const window = [];
        for (let j = i - compound; j < i; j++) {
            if (smaArray[j] !== null) window.push(smaArray[j]);
        }
        smaArray[i] = window.length ? window.reduce((a, b) => a + b, 0) / window.length : null;
    }

    // Step 2: Compute SMA of SMA (double moving)
    const dmaArray = Array(baseArray.length).fill(null);
    for (let i = firstNonNull + 2 * compound; i < baseArray.length; i++) {
        const window = [];
        for (let j = i - compound; j < i; j++) {
            if (smaArray[j] !== null) window.push(smaArray[j]);
        }
        dmaArray[i] = window.length ? window.reduce((a, b) => a + b, 0) / window.length : null;
    }

    return dmaArray;
}

function simpleExponential(baseArray, interval, alpha = 0.5) {
    const result = [...baseArray];

    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result; // no data at all

    // start smoothing from the first actual point
    let lastCalculated = y[0]; 
    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        // use the last non-null point to start the forecast
        const nextValue = alpha * (result[i - 1] ?? lastCalculated) + (1 - alpha) * lastCalculated;
        result[i] = nextValue;
        lastCalculated = nextValue;
    }

    // clear past points
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}


function doubleExponential(baseArray, interval, alpha = 0.5, beta = 0.3) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;

    let level = y[0];
    let trend = y.length > 1 ? y[1] - y[0] : 0;

    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        const lastValue = result[i - 1] ?? level + trend;
        const newLevel = alpha * lastValue + (1 - alpha) * (level + trend);
        const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
        result[i] = newLevel + newTrend;
        level = newLevel;
        trend = newTrend;
    }

    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}


function winters(baseArray, interval, seasonLength = 12, alpha = 0.5, beta = 0.3, gamma = 0.2) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;

    let level = y[0];
    let trend = y[1] - y[0];
    const season = Array(seasonLength).fill(0);

    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        const seasonal = season[i % seasonLength] || 0;
        const lastValue = result[i - 1] ?? level + trend + seasonal;

        const newLevel = alpha * (lastValue - seasonal) + (1 - alpha) * (level + trend);
        const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
        const newSeason = gamma * (lastValue - newLevel) + (1 - gamma) * seasonal;

        season[i % seasonLength] = newSeason;
        result[i] = newLevel + newTrend + newSeason;

        level = newLevel;
        trend = newTrend;
    }

    for (let i = 0; i <= lastNonNull; i++) result[i] = null;

    return result;
}


function getBaseArray(pastDate, futureDate, interval, salesData) {
    const baseArray = [];
    let current = new Date(pastDate);
    // console.log("sales data passed: ", salesData);

    // helper to add intervals
    const addInterval = (date, interval) => {
        const newDate = new Date(date);
        switch (interval) {
            case 'monthly':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case 'yearly':
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
            case 'weekly':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'daily':
                newDate.setDate(newDate.getDate() + 1);
                break;
            default:
                throw new Error('Unsupported interval');
        }
        return newDate;
    };

    // console.log("creating timeline");
    // create timeline
    while (current <= futureDate) {
        baseArray.push(null);
        current = addInterval(current, interval);
    }

    // console.log("adding sales data to correct points")
    // fill in known salesData
    salesData.forEach(sale => {
        const saleDate = new Date(sale.date);
        let idx = 0;
        let tempDate = new Date(pastDate);
        while (tempDate < saleDate && idx < baseArray.length) {
            tempDate = addInterval(tempDate, interval);
            idx++;
        }
        if (idx < baseArray.length) {
            baseArray[idx] = sale.value; // or sale.sales or sale.amount depending on data
        }
    });

    return baseArray;
}


const forecasts = {
    "Simple Linear Regression": { color: "red", func: simpleLinear },
    "Double Linear Regression": { color: "purple", func: doubleLinear },
    "Simple Moving Average": { color: "pink", func: simpleMoving },
    "Double Moving Average": { color: "orange", func: doubleMoving },
    "Simple Exponential Smoothing": { color: "green", func: simpleExponential },
    "Double Exponential Smoothing": { color: "blue", func: doubleExponential },
    "Winter's": { color: "skyblue", func: winters },    
}

export default function getSeriesData(salesData, effectivePastDate, effectiveFutureDate, effectiveInterval, activeMethods) {
    // console.log("salesData passed: ", !!salesData);
    // console.log("effectivePastDate: ", effectivePastDate);
    // console.log("effectiveFutureDate: ", effectiveFutureDate);
    // console.log("effectiveInterval: ", effectiveInterval);
    // console.log("activeMethods: ", activeMethods);

    if (!salesData || !effectivePastDate || !effectiveFutureDate || !effectiveInterval || !activeMethods) return;

    let seriesData = []

    const pastDate = new Date(effectivePastDate);
    const futureDate = new Date(effectiveFutureDate);

    const baseArray = getBaseArray(pastDate, futureDate, effectiveInterval, salesData);
    // console.log("baseArray: ", baseArray);

    seriesData.push({
        name: "sales",
        data: baseArray,
        color: "yellow"
    });

    activeMethods.forEach(method => {
        const { color, func } = forecasts[method]
        if (func) {
            seriesData.push({
                name: method,
                color: color,
                data: func(baseArray, effectiveInterval),
                dashStyle: 'Dash'
            })
        }
    })

    // console.log("returning seriesData: ", seriesData)

    return seriesData;
}