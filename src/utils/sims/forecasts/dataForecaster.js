export function getNonNullRange(baseArray) {
  const firstNonNull = baseArray.findIndex((v) => v !== null);
  const lastNonNull = baseArray.findLastIndex((v) => v !== null);

  if (firstNonNull === -1)
    return { x: [], y: [], firstNonNull: -1, lastNonNull: -1 };

  const x = [];
  const y = [];
  for (let i = firstNonNull; i <= lastNonNull; i++) {
    if (baseArray[i] !== null) {
      x.push(i + 1); // 1-based index
      y.push(baseArray[i]);
    }
  }

  return { x, y, firstNonNull, lastNonNull };
}

function round2(value) {
  return Number(value.toFixed(2));
}

export function simpleLinear(baseArray, interval) {
  const { x, y, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1) return baseArray.map((value) => value);

  // linear regression coefficients
  const X = x.reduce((a, b) => a + b, 0) / x.length;
  const Y = y.reduce((a, b) => a + b, 0) / y.length;
  console.log("X: ", X)
  console.log("Y: ", Y)

  const topSum = x
    .map((xi, i) => (xi - X) * (y[i] - Y))
    .reduce((a, b) => a + b, 0);
  const bottomSum = x.map((xi) => (xi - X) ** 2).reduce((a, b) => a + b, 0);

  const b1 = topSum / bottomSum;
  const b0 = Y - b1 * X;
  console.log("b1: ", b1)
  console.log("b0: ", b0)

  // Fitted values on the sample and the future use the same line.
  const result = baseArray.map(() => null);
  for (let i = firstNonNull; i < baseArray.length; i++) {
    result[i] = round2(b0 + b1 * (i + 1));
  }
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
export function doubleLinear(baseArray, interval) {
  const result = [...baseArray];
  const { x, y, firstNonNull, lastNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1 || x.length < 3) return result;

  const n = x.length;
  const S1 = x.reduce((a, xi) => a + xi, 0);
  const S2 = x.reduce((a, xi) => a + xi ** 2, 0);
  const S3 = x.reduce((a, xi) => a + xi ** 3, 0);
  const S4 = x.reduce((a, xi) => a + xi ** 4, 0);
  const Sy = y.reduce((a, b) => a + b, 0);
  const Sxy = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const Sx2y = x.reduce((a, xi, i) => a + xi ** 2 * y[i], 0);

  const coeffs = solveLinearSystem3x3(
    [
      [n, S1, S2],
      [S1, S2, S3],
      [S2, S3, S4],
    ],
    [Sy, Sxy, Sx2y],
  );
  if (!coeffs) return result;
  const [b0, b1, b2] = coeffs;

  for (let i = lastNonNull + 1; i < baseArray.length; i++) {
    result[i] = round2(b0 + b1 * (i + 1) + b2 * (i + 1) ** 2);
  }
  for (let i = 0; i <= lastNonNull; i++) result[i] = null;
  return result;
}

export function simpleMoving(baseArray, interval, params = {}) {
  const compound = Math.max(2, params.compound ?? 3);
  const { lastNonNull, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1) return baseArray.map(() => null);

  const predicted = baseArray.map(() => null);
  // Future months keep averaging this copy, which still holds the actuals.
  const extended = baseArray.slice();

  for (let i = firstNonNull + compound; i <= lastNonNull; i++) {
    const sample = [];
    for (let k = i - compound; k < i; k++) {
      if (extended[k] == null) {
        sample.length = 0;
        break;
      }
      sample.push(extended[k]);
    }
    if (sample.length !== compound) continue;
    predicted[i] = round2(sample.reduce((sum, value) => sum + value, 0) / compound);
  }

  for (let i = lastNonNull + 1; i < baseArray.length; i++) {
    const startIdx = Math.max(0, i - compound);
    const dataWindow = extended.slice(startIdx, i).filter((value) => value !== null);
    const avg = dataWindow.length
      ? round2(dataWindow.reduce((sum, value) => sum + value, 0) / dataWindow.length)
      : 0;
    extended[i] = avg;
    predicted[i] = avg;
  }

  return predicted;
}

// DMA: average of the previous `window` actuals, then the same average of those
// averages. Each value sits on the month being forecast. In-sample points stay
// in the series; the second average continues one step at a time into the future.
export function doubleMoving(baseArray, interval, params = {}) {
  const window = Math.max(2, params.compound ?? 3);
  const result = baseArray.map(() => null);
  const { lastNonNull, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1) return result;

  const ma1 = Array(baseArray.length).fill(null);
  for (let i = firstNonNull + window; i < baseArray.length; i++) {
    const sample = [];
    for (let k = i - window; k < i; k++) {
      const value = k <= lastNonNull ? baseArray[k] : ma1[k];
      if (value == null) {
        sample.length = 0;
        break;
      }
      sample.push(value);
    }
    if (sample.length !== window) continue;
    ma1[i] = sample.reduce((sum, value) => sum + value, 0) / window;
  }

  for (let i = firstNonNull + window * 2; i < baseArray.length; i++) {
    const sample = [];
    for (let k = i - window; k < i; k++) {
      if (ma1[k] == null) {
        sample.length = 0;
        break;
      }
      sample.push(ma1[k]);
    }
    if (sample.length !== window) continue;
    result[i] = round2(sample.reduce((sum, value) => sum + value, 0) / window);
  }

  return result;
}

export function simpleExponential(baseArray, interval, params = {}) {
  const alpha = params.alpha ?? 0.5;
  const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1) return null;

  // One-step forecast for month t is the level from month t-1.
  // January has no prior level, so it stays null. February is seeded with January's actual.
  const historical = baseArray.map(() => null);
  let level = y[0];
  for (let t = 1; t < y.length; t++) {
    historical[firstNonNull + t] = round2(level);
    level = alpha * y[t] + (1 - alpha) * level;
  }

  const forecast = baseArray.map(() => null);
  for (let i = lastNonNull + 1; i < baseArray.length; i++) {
    forecast[i] = round2(level);
  }

  return { historical, forecast };
}

