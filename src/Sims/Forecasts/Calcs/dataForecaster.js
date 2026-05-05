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


// Gaussian elimination for 3x3 system — used by doubleLinear quadratic regression
function solveLinearSystem3x3(A, b) {
    const n = 3;
    const aug = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        if (Math.abs(aug[col][col]) < 1e-10) return null;
        for (let row = col + 1; row < n; row++) {
            const f = aug[row][col] / aug[col][col];
            for (let j = col; j <= n; j++) aug[row][j] -= f * aug[col][j];
        }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = aug[i][n];
        for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
        x[i] /= aug[i][i];
    }
    return x;
}

// Quadratic regression: y = b0 + b1*x + b2*x² (genuinely different from simple linear)
function doubleLinear(baseArray, interval) {
    const result = [...baseArray];
    const { x, y, firstNonNull, lastNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1 || x.length < 3) return result;

    const n = x.length;
    const S1  = x.reduce((a, xi) => a + xi, 0);
    const S2  = x.reduce((a, xi) => a + xi ** 2, 0);
    const S3  = x.reduce((a, xi) => a + xi ** 3, 0);
    const S4  = x.reduce((a, xi) => a + xi ** 4, 0);
    const Sy  = y.reduce((a, b) => a + b, 0);
    const Sxy  = x.reduce((a, xi, i) => a + xi * y[i], 0);
    const Sx2y = x.reduce((a, xi, i) => a + xi ** 2 * y[i], 0);

    const coeffs = solveLinearSystem3x3(
        [[n, S1, S2], [S1, S2, S3], [S2, S3, S4]],
        [Sy, Sxy, Sx2y]
    );
    if (!coeffs) return result;
    const [b0, b1, b2] = coeffs;

    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        result[i] = Math.round(b0 + b1 * (i + 1) + b2 * (i + 1) ** 2);
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

// DMA forecast: a = 2*SMA - DMA, b = (2/(m-1))*(SMA-DMA), F(h) = a + b*h
function doubleMoving(baseArray, interval) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;

    const n = y.length;
    const m = Math.max(2, Math.floor(n / 3)); // dynamic: ~1/3 of data length

    // SMA on historical points
    const sma = y.map((_, i) => {
        if (i < m - 1) return null;
        const w = y.slice(i - m + 1, i + 1);
        return w.reduce((a, b) => a + b, 0) / m;
    });

    // DMA on sma values
    const dma = sma.map((_, i) => {
        if (i < 2 * m - 2) return null;
        const w = sma.slice(i - m + 1, i + 1).filter(v => v !== null);
        return w.length === m ? w.reduce((a, b) => a + b, 0) / m : null;
    });

    const lastSMA = sma[n - 1];
    const lastDMA = dma[n - 1];
    if (lastSMA === null || lastDMA === null) return result;

    const a = 2 * lastSMA - lastDMA;
    const b = m > 1 ? (2 / (m - 1)) * (lastSMA - lastDMA) : 0;

    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        const h = i - lastNonNull;
        result[i] = Math.round(a + b * h);
    }
    for (let i = 0; i <= lastNonNull; i++) result[i] = null;
    return result;
}

function simpleExponential(baseArray, interval, alpha = 0.5) {
    const result = [...baseArray];
    const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
    if (firstNonNull === -1) return result;

    // Warm up: smooth through all historical points to get correct state
    let smoothed = y[0];
    for (let i = 1; i < y.length; i++) {
        smoothed = alpha * y[i] + (1 - alpha) * smoothed;
    }

    // SES h-step forecast = flat line at last smoothed value
    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        result[i] = Math.round(smoothed);
    }

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

    const n = y.length;
    const sl = Math.min(seasonLength, n);

    // Initialize level: average of first season window
    let level = y.slice(0, sl).reduce((a, b) => a + b, 0) / sl;

    // Initialize trend: average change per period
    let trend = n > 1 ? (y[n - 1] - y[0]) / (n - 1) : 0;

    // Initialize seasonal components (additive): deviation from initial level
    const season = Array(seasonLength).fill(0);
    for (let i = 0; i < sl; i++) season[i] = y[i] - level;

    // Warm up: run through historical data to refine level/trend/seasonals
    for (let i = 1; i < n; i++) {
        const s = season[(firstNonNull + i) % seasonLength];
        const newLevel = alpha * (y[i] - s) + (1 - alpha) * (level + trend);
        const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
        season[(firstNonNull + i) % seasonLength] = gamma * (y[i] - newLevel) + (1 - gamma) * s;
        level = newLevel;
        trend = newTrend;
    }

    // Forecast future points
    for (let i = lastNonNull + 1; i < baseArray.length; i++) {
        const s = season[i % seasonLength];
        result[i] = Math.round(level + trend + s);
        level = level + trend;
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