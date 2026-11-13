// 1. Regresión Lineal Simple
export const calculateSLR = (data, futurePeriods = 12) => {
  const n = data.length;
  if (n < 2) return [];

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  data.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const results = [];
  // Ajuste histórico + proyección futura
  for (let i = 0; i < n + futurePeriods; i++) {
    results.push(Number((slope * i + intercept).toFixed(2)));
  }
  return results;
};

// 2. Promedio Móvil Simple (SMA)
export const calculateSMA = (data, windowSize = 3, futurePeriods = 12) => {
  if (data.length < windowSize) return [];
  const results = new Array(windowSize - 1).fill(null); // No hay suficiente historia para los primeros puntos

  // Puntos históricos
  for (let i = windowSize - 1; i < data.length; i++) {
    const slice = data.slice(i - windowSize + 1, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / windowSize;
    results.push(Number(avg.toFixed(2)));
  }

  // Proyección futura
  let currentWindow = [...data.slice(-windowSize)];
  for (let i = 0; i < futurePeriods; i++) {
    const nextVal = currentWindow.reduce((a, b) => a + b, 0) / windowSize;
    results.push(Number(nextVal.toFixed(2)));
    currentWindow.shift();
    currentWindow.push(nextVal);
  }

  return results;
};

// 3. Suavizamiento Exponencial Simple (SES)
export const calculateSES = (data, alpha = 0.3, futurePeriods = 12) => {
  if (data.length === 0) return [];
  const results = [data[0]]; // El primer valor predicho es igual al primer valor real

  for (let i = 1; i < data.length; i++) {
    const prevForecast = results[i - 1];
    const newForecast = alpha * data[i - 1] + (1 - alpha) * prevForecast;
    results.push(Number(newForecast.toFixed(2)));
  }

  // Para SES básico, la proyección futura se mantiene constante en el último pronóstico calculado
  const lastForecast =
    alpha * data[data.length - 1] + (1 - alpha) * results[results.length - 1];
  for (let i = 0; i < futurePeriods; i++) {
    results.push(Number(lastForecast.toFixed(2)));
  }

  return results;
};
