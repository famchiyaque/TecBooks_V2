import { createSlice, createSelector } from "@reduxjs/toolkit";
import { forecasts as FORECAST_METHODS } from "@/utils/sims/forecasts/dataForecaster.js";
import { buildAutocorrelationTable } from "@/utils/sims/forecasts/autocorrelation.js";
import { computeBacktestErrors } from "@/utils/sims/forecasts/backtestErrors.js";

// RF1-11 "Demand / Playground" - datos de ejemplo (prototipo); la
// implementacion real contra el backend la hace alguien mas despues. Este
// slice es la parte "tienda compleja": un solo demand de entrada y todo lo
// demas (autocorrelacion, banco de metodos, backtesting, pronostico) se
// deriva via selectors - cambiar demand recalcula todo en cascada.

const MONTHS_PER_YEAR = 12;
const DEFAULT_METHOD = "Simple Linear Regression";

export const DEFAULT_METHOD_PARAMS = {
  "Simple Linear Regression": {},
  "Double Linear Regression": {},
  "Simple Moving Average": { compound: 3 },
  "Double Moving Average": { compound: 3 },
  "Simple Exponential Smoothing": { alpha: 0.5, showSmoothed: true },
  "Double Exponential Smoothing": { alpha: 0.5, beta: 0.5, showSmoothed: true },
  "Winter's": { alpha: 0.5, beta: 0.3, gamma: 0.2, seasonLength: 12 },
};

export const INITIAL_DEMAND = {
  2024: [81, 84, 92, 90, 88, 96, 105, 102, 109, 111, 115, 114],
  2025: [123, 130, 125, 138, 145, 142, 141, 146, 147, 157, 150, 160],
};

const playgroundSlice = createSlice({
  name: "errors",
  initialState: {
    demand: INITIAL_DEMAND,
    maxYears: 5,
    minYears: 1,
    // RF9-11
    forecastYears: 5,
    forecastVisible: true,
    // RF5/6 - metodos activos + sus propios parametros, independientes entre si.
    selectedMethods: [DEFAULT_METHOD],
    methodParams: DEFAULT_METHOD_PARAMS,
  },
  reducers: {
    setDemand: (state, action) => {
      state.demand = action.payload;
    },
    setForecastYears: (state, action) => {
      const parsed = Number(action.payload);
      state.forecastYears = Number.isFinite(parsed)
        ? Math.min(10, Math.max(1, Math.trunc(parsed)))
        : 1;
    },
    setForecastVisible: (state, action) => {
      state.forecastVisible = action.payload;
    },
    toggleMethod: (state, action) => {
      console.log(action);
      const method = action.payload;
      state.selectedMethods = state.selectedMethods.includes(method)
        ? state.selectedMethods.filter((m) => m !== method)
        : [...state.selectedMethods, method];
    },
    setMethodParam: (state, action) => {
      const { method, param, value } = action.payload;
      const nextValue =
        param === "compound" ? Math.max(2, Math.trunc(Number(value)) || 2) : value;
      state.methodParams[method] = {
        ...(state.methodParams[method] ?? {}),
        [param]: nextValue,
      };
    },
  },
});

export const {
  setDemand,
  setForecastYears,
  setForecastVisible,
  toggleMethod,
  setMethodParam,
} = playgroundSlice.actions;

export const playgroundReducer = playgroundSlice.reducer;

// ---------- Selectors ----------

export const selectDemand = (state) => state.playground.demand;
export const selectMaxYears = (state) => state.playground.maxYears;
export const selectMinYears = (state) => state.playground.minYears;
export const selectForecastYears = (state) => state.playground.forecastYears;
export const selectForecastVisible = (state) =>
  state.playground.forecastVisible;
export const selectSelectedMethods = (state) =>
  state.playground.selectedMethods;
export const selectMethodParams = (state) => state.playground.methodParams;

export const selectDemandYears = createSelector([selectDemand], (demand) =>
  Object.keys(demand)
    .map(Number)
    .sort((a, b) => a - b),
);

/** Serie plana, orden cronologico (anio mas viejo primero, Enero-Diciembre). */
export const selectFlatSeries = createSelector(
  [selectDemand, selectDemandYears],
  (demand, years) => years.flatMap((year) => demand[year]),
);

