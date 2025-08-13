import { configureStore, createSlice } from "@reduxjs/toolkit"
import { INTERVAL_OPTIONS } from "./configs/options-configs"

const forecasterSlice = createSlice({
    name: 'forecaster',
    initialState: {
        dataSource: 'random', // (random, custom, real-world, uploaded)
        startDate: null, // (1 < x < 20 years ago)
        behavior: null, // (pattern options)
        behaviorCase: null, // (pattern options options attribute)
        salesDataBatch: null,
        uploadedFileType: null, // (json or csv or xlsx)
        detectedInterval: null, // (daily, weekly, monthly, bi-monthly, yearly)
        effectiveInterval: null,
        activeMethods: ['Simple Linear Regression'],
        pastTimelineDates: null,
        futureTimelineDates: null,
        effectivePastDate: null,
        effectiveFutureDate: null,
        salesDate: null,
        seriesData: null,
        // alpha enabled
        // smoothing enabled

    },
    reducers: {
        setDataSouce: (state, action) => { state.dataSource = action.payload },
        setStartDate: (state, action) => { state.startDate = action.payload },
        setBehavior: (state, action) => { state.behavior = action.payload },
        setSalesDataBatch: (state, action) => { state.salesDataBatch = action.payload },
        setBehaviorCase: (state, action) => { state.behaviorCase = action.payload },
        setUploadedFileType: (state, action) => { state.uploadedFileType = action.payload },
        setDetectedInterval: (state, action) => { state.detectedInterval = action.payload },
        setEffectiveInterval: (state, action) => { state.effectiveInterval = action.payload },
        setActiveMethods: (state, action) => { state.activeMethods = action.payload },
        setEffectivePastDate: (state, action) => { state.effectivePastDate = action.payload },
        setEffectiveFutureDate: (state, action) => { state.effectiveFutureDate = action.payload },
        setPastTimelineDates: (state, action) => { state.pastTimelineDates = action.payload },
        setFutureTimelineDates: (state, action) => { state.futureTimelineDates = action.payload },
        setSeriesData: (state, action) => { state.seriesData = action.payload },
        setSalesData: (state, action) => { state.salesData = action.payload },
    }
})

export const {
    setDataSouce, setStartDate, setBehavior, setBehaviorCase, setSalesDataBatch, setUploadedFileType, 
    setDetectedInterval, setEffectiveInterval, setActiveMethods, setEffectivePastDate, setEffectiveFutureDate, 
    setPastTimelineDates, setFutureTimelineDates, setSeriesData, setSalesData
} = forecasterSlice.actions

export const createForecastStore = () => configureStore({
    reducer: { forecaster: forecasterSlice.reducer }
})

export const getCurrentDataInfo = (state) => {
    const sf = state.forecaster;    
    if (sf.dataSource == 'random' || sf.dataSource == 'custom') {
        return { startDate: sf.startDate, label: sf.behavior + " " + sf.behaviorCase }
    }
    if (state.dataSource == 'uploaded') {
        return { startDate: sf.startDate, label: 'uploaded ' + sf.uploadedFileType }
    }
    return { startDate: sf.startDate, label: "unknown data souce" };
}

export const getAvailableIntervals = (state) => {
    const sf = state.forecaster;
    const detectedInterval = sf.detectedInterval; // Access the slice
    
    if (!detectedInterval) return INTERVAL_OPTIONS; // Fallback if no interval detected
    
    const detectedIndex = INTERVAL_OPTIONS.findIndex(
        (opt) => opt.value === detectedInterval
    );
    
    if (detectedIndex === -1) return INTERVAL_OPTIONS; // Invalid interval? Return all
    
    // Return only intervals with index >= detectedIndex (less frequent)
    return INTERVAL_OPTIONS.slice(detectedIndex);
};

// export const getIntervalEnabled = (state) => {
//     return state.dataSource == "random" || state.dataSource == ""
// }