export function doubleExponential(baseArray, interval, params = {}) {
  const alpha = params.alpha ?? 0.5;
  const beta = params.beta ?? 0.5;
  const result = [...baseArray];
  const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1 || y.length < 2) return result;

  const n = y.length;

  // January's level is the January actual. The first trend is February minus January.
  // The level and trend updates start at February.
  let level = y[0];
  let trend = y[1] - y[0];

  const historical = baseArray.map(() => null);
  historical[firstNonNull] = round2(level);

  for (let t = 1; t < n; t++) {
    const previousLevel = level;
    level = alpha * y[t] + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
    historical[firstNonNull + t] = round2(level);
  }

  const forecast = baseArray.map(() => null);
  for (let i = lastNonNull + 1; i < baseArray.length; i++) {
    const h = i - lastNonNull;
    forecast[i] = round2(level + h * trend);
  }

  return { historical, forecast };
}

export function winters(baseArray, interval, params = {}) {
  const alpha = params.alpha ?? 0.5;
  const beta = params.beta ?? 0.3;
  const gamma = params.gamma ?? 0.2;
  const seasonLength = params.seasonLength ?? 12;
  const result = [...baseArray];
  const { y, lastNonNull, firstNonNull } = getNonNullRange(baseArray);
  if (firstNonNull === -1 || y.length < 2) return result;

  const m = Math.min(seasonLength, y.length);

  // Initialize level and trend
  let L = y[0];
  let T = y[1] - y[0];

  // Initialize seasonal indices: deviation from initial level
  const S = Array(m).fill(0);
  for (let i = 0; i < m; i++) S[i] = y[i] - L;

  // Warm-up through all historical data
  for (let t = 0; t < y.length; t++) {
    const s = S[t % m];
    const prevL = L;
    L = alpha * (y[t] - s) + (1 - alpha) * (L + T);
    T = beta * (L - prevL) + (1 - beta) * T;
    S[t % m] = gamma * (y[t] - L) + (1 - gamma) * s;
  }

  // Forecast future points
  for (let i = lastNonNull + 1; i < baseArray.length; i++) {
    result[i] = round2(L + T + S[i % m]);
    L = L + T;
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
      case "monthly":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "yearly":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "daily":
        newDate.setDate(newDate.getDate() + 1);
        break;
      default:
        throw new Error("Unsupported interval");
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
  salesData.forEach((sale) => {
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

export const forecasts = {
  "Simple Linear Regression": { color: "red", func: simpleLinear },
  "Double Linear Regression": { color: "purple", func: doubleLinear },
  "Simple Moving Average": { color: "pink", func: simpleMoving },
  "Double Moving Average": { color: "orange", func: doubleMoving },
  "Simple Exponential Smoothing": { color: "green", func: simpleExponential },
  "Double Exponential Smoothing": { color: "blue", func: doubleExponential },
  "Winter's": { color: "skyblue", func: winters },
};

export const forecastParams = {
  compound: { label: "Window (compound)", min: 2, max: 12, step: 1 },
  alpha: { label: "Alpha (level)", min: 0.01, max: 1, step: 0.01 },
  beta: { label: "Beta (trend)", min: 0.01, max: 1, step: 0.01 },
  gamma: { label: "Gamma (seasonal)", min: 0.01, max: 1, step: 0.01 },
  seasonLength: { label: "Season length", min: 2, max: 24, step: 1 },
  showSmoothed: {
    label: "Mostrar línea suavizada",
    type: "boolean",
    default: true,
  },
};

export default function getSeriesData(
  salesData,
  effectivePastDate,
  effectiveFutureDate,
  effectiveInterval,
  activeMethods,
  params = {},
) {
  // console.log("salesData passed: ", !!salesData);
  // console.log("effectivePastDate: ", effectivePastDate);
  // console.log("effectiveFutureDate: ", effectiveFutureDate);
  // console.log("effectiveInterval: ", effectiveInterval);
  // console.log("activeMethods: ", activeMethods);

  if (
    !salesData ||
    !effectivePastDate ||
    !effectiveFutureDate ||
    !effectiveInterval ||
    !activeMethods
  )
    return;

  let seriesData = [];

  const pastDate = new Date(effectivePastDate);
  const futureDate = new Date(effectiveFutureDate);

  const baseArray = getBaseArray(
    pastDate,
    futureDate,
    effectiveInterval,
    salesData,
  );
  // console.log("baseArray: ", baseArray);

  seriesData.push({
    name: "sales",
    data: baseArray,
    color: "yellow",
  });

  activeMethods.forEach((method) => {
    const methodConfig = forecasts[method];
    if (!methodConfig?.func) return;

    const result = methodConfig.func(baseArray, effectiveInterval, params);

    if (
      result &&
      typeof result === "object" &&
      !Array.isArray(result) &&
      result.historical &&
      result.forecast
    ) {
      // Split series: historical smoothed (solid) + forecast (dashed)
      const showSmoothed = params.showSmoothed ?? true;

      if (showSmoothed) {
        seriesData.push({
          name: method + " (smoothed)",
          color: methodConfig.color,
          data: result.historical,
          dashStyle: "Solid",
          lineWidth: 1.5,
        });
      }
      seriesData.push({
        name: method + " (forecast)",
        color: methodConfig.color,
        data: result.forecast,
        dashStyle: "Dash",
      });
    } else if (Array.isArray(result)) {
      const data = result.slice();
      // The errors module keeps in-sample fits. This screen draws the future only.
      if (method === "Simple Linear Regression" || method === "Simple Moving Average") {
        for (let i = 0; i < baseArray.length; i++) {
          if (baseArray[i] != null) data[i] = null;
        }
      }
      seriesData.push({
        name: method,
        color: methodConfig.color,
        data,
        dashStyle: "Dash",
      });
    }
  });

  // console.log("returning seriesData: ", seriesData)
  console.log(
    "Series finales:",
    seriesData.map((s) => ({
      name: s.name,
      totalPoints: s.data.length,
      nonNullPoints: s.data.filter((v) => v !== null).length,
      lastIndex: s.data.findLastIndex((v) => v !== null),
    })),
  );

  return seriesData;
}
