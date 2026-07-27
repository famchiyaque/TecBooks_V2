export const forecastingMethods = {
  inflation: {
    name: 'Inflation',
    description: 'Inflation is the rate at which the price of goods and services increase over time.',
    formula: 'inflation = (price_t / price_t-1) - 1',
  },
  production: {
    name: 'Production',
    description: 'Production is the rate at which the production of goods and services increase over time.',
    formula: 'production = (production_t / production_t-1) - 1',
  },
  slr: {
    name: 'Simple Linear Regression',
    description: 'Simple Linear Regression is a forecasting method that uses a linear equation to forecast future values.',
    formula: 'y = mx + b',
  },
  dlr: {
    name: 'Double Linear Regression',
    description: 'Double Linear Regression is a forecasting method that uses a double linear equation to forecast future values.',
    formula: 'y = mx + b',
  },
  sma: {
    name: 'Simple Moving Average',
    description: 'Simple Moving Average is a forecasting method that uses a moving average to forecast future values.',
    formula: 'y = (x1 + x2 + x3 + ... + xn) / n',
  },
  dma: {
    name: 'Double Moving Average',
    description: 'Double Moving Average is a forecasting method that uses a double moving average to forecast future values.',
    formula: 'y = (x1 + x2 + x3 + ... + xn) / n',
  },
  ses: {
    name: 'Simple Exponential Smoothing',
    description: 'Simple Exponential Smoothing is a forecasting method that uses a exponential smoothing to forecast future values.',
    formula: 'y = alpha * x + (1 - alpha) * y',
  },
  des: {
    name: 'Double Exponential Smoothing',
    description: 'Double Exponential Smoothing is a forecasting method that uses a double exponential smoothing to forecast future values.',
    formula: 'y = alpha * x + (1 - alpha) * y',
  },
  winters: {
    name: "Winter's",
    description: "Winter's is a forecasting method that uses a winter's method to forecast future values.",
    formula: 'y = alpha * x + (1 - alpha) * y',
  },
  log: {
    name: 'Logarithmic',
    description: 'Logarithmic is a forecasting method that uses a logarithmic equation to forecast future values.',
    formula: 'y = log(x)',
  },
}
