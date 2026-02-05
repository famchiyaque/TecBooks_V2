import { configureStore, createSlice } from '@reduxjs/toolkit';

const customExcelSlice = createSlice({
  name: 'customExcel',
  initialState: {
    currQuestion: 1,
    // General Business Info (Slide 1)
    nameBiz: '',
    // typeBiz: '',
    startMonth: '',
    // Revenue/Income Streams (Slide 2)
    revenue: [],
    // Employee Information (Slide 3)
    hasEmployees: null,
    numEmployees: null,
    empProduction: 0,
    empAdmin: 0,
    // Assets and Inventory Information (Slide 4)
    hasAssets: null,
    assets: [],
    hasInventory: null,
    hasRW: null,
    hasWIPG: null,
    hasFG: null,
    // inventory: [],
    // typeAssets: [],
    // Expenses (not including assets/salaries) (Slide 5)
    hasExpenses: true,
    expenses: [],
    // Debt and Passive Section (Slide 6)
    hasAccsPayable: null,
    accsPayable: [],
    hasAccsReceivable: null,
    accsReceivable: [],
    // Progress Bar
    progress: 10,
    progressBarFixed: false,
  },
  reducers: {
    setCurrQuestion: (state, action) => { state.currQuestion = action.payload; },
    setNameBiz: (state, action) => { state.nameBiz = action.payload; },
    // setTypeBiz: (state, action) => { state.typeBiz = action.payload; },
    setStartMonth: (state, action) => { state.startMonth = action.payload; },
    setRevenue: (state, action) => { state.revenue = action.payload; },
    setHasEmployees: (state, action) => { state.hasEmployees = action.payload; },
    setNumEmployees: (state, action) => { state.numEmployees = action.payload; },
    setEmpProduction: (state, action) => { state.empProduction = action.payload; },
    setEmpAdmin: (state, action) => { state.empAdmin = action.payload; },
    setHasAssets: (state, action) => { state.hasAssets = action.payload; },
    setHasInventory: (state, action) => { state.hasInventory = action.payload; },
    setHasRW: (state, action) => { state.hasRW = action.payload; },
    setHasWIPG: (state, action) => { state.hasWIPG = action.payload; },
    setHasFG: (state, action) => { state.hasFG = action.payload; },
    setAssets: (state, action) => { state.assets = action.payload; },
    setInventory: (state, action) => { state.inventory = action.payload },
    setTypeAssets: (state, action) => { state.typeAssets = action.payload; },
    setHasExpenses: (state, action) => { state.hasExpenses = action.payload },
    setExpenses: (state, action) => { state.expenses = action.payload; },
    setHasAccsPayable: (state, action) => { state.hasAccsPayable = action.payload; },
    setAccsPayable: (state, action) => { state.accsPayable = action.payload; },
    setHasAccsReceivable: (state, action) => { state.hasAccsReceivable = action.payload; },
    setAccsReceivable: (state, action) => { state.accsReceivable = action.payload; },
    setProgress: (state, action) => { state.progress = action.payload; },
    setProgressBarFixed: (state, action) => { state.progressBarFixed = action.payload; },
  },
});

// Export actions
export const {
  setCurrQuestion, setNameBiz, setTypeBiz, setStartMonth, setRevenue, 
  setHasEmployees, setNumEmployees, setEmpProduction, setEmpAdmin, setHasAssets,
  setHasInventory, setAssets, setHasRW, setHasWIPG, setHasFG,
  setInventory, setTypeAssets, setExpenses, setHasExpenses,
  setHasAccsPayable, setAccsPayable, setHasAccsReceivable, setAccsReceivable, 
  setProgress, setProgressBarFixed,
} = customExcelSlice.actions;

// Create a store specifically for the custom excel builder
export const createCustomExcelStore = () => configureStore({
  reducer: { customExcel: customExcelSlice.reducer },
});

