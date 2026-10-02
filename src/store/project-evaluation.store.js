import { configureStore, createSlice, createSelector, combineReducers } from "@reduxjs/toolkit";
import { getBreakEven, getIRR, getNPV, getROI, getEUAC } from '@/utils/sims/investments/Calculators'

// lifetime is operating years after year 0. Cash-flow arrays keep year 0 at index 0.
function resizeFlows(arr, length) {
    const source = Array.isArray(arr) ? arr : []
    if (source.length === length) return source
    if (source.length > length) return source.slice(0, length)
    return [...source, ...Array(length - source.length).fill(0)]
}

const projEvalSlice = createSlice({
    name: 'projEval', 
    initialState: {
        // define initial states
        project: 'production line',
        lifetime: 5,
        initialInvestment: 100000,
        discountRate: 10.0,
        salvageValue: 0,
        inflows: [0, 45000, 50000, 55000, 60000, 65000],
        outflows: [100000, 10000, 12000, 15000, 18000, 20000],
        order: 0,
        currProjectIndex: null
    },
    reducers: {
        setProject: (state, action) => { state.project = action.payload },
        setLifetime: (state, action) => {
            const parsed = Number(action.payload)
            const lifetime = Number.isFinite(parsed)
                ? Math.min(20, Math.max(0, Math.trunc(parsed)))
                : 0
            state.lifetime = lifetime
            const periods = lifetime + 1
            state.inflows = resizeFlows(state.inflows, periods)
            state.outflows = resizeFlows(state.outflows, periods)
        },
        setInitialInvestment: (state, action) => { state.initialInvestment = action.payload; state.outflows[0] = action.payload; },
        setDiscountRate: (state, action) => { state.discountRate = action.payload },
        setSalvageValue: (state, action) => {
            const parsed = Number(action.payload)
            state.salvageValue = Number.isFinite(parsed) ? parsed : 0
        },
        setInflows: (state, action) => { state.inflows = action.payload },
        setOutflows: (state, action) => { state.outflows = action.payload },
        setOrder: (state, action) => { state.order = action.payload },
        setCurrProjectIndex: (state, action) => { state.currProjectIndex = action.payload },
    }
})

export const {
    setProject, setLifetime, setInitialInvestment, setDiscountRate,
    setSalvageValue, setInflows, setOutflows, setOrder, setCurrProjectIndex
} = projEvalSlice.actions

export const projEvalReducer = projEvalSlice.reducer

const projEvalRootReducer = combineReducers({ projEval: projEvalReducer })

export const createProjEvalStore = () => configureStore({
    reducer: projEvalRootReducer
})

export const replaceProjEvalReducer = (store) => {
    store.replaceReducer(projEvalRootReducer)
}

const selectProjEval = (state) => state.projEval
const selectInflows = (state) => state.projEval.inflows
const selectOutflows = (state) => state.projEval.outflows
const selectDiscountRate = (state) => state.projEval.discountRate
const selectSalvageValue = (state) => state.projEval.salvageValue ?? 0

export const getProjectInfo = createSelector(
    [selectProjEval],
    (sp) => ({
        project: sp.project,
        lifetime: sp.lifetime,
        initialInvestment: sp.initialInvestment,
        discountRate: sp.discountRate,
        salvageValue: sp.salvageValue ?? 0,
        inflows: sp.inflows,
        outflows: sp.outflows
    })
)

export const getCashflows = createSelector(
    [selectInflows, selectOutflows],
    (inflows, outflows) => inflows.map((inflow, index) => inflow - outflows[index])
)

export const getResults = createSelector(
    [selectInflows, selectOutflows, selectDiscountRate, selectSalvageValue],
    (inflows, outflows, discountRate, salvageValue) => {
        const cashflows = inflows.map((inflow, index) => inflow - outflows[index])
        const breakEven = getBreakEven(inflows, outflows)
        const roi = getROI(inflows, outflows)
        const npv = getNPV(cashflows, discountRate)
        const irr = getIRR(inflows, outflows, npv)
        const euac = getEUAC(outflows, discountRate, salvageValue)

        return {
            breakEven,
            roi,
            npv,
            irr,
            euac
        }
    }
)

export const referenceProjectHistory = (historyIndex) => (dispatch) => {
    const storedProjHistory = JSON.parse(sessionStorage.getItem("projEvalHistory"));
    const proj = storedProjHistory?.find((entry) => entry.index === historyIndex)?.projectInfo;
  
    if (!proj) return;
  
    dispatch(setCurrProjectIndex(historyIndex));
    dispatch(setProject(proj.project));
    dispatch(setInitialInvestment(proj.initialInvestment));
    dispatch(setDiscountRate(proj.discountRate));
    dispatch(setSalvageValue(proj.salvageValue ?? proj.salvage_value ?? 0));
    dispatch(setInflows(proj.inflows));
    dispatch(setOutflows(proj.outflows));
    const operatingYears = Array.isArray(proj.inflows) ? proj.inflows.length - 1 : 0
    dispatch(setLifetime(operatingYears));
  };
