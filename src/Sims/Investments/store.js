import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getBreakEven, getIRR, getNPV, getROI } from './Calcs/Calculators'

const projEvalSlice = createSlice({
    name: 'projEval', 
    initialState: {
        // define initial states
        project: 'production line',
        lifetime: 5,
        initialInvestment: 4000,
        discountRate: 8.0,
        inflows: [500, 2000, 6000, 15000, 30000],
        outflows: [3000, 4500, 5000, 7200, 12000],
        order: 0,
        currProjectIndex: null
    },
    reducers: {
        setProject: (state, action) => { state.project = action.payload },
        setLifetime: (state, action) => { state.lifetime = action.payload },
        setInitialInvestment: (state, action) => { state.initialInvestment = action.payload },
        setDiscountRate: (state, action) => { state.discountRate = action.payload },
        setInflows: (state, action) => { state.inflows = action.payload },
        setOutflows: (state, action) => { state.outflows = action.payload },
        setOrder: (state, action) => { state.order = action.payload },
        setCurrProjectIndex: (state, action) => { state.currProjectIndex = action.payload },
    }
})

export const {
    setProject, setLifetime, setInitialInvestment, setDiscountRate,
    setInflows, setOutflows, setOrder, setCurrProjectIndex
} = projEvalSlice.actions

export const createProjEvalStore = () => configureStore({
    reducer: { projEval: projEvalSlice.reducer }
})

export const getProjectInfo = (state) => {
    const sp = state.projEval

    return {
        project: sp.project,
        lifetime: sp.lifetime, 
        initialInvestment: sp.initialInvestment,
        discountRate: sp.discountRate,
        inflows: sp.inflows,
        outflows: sp.outflows
    }
}

export const getCashflows = (state) => {
    const sp = state.projEval

    return sp.inflows.map((inflow, index) => {
        if (index == 0) return inflow - sp.outflows[index] - sp.initialInvestment
        else return inflow - sp.outflows[index]
    })
}

export const getResults = (state) => {
    const sp = state.projEval

    console.log("In get results in store")

    const cashflows = getCashflows(state)

    const breakEven = getBreakEven(
        sp.lifetime, 
        sp.inflows, 
        sp.outflows,
        cashflows,
        sp.initialInvestment
    )
    console.log("breakEven: ", breakEven)

    const roi = getROI(
        sp.inflows,
        sp.outflows,
        sp.initialInvestment
    )
    console.log("roi: ", roi)

    const npv = getNPV(
        sp.lifetime,
        cashflows,
        sp.discountRate
    )
    console.log("npv: ", npv)

    const irr = getIRR(
        sp.lifetime,
        sp.inflows,
        sp.outflows,
        sp.initialInvestment,
        npv
    )

    return {
        breakEven: breakEven,
        roi: roi,
        npv: npv,
        irr: irr
    }
}

export const referenceProjectHistory = (historyIndex) => (dispatch) => {
    const storedProjHistory = JSON.parse(sessionStorage.getItem("projEvalHistory"));
    const proj = storedProjHistory?.[historyIndex]?.projectInfo;
  
    if (!proj) return;
  
    dispatch(setCurrProjectIndex(historyIndex));
    dispatch(setProject(proj.project));
    dispatch(setLifetime(proj.lifetime));
    dispatch(setInitialInvestment(proj.initialInvestement));
    dispatch(setDiscountRate(proj.discountRate));
    dispatch(setInflows(proj.inflows));
    dispatch(setOutflows(proj.outflows));
  };