// Selectors
export const selectTypeBizComplete = (state) => {
  return state.customExcel.nameBiz !== '' && state.customExcel.startMonth !== '';
};

export const selectRevenueComplete = (state) => {
  return state.customExcel.revenue.length > 0 && (
    state.customExcel.revenue.every(rev => 
      rev.status !== "" && rev.name !== ""
    )
  );
};

export const selectEmployeesComplete = (state) => {
  const ce = state.customExcel
  return ce.hasEmployees === false || 
  (ce.numEmployees !== null && ce.numEmployees > 0 && ce.empAdmin + ce.empProduction === ce.numEmployees);
};

export const selectAssetsComplete = (state) => {
  const ce = state.customExcel
  const hasChecked = ce.hasAssets !== null && ce.hasInventory !== null
  const assetsGood = ce.hasAssets === false || (ce.assets.length > 0 && (
    ce.assets.every(asset => 
      asset.status !== '' && asset.name !== '' && asset.dateAcq !== '' && (
        asset.status === "Owned" ? asset.type !== '' : true
      )
    )
  )) 
  
  const inventoryGood = ce.hasInventory !== null && (ce.hasInventory === false || (
    ce.hasRW === true || ce.hasWIPG === true || ce.hasFG === true
  ))

  return hasChecked && assetsGood && inventoryGood
};

export const selectExpensesComplete = (state) => {
  const ce = state.customExcel

  return ce.hasExpenses === false || (
    ce.expenses.length > 0 && ce.expenses.every(exp => exp.name !== '')
  )
};

export const selectAccountsComplete = (state) => {
  const ce = state.customExcel

  const accsPayableGood = ce.hasAccsPayable === false || (
    ce.hasAccsPayable === true && ce.accsPayable.length > 0 && ce.accsPayable.every(acc => acc.name !== '' && acc.date !== '')
  )

  const accsReceivableGood = ce.hasAccsReceivable === false || (
    ce.hasAccsReceivable === true && ce.accsReceivable.length > 0 && ce.accsReceivable.every(acc => acc.name !== '' && acc.date !== '')
  )

  return accsPayableGood && accsReceivableGood
};

export const selectAllCustomExcelInfo = (state) => {
  const ce = state.customExcel

  return {
    bizInfo: { name: ce.nameBiz, startMonth: ce.startMonth },    
    revenueInfo: { revenue: ce.revenue },
    employeesInfo: {
      hasEmployees: ce.hasEmployees,
      numEmployees: ce.numEmployees,
      empProduction: ce.empProduction,
      empAdmin: ce.empAdmin
    },
    assetsInfo: {
      hasAssets: ce.hasAssets,
      assets: ce.assets,
      hasInventory: ce.hasInventory,
      hasRW: ce.hasRW,
      hasWIPG: ce.hasWIPG,
      hasFG: ce.hasFG,
    },
    expensesInfo: { hasExpenses: ce.hasExpenses, expenses: ce.expenses },
    accountsInfo: {
      hasAccsPayable: ce.hasAccsPayable,
      accsPayable: ce.accsPayable,
      hasAccsReceivable: ce.hasAccsReceivable,
      accsReceivable: ce.accsReceivable
    }
  }
}

export const selectCustomExcelComplete = (state) => {
  return selectTypeBizComplete(state) && 
         selectRevenueComplete(state) && 
         selectEmployeesComplete(state) &&
         selectAssetsComplete(state) && 
         selectExpensesComplete(state) && 
         selectAccountsComplete(state)
}

export const selectProgress = (state) => {
  const slides = [
    selectTypeBizComplete, selectRevenueComplete, selectEmployeesComplete,
    selectAssetsComplete, selectExpensesComplete, selectAccountsComplete
  ]

  const total = slides.length

  const progress = slides.reduce((acc, fun) => {
    return acc += (fun(state) ? 1 : 0)
  }, 0)

  return Math.round((progress / total) * 100)
}
