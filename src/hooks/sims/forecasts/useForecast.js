import {
  calculateSLR,
  calculateSMA,
  calculateSES,
} from "@/utils/sims/forecasts/forecastMath";
import { useMemo } from "react";

export const useForecast = (historicalDemand, options = {}) => {
  const { futurePeriods = 12, smaWindow = 3, alpha = 0.3 } = options;

  return useMemo(() => {
    // 1. Aplanar los datos del objeto { 2024: [...], 2025: [...] } a un solo Array plano en orden
    const years = Object.keys(historicalDemand).sort();
    const flatHistoricalData = years.flatMap(
      (year) => historicalDemand[year] || [],
    );

    if (flatHistoricalData.length === 0) {
      return {
        flatDemand: [],
        predictions: { slr: [], sma: [], se: [] },
      };
    }

    // 2. Calcular los pronósticos de los métodos
    const slr = calculateSLR(flatHistoricalData, futurePeriods);
    const sma = calculateSMA(flatHistoricalData, smaWindow, futurePeriods);
    const se = calculateSES(flatHistoricalData, alpha, futurePeriods);

    return {
      flatDemand: flatHistoricalData,
      predictions: {
        slr, // Simple Linear Regression
        sma, // Simple Moving Average
        se, // Simple Exponential
      },
    };
  }, [historicalDemand, futurePeriods, smaWindow, alpha]);
};
