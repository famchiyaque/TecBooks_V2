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
  "Double Exponential Smoothing": { alpha: 0.5, beta: 0.1, showSmoothed: true },
  "Winter's": { alpha: 0.5, beta: 0.3, gamma: 0.2, seasonLength: 12 },
};

export const INITIAL_DEMAND = {
  2024: [81, 84, 92, 90, 88, 96, 105, 102, 109, 111, 115, 114],
  2025: [123, 130, 125, 138, 145, 142, 141, 146, 147, 157, 150, 160],
};

const playgroundSlice = createSlice({
  name: "playground",
  initialState: {
    demand: INITIAL_DEMAND,
    maxYears: 5,
    minYears: 1,
    // RF7/8 "Errors N" - cuantos meses finales se separan como prueba para
    // el backtesting. Mismo numero alimenta el tono verde/naranja (train/
    // test) de HistoricalDemand - un solo dial para ambas cosas.
    errorBacktestCount: 3,
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
    setErrorBacktestCount: (state, action) => {
      const parsed = Number(action.payload);
      state.errorBacktestCount = Number.isFinite(parsed)
        ? Math.max(0, Math.trunc(parsed))
        : 0;
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
      state.methodParams[method] = {
        ...(state.methodParams[method] ?? {}),
        [param]: value,
      };
    },
  },
});

export const {
  setDemand,
  setErrorBacktestCount,
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
export const selectErrorBacktestCount = (state) =>
  state.playground.errorBacktestCount;
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

export const selectTrainTestSplit = createSelector(
  [selectFlatSeries, selectErrorBacktestCount],
  (series, testCount) => {
    const count = Math.min(testCount, Math.max(series.length - 1, 0));
    return {
      train: series.slice(0, series.length - count),
      test: series.slice(series.length - count),
      testCount: count,
    };
  },
);

function predictedWindow(result, totalLength, testCount) {
  const startIdx = totalLength - testCount;
  if (Array.isArray(result)) return result.slice(startIdx, totalLength);
  if (result?.forecast) return result.forecast.slice(startIdx, totalLength);
  return Array(testCount).fill(null);
}

/** RF7/8: una fila por metodo activo, ordenadas de menor a mayor error (MSE). */
export const selectBacktestTable = createSelector(
  [
    selectFlatSeries,
    selectTrainTestSplit,
    selectSelectedMethods,
    selectMethodParams,
  ],
  (series, { train, test, testCount }, methods, methodParams) => {
    if (testCount === 0) return [];
    const baseArray = [...train, ...Array(testCount).fill(null)];

    const rows = methods
      .map((method) => {
        const config = FORECAST_METHODS[method];
        if (!config) return null;
        const result = config.func(
          baseArray,
          "monthly",
          methodParams[method] ?? {},
        );
        const predicted = predictedWindow(result, baseArray.length, testCount);
        return {
          model: method,
          color: config.color,
          ...computeBacktestErrors(test, predicted),
        };
      })
      .filter(Boolean);

    return rows.sort((a, b) => a.mse - b.mse);
  },
);

/** RF9-11: linea base (historico completo) + una linea por metodo activo, extendida forecastYears al futuro. */
export const selectForecastChartSeries = createSelector(
  [
    selectFlatSeries,
    selectSelectedMethods,
    selectMethodParams,
    selectForecastYears,
    selectForecastVisible,
  ],
  (series, methods, methodParams, forecastYears, forecastVisible) => {
    const chartSeries = [
      { name: "sales", color: "#eab308", data: [...series] },
    ];
    if (!forecastVisible) return chartSeries;

    const futureMonths = forecastYears * MONTHS_PER_YEAR;
    const baseArray = [...series, ...Array(futureMonths).fill(null)];

    methods.forEach((method) => {
      const config = FORECAST_METHODS[method];
      if (!config) return;
      const result = config.func(
        baseArray,
        "monthly",
        methodParams[method] ?? {},
      );

      if (Array.isArray(result)) {
        chartSeries.push({
          name: method,
          color: config.color,
          data: result,
          dashStyle: "Dash",
        });
      } else if (result?.historical && result?.forecast) {
        const showSmoothed = methodParams[method]?.showSmoothed ?? true;

        if (showSmoothed) {
          chartSeries.push({
            name: `${method} (smoothed)`,
            color: config.color,
            data: result.historical,
            dashStyle: "Solid",
          });
        }
        chartSeries.push({
          name: `${method} (forecast)`,
          color: config.color,
          data: result.forecast,
          dashStyle: "Dash",
        });
      }
    });

    return chartSeries;
  },
);

export default playgroundSlice;
