import { configureStore } from "@reduxjs/toolkit";
import { playgroundReducer } from "./playground.slice.js";

// RF1-11 "Demand / Playground" state (Historical Demand -> Autocorrelation ->
// Forecast Models -> Backtesting -> Forecast chart) lives here, behind the
// "Errors" tab - not in forecast-playground.store.js's "Playground" tab,
// which renders the original Sales Forecaster (forecaster slice) and never
// reads this one.
export const createErrorsStore = () => configureStore({
    reducer: { playground: playgroundReducer },
})