/** RF3: 6 renglones con 1 anio de datos, 12 con 2 o mas - nunca mas lags que puntos disponibles. */
export const selectAutocorrelationMaxLag = createSelector(
  [selectDemandYears, selectFlatSeries],
  (years, series) => {
    const wanted = years.length <= 1 ? 6 : 12;
    return Math.max(0, Math.min(wanted, series.length - 1));
  },
);

export const selectAutocorrelationTable = createSelector(
  [selectFlatSeries, selectAutocorrelationMaxLag],
  (series, maxLag) => buildAutocorrelationTable(series, maxLag),
);

const CHART_FUTURE_ONLY = new Set([
  "Simple Linear Regression",
  "Simple Moving Average",
]);

function firstForecastIndex(method, params) {
  const window = Math.max(2, Math.trunc(Number(params?.compound)) || 3);
  if (method === "Simple Moving Average") return window;
  if (method === "Double Moving Average") return window * 2;
  if (method === "Simple Exponential Smoothing") return 2;
  if (method === "Double Exponential Smoothing") return 1;
  return 0;
}

function inSamplePredictions(result, historyLength) {
  if (Array.isArray(result)) return result.slice(0, historyLength);
  if (result?.historical) return result.historical.slice(0, historyLength);
  return Array(historyLength).fill(null);
}

/** One run per active method. The chart and the error table both read this. */
export const selectMethodForecasts = createSelector(
  [selectFlatSeries, selectSelectedMethods, selectMethodParams, selectForecastYears],
  (series, methods, methodParams, forecastYears) => {
    const futureMonths = forecastYears * MONTHS_PER_YEAR;
    const baseArray = [...series, ...Array(futureMonths).fill(null)];
    const historyLength = series.length;

    return methods.flatMap((method) => {
      const config = FORECAST_METHODS[method];
      if (!config) return [];
      const params = methodParams[method] ?? {};
      const result = config.func(baseArray, "monthly", params);
      const first = firstForecastIndex(method, params);
      return [
        {
          method,
          color: config.color,
          params,
          result,
          predicted: inSamplePredictions(result, historyLength),
          validCount: Math.max(0, historyLength - first),
        },
      ];
    });
  },
);

/** Shortest in-sample stretch among the active methods. */
export const selectComparisonCount = createSelector(
  [selectMethodForecasts],
  (forecasts) => {
    if (!forecasts.length) return 0;
    return forecasts.reduce((count, row) => Math.min(count, row.validCount), Infinity);
  },
);

/** RF7/8: one row per active method, scored on the same last m months. */
export const selectBacktestTable = createSelector(
  [selectMethodForecasts, selectFlatSeries, selectComparisonCount],
  (forecasts, series, count) => {
    if (count === 0) return [];
    const actual = series.slice(series.length - count);
    return forecasts
      .map((row) => ({
        model: row.method,
        color: row.color,
        ...computeBacktestErrors(actual, row.predicted.slice(series.length - count)),
      }))
      .sort((a, b) => a.mse - b.mse);
  },
);

/** RF9-11: sales line plus one line per active method, extended forecastYears ahead. */
export const selectForecastChartSeries = createSelector(
  [selectMethodForecasts, selectFlatSeries, selectForecastVisible],
  (forecasts, series, forecastVisible) => {
    const chartSeries = [{ name: "sales", color: "#eab308", data: [...series] }];
    if (!forecastVisible) return chartSeries;

    const historyLength = series.length;
    forecasts.forEach(({ method, color, params, result }) => {
      if (Array.isArray(result)) {
        const data = result.slice();
        if (CHART_FUTURE_ONLY.has(method)) {
          for (let i = 0; i < historyLength; i++) data[i] = null;
        }
        chartSeries.push({
          name: method,
          color,
          data,
          dashStyle: "Dash",
        });
        return;
      }

      if (result?.historical && result?.forecast) {
        const showSmoothed = params?.showSmoothed ?? true;
        if (showSmoothed) {
          chartSeries.push({
            name: `${method} (smoothed)`,
            color,
            data: result.historical,
            dashStyle: "Solid",
          });
        }
        chartSeries.push({
          name: `${method} (forecast)`,
          color,
          data: result.forecast,
          dashStyle: "Dash",
        });
      }
    });

    return chartSeries;
  },
);

export default playgroundSlice;
