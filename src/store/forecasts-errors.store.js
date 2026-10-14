import { configureStore, createSlice } from "@reduxjs/toolkit";

const errorsSlice = createSlice({
    name: 'errors',
    initialState: {},
    reducers: {},
})

export const createErrorsStore = () => configureStore({
    reducer: { errors: errorsSlice.reducer },
